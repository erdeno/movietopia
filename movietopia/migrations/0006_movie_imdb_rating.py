# Generated by Django 3.0.2 on 2021-04-12 13:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movietopia', '0005_auto_20210412_1306'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='imdb_rating',
            field=models.CharField(default='-', max_length=3),
            preserve_default=False,
        ),
    ]
