# Generated by Django 2.2.1 on 2019-05-12 19:23

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='properties',
            name='date_posted2',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]