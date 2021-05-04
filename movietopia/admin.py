from django.contrib import admin

from .models import User, Movie, Genre, Person, MovieList, Comment, DirectMessage

# Register your models here.
admin.site.register(User)
admin.site.register(Movie)
admin.site.register(MovieList)
admin.site.register(Genre)
admin.site.register(Person)
admin.site.register(Comment)
admin.site.register(DirectMessage)
