# Generated by Django 2.2.1 on 2019-05-17 05:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_auto_20190516_2024'),
    ]

    operations = [
        migrations.AddField(
            model_name='properties',
            name='image',
            field=models.ImageField(default='default.jpg', upload_to='property_image'),
        ),
    ]