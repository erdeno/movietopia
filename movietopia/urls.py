from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    # API Routes
    path("all_movies/<int:pageNum>", views.home, name="home"),
    path("movie/<str:imdb_id>", views.get_movie, name="get_movie"),
    path("search_movies_imdb", views.search_movie_imdb, name="search_movie_imdb"),
    path("search_movies", views.search_movie, name="search_movie"),
    path("comments/<str:imdb_id>", views.create_comment, name="create_comment"),
    path("add_to_database", views.add_movie, name="add_movie"),
    path("add_to_list", views.add_to_list, name="add_to_list"),
    path("users/<str:user_name>", views.user, name="user"),
]
