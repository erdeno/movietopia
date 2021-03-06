# Generated by Django 3.0.2 on 2021-04-12 12:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movietopia', '0003_auto_20210412_1218'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movie',
            name='genre',
        ),
        migrations.AddField(
            model_name='movie',
            name='genres',
            field=models.ManyToManyField(blank=True, related_name='genres', to='movietopia.Genre'),
        ),
        migrations.AlterField(
            model_name='movie',
            name='posterLink',
            field=models.CharField(blank=True, max_length=280, null=True),
        ),
        migrations.AlterField(
            model_name='movie',
            name='title',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
    ]
