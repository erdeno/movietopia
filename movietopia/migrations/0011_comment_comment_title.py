# Generated by Django 3.0.2 on 2021-04-24 10:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('movietopia', '0010_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='comment_title',
            field=models.TextField(blank=True),
        ),
    ]