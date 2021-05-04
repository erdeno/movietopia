![Logo of the project](/movietopia/static/movietopia/logos/logo.png)


# Movietopia

It is capstone project for Harvard Course: [CS50’s Web Programming with Python and JavaScript](https://cs50.harvard.edu/web/2020/)

The personal movie database with +1000 movies. It is possible to add more movies to the database with movie names or imdb ids. You can track your watched movies and the movies you want to watch, also you can add the movies to your favorite list.


![Alt Text](/movietopia/static/movietopia/logos/movietopia.gif)



## What's inside

    ├── movies                  # Project folder
    ├── movietopia              # App folder
    │   ├── static/movietopia   # Table of contents
    │   │     ├── css             # Css files for project            
    │   │     ├── js              # Javascript documents for project
    │   │     ├── logos           # Project logos
    │   │     ├── img             # Background images for login page
    │   │     │   ├── posters     # Poster images for movies
    │   ├── templates             # Html files for project
    │   ├── models.py           # Models file of the project I created 8 models (User, Following, Person, Genre, etc.)
    │   ├── urls.py             # Url file of the project
    │   ├── views.py            # Views file of the project
    │   ├── README.md           # Getting started guide
    │   └── ...                 # etc.
    └── ...

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 


### Prerequisites

What things you need to install the software and how to install them

```
python==3.*
asgiref==3.3.4
Django==3.0.2
greenlet==1.0.0
IMDbPY==2020.9.25
lxml==4.6.3
pytz==2021.1
SQLAlchemy==1.4.7
sqlparse==0.4.1

```

### Installing

A step by step series of examples that tell you how to get a development env running

You need to install required packages first

```
pip install -r requirements.txt
```

Then you need to make migrations

```
python manage.py makemigrations
```
and for applying migrations

```
python manage.py migrate
```

Then start the server

```
python manage.py runserver
```



## Built With

* [Django](https://docs.djangoproject.com/en/3.0/) - The web framework used
* [Javascript](https://www.javascript.com/) - Frontend
* [IMDbPY](https://github.com/alberanid/imdbpy) - Used to retrieve movie informations



