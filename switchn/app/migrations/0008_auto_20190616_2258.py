# Generated by Django 2.2.1 on 2019-06-17 01:58

import app.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0007_auto_20190616_2210'),
    ]

    operations = [
        migrations.AlterField(
            model_name='propiedad',
            name='image',
            field=models.ForeignKey(default=app.models.ImagenPropiedad.get_default_id, on_delete=django.db.models.deletion.DO_NOTHING, to='app.ImagenPropiedad'),
        ),
    ]
