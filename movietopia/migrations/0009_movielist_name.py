# Generated by Django 3.0.2 on 2021-04-20 13:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movietopia', '0008_movie_plot'),
    ]

    operations = [
        migrations.AddField(
            model_name='movielist',
            name='name',
            field=models.CharField(default='none', max_length=120),
            preserve_default=False,
        ),
    ]
