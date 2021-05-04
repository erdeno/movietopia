from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
import datetime


def current_year():
    return datetime.date.today().year


def max_value_current_year(value):
    return MaxValueValidator(current_year())(value)


class User(AbstractUser):
    profile_photo = models.CharField(max_length=280, null=True)
    is_editor = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "username": self.username,
            "profile_photo": self.profile_photo,
            "following": [],
            "followers": [],
            "watch_movies": [],
            "watched_movies": [],
            "favorite_movies": [],
            "comments": [],
            "join_date": self.joined_at.strftime("%d/%m/%Y"),
        }


class Following(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="follower")
    following_user = models.ManyToManyField("User", related_name="followingUser")


class Person(models.Model):
    person_id = models.CharField(max_length=12)
    name = models.CharField(max_length=60)

    def __str__(self):
        return self.name


class Genre(models.Model):
    genreType = models.CharField(max_length=20)

    def __str__(self):
        return self.genreType


class Movie(models.Model):
    imdbId = models.CharField(max_length=12)
    imdb_rating = models.CharField(max_length=3, blank=True, null=True)
    posterLink = models.CharField(max_length=280, blank=True, null=True)
    posterLow = models.CharField(max_length=280, blank=True, null=True)
    plot = models.TextField(blank=True, null=True)
    title = models.CharField(max_length=120, blank=True, null=True)
    year = models.PositiveSmallIntegerField(
        default=current_year(),
        validators=[MinValueValidator(1878), max_value_current_year],
    )
    genres = models.ManyToManyField("Genre", related_name="genres", blank=True)
    directors = models.ManyToManyField("Person", related_name="directors", blank=True)
    writers = models.ManyToManyField("Person", related_name="writers", blank=True)

    def serialize(self):
        return {
            "id": self.id,
            "imdbId": self.imdbId,
            "title": self.title,
            "rating": self.imdb_rating,
            "posterLink": self.posterLink,
            "posterLow": self.posterLow,
            "year": self.year,
            "genres": [genre.genreType for genre in self.genres.all()],
            "directors": [director.name for director in self.directors.all()],
            "writers": [writer.name for writer in self.writers.all()],
            "plot": self.plot,
            "inWatchList": False,
            "inWatchedList": False,
            "inFavorites": False,
        }

    def __str__(self):
        return f"{self.title} ({self.year})"


class MovieList(models.Model):
    name = models.CharField(max_length=120)
    creator = models.ForeignKey(
        "User", on_delete=models.CASCADE, related_name="creator"
    )
    movies = models.ManyToManyField("Movie", related_name="movies_in_list", blank=True)
    public = models.BooleanField(default=True)
    create_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} List from {self.creator}"


class Comment(models.Model):
    user = models.ForeignKey("User", on_delete=models.PROTECT, related_name="commenter")
    commented_movie = models.ForeignKey(
        "Movie", on_delete=models.PROTECT, related_name="commented_movie"
    )
    comment_title = models.CharField(max_length=120)
    comment_content = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "user": self.user.username,
            "title": self.comment_title,
            "comment_content": self.comment_content,
            "date": self.date.strftime("%d/%m/%Y, %H:%M:%S"),
        }

    def __str__(self):
        return f"Comment to: {self.commented_movie} from {self.user}"


class DirectMessage(models.Model):
    sender = models.ForeignKey("User", on_delete=models.PROTECT, related_name="sender")
    receiver = models.ForeignKey(
        "User", on_delete=models.PROTECT, related_name="receiver"
    )
    message_body = models.TextField(blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "sender": self.sender.username,
            "receiver": self.receiver.username,
            "message_content": self.message_body,
            "date": self.date.strftime("%d/%m/%Y, %H:%M:%S"),
        }

    def __str__(self):
        return f"Mesage to {self.receiver} from {self.sender}"
