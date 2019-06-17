# Generated by Django 2.2.1 on 2019-06-17 22:42

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0012_propiedad_es_activa'),
    ]

    operations = [
        migrations.AddField(
            model_name='subasta',
            name='fecha_fin',
            field=models.DateField(null=True),
        ),
        migrations.AddField(
            model_name='subasta',
            name='fecha_inicio',
            field=models.DateField(default=django.utils.timezone.now),
        ),
    ]
