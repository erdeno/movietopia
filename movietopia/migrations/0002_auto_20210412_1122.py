# Generated by Django 3.0.2 on 2021-04-12 11:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movietopia', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='movielist',
            name='movies',
            field=models.ManyToManyField(blank=True, related_name='movies_in_list', to='movietopia.Movie'),
        ),
        migrations.AddField(
            model_name='movielist',
            name='public',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='user',
            name='is_editor',
            field=models.BooleanField(default=False),
        ),
    ]