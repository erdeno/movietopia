import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

from imdb import IMDb


from .models import (
    User,
    Movie,
    Genre,
    Person,
    MovieList,
    Comment,
    Following,
    DirectMessage,
)

# create an instance of the IMDb class
imdbpy = IMDb()


def getTitle(movie):
    try:
        title = movie["title"]
    except:
        title = "Not Found!"
    return title


def getGenres(movie):
    genre_list = list()
    for genre in movie["genres"]:
        try:
            g = Genre.objects.get(genreType=genre)
        except:
            g = Genre(genreType=genre)
            g.save()
        genre_list.append(g)
    return genre_list


def getPerson(movie, role):
    person_list = list()
    try:
        persons = movie[role]
    except:
        persons = []
    for person in persons:
        try:
            name = person["name"]
            person_id = person.personID
        except:
            continue
        try:
            p = Person.objects.get(person_id=person_id)
        except:
            p = Person(person_id=person_id, name=name)
            p.save()
        person_list.append(p)
    if not person_list:
        try:
            p = Person.objects.get(person_id=1)
        except:
            p = Person(person_id=1, name="NotFound")
            p.save()
        person_list.append(p)
    return person_list


def getPoster(movie):
    try:
        text = movie["cover url"]
        link = text.split("_V1_")[0]
        link = f"{link}_V1_.jpg"
        return link
    except:
        return "Not Found!"


def getYear(movie):
    year = movie["year"]
    if not year == "????":
        return year
    else:
        return "Unknown"


def getRating(movie):
    try:
        rating = movie["rating"]
    except:
        rating = "NaN"
    return rating


def getPlot(movie):
    try:
        plot = movie["plot"][0].split("::")[0]
    except:
        plot = "Not Found..."
    return plot


def searchByTitle(title, year=False):
    movies = imdbpy.search_movie(title)
    founded = []
    for movie in movies:
        m_dict = dict()
        inDatabase = False
        if Movie.objects.filter(imdbId=movie.movieID):
            inDatabase = True
        try:
            movie_year = movie["year"]
            movie_year = int(movie_year)
        except:
            movie_year = "Not found."
        if year:
            year = int(year)
            if movie_year == year:
                m_dict["year"] = movie_year
                m_dict["title"] = movie["title"]
                m_dict["imdb_id"] = movie.movieID
                m_dict["inDatabase"] = inDatabase
                founded.append(m_dict)
        else:
            m_dict["year"] = movie_year
            m_dict["title"] = movie["title"]
            m_dict["imdb_id"] = movie.movieID
            m_dict["inDatabase"] = inDatabase
            founded.append(m_dict)
    return founded


def inList(list_name, imdb_id, user):
    lists = MovieList.objects.filter(creator=user)
    lists = list(lists)
    if list_name not in [l.name for l in lists]:
        result = False
    else:
        l = MovieList.objects.get(name=list_name, creator=user).movies.all()
        movies = [movie.imdbId for movie in l]
        if imdb_id in movies:
            result = True
        else:
            result = False
    return result


def getMovieList(user, list_name):
    try:
        m_list = MovieList.objects.get(creator=user, name=list_name)
    except:
        m_list = MovieList(creator=user, name=list_name)
        m_list.save()
    return m_list


def index(request):
    if request.user.is_authenticated:
        return render(request, "movietopia/index.html")

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("login"))


def home(request, pageNum):
    movies = Movie.objects.all()
    # movies = movies.order_by("title").all()
    # movies = [movie.serialize() for movie in movies]
    paged_movies = Paginator(movies, 12)
    current_movies = paged_movies.page(pageNum).object_list
    current_movies = [movie.serialize() for movie in current_movies]
    totalPages = paged_movies.page_range[-1]
    current_movies.insert(0, totalPages)
    return JsonResponse(current_movies, safe=False)


@csrf_exempt
def search_movie_imdb(request):
    data = json.loads(request.body)
    if data.get("imdbId") is not None:
        imdb_id = data["imdbId"]
        movie = imdbpy.get_movie(imdb_id)
        title = getTitle(movie)
        if title == "Not Found!":
            return JsonResponse({"error": "The IMDbId is not correct."}, status=400)
        else:
            inDatabase = False
            if Movie.objects.filter(imdbId=imdb_id):
                inDatabase = True
            m_dict = dict()
            m_dict["year"] = movie["year"]
            m_dict["title"] = movie["title"]
            m_dict["imdb_id"] = imdb_id
            m_dict["inDatabase"] = inDatabase
            return JsonResponse([m_dict], safe=False, status=201)
    elif data.get("title") is not None:
        if data.get("year") is not None:
            movies = searchByTitle(data["title"], data["year"])
        else:
            movies = searchByTitle(data["title"])
        return JsonResponse(movies, safe=False, status=201)


@csrf_exempt
def search_movie(request):
    data = json.loads(request.body)
    if data.get("keyword") is not None:
        res = Movie.objects.filter(title__contains=data["keyword"]).all()
        movies = [movie.serialize() for movie in res]
        return JsonResponse(movies, safe=False, status=201)


@csrf_exempt
@login_required
def add_to_list(request):
    # Creating a new tweet must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    imdb_id = data["imdbId"]
    list_name = data["list"]
    user = request.user

    m_list = getMovieList(user, list_name)
    movie = Movie.objects.get(imdbId=imdb_id)
    if movie in m_list.movies.all():
        m_list.movies.remove(movie)
    else:
        m_list.movies.add(movie)

    return JsonResponse({"success": "The movie added to list."}, status=201)


@csrf_exempt
@login_required
def add_movie(request):
    # Creating a new tweet must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    if data.get("imdbId") is not None:
        imdb_id = data["imdbId"]
        if not Movie.objects.filter(imdbId=imdb_id):
            movie_from_imdb = imdbpy.get_movie(imdb_id)
            m = imdbpy.get_movie(imdb_id)
            movie = Movie(imdbId=imdb_id)
            movie.save()
            movie.title = getTitle(m)
            movie.posterLink = getPoster(m)
            movie.year = getYear(m)
            for genre in getGenres(m):
                movie.genres.add(genre)
            for writer in getPerson(m, "writers"):
                movie.writers.add(writer)
            for director in getPerson(m, "directors"):
                movie.directors.add(director)
            movie.imdb_rating = getRating(m)
            movie.plot = getPlot(m)
            movie.save()
            return JsonResponse({"message": "Movie added successfully."}, status=201)
        else:
            return JsonResponse({"message": "Movie already in database."}, status=400)


def get_movie(request, imdb_id):
    movie = Movie.objects.get(imdbId=imdb_id)
    data = movie.serialize()
    if request.user.is_authenticated:
        user = request.user
        data["inWatchList"] = inList("watch", imdb_id, user)
        data["inWatchedList"] = inList("watched", imdb_id, user)
        data["inFavorites"] = inList("favorite", imdb_id, user)
    return JsonResponse(data, status=201)


@csrf_exempt
@login_required
def create_comment(request, imdb_id):
    try:
        movie = Movie.objects.get(imdbId=imdb_id)
    except Movie.DoesNotExist:
        return JsonResponse({"error": "Movie not found."}, status=404)

    if request.method == "POST":
        data = json.loads(request.body)
        comment_title = data.get("title")
        comment_content = data.get("content")
        if comment_content == "":
            return JsonResponse({"error": "The comment can't be empty."}, status=400)
        user = request.user
        comment = Comment(
            user=user,
            commented_movie=movie,
            comment_content=comment_content,
            comment_title=comment_title,
        )
        comment.save()
        return JsonResponse({"message": "Comment created successfully."}, status=201)

    elif request.method == "GET":
        c = Comment.objects.filter(commented_movie=movie)
        comments = c.order_by("-date").all()
        return JsonResponse([comment.serialize() for comment in comments], safe=False)


@csrf_exempt
def user(request, user_name):
    try:
        user = User.objects.get(username=user_name)
    except Tweet.DoesNotExist:
        return JsonResponse({"error": "User not found."}, status=404)

    try:
        followings = Following.objects.get(user=user)
    except:
        followings = Following(user=user)
        followings.save()
    followers = Following.objects.filter(following_user=user)

    if request.method == "GET":
        data = user.serialize()
        if followings:
            data["following"] = [
                following_user.username
                for following_user in followings.following_user.all()
            ]
        if followers:
            data["followers"] = [
                follower_user.user.username for follower_user in followers
            ]

        data["watch_movies"] = [
            movie.serialize() for movie in getMovieList(user, "watch").movies.all()
        ]
        data["watched_movies"] = [
            movie.serialize() for movie in getMovieList(user, "watched").movies.all()
        ]
        data["favorite_movies"] = [
            movie.serialize() for movie in getMovieList(user, "favorite").movies.all()
        ]
        data["comments"] = [
            comment.serialize() for comment in Comment.objects.filter(user=user)
        ]
        r_messages = DirectMessage.objects.filter(receiver=user).order_by("-date").all()
        data["received_messages"] = [message.serialize() for message in r_messages]
        s_messages = DirectMessage.objects.filter(sender=user).order_by("-date").all()
        data["sended_messages"] = [message.serialize() for message in s_messages]

        return JsonResponse(data)

    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("follow") is not None:
            follow_user = User.objects.get(username=data["follow"])
            followings.following_user.add(follow_user)
        elif data.get("unfollow") is not None:
            follow_user = User.objects.get(username=data["unfollow"])
            followings.following_user.remove(follow_user)
        elif data.get("message") is not None:
            sender = User.objects.get(username=data["sender"])
            content = data["message"]
            dm = DirectMessage(sender=sender, receiver=user, message_body=content)
            dm.save()

        return HttpResponse(status=204)

    else:
        return JsonResponse({"error": "GET or PUT request required."}, status=400)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(
                request,
                "movietopia/login.html",
                {"message": "Invalid username and/or password."},
            )
    else:
        return render(request, "movietopia/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(
                request,
                "movietopia/register.html",
                {"message": "Passwords must match."},
            )

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(
                request,
                "movietopia/register.html",
                {"message": "Username already taken."},
            )
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "movietopia/register.html")
