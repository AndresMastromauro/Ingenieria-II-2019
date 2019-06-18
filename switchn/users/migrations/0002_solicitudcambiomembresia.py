# Generated by Django 2.2.1 on 2019-06-18 22:22

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SolicitudCambioMembresia',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_hora', models.DateTimeField(default=django.utils.timezone.now)),
                ('pendiente', models.BooleanField(default=True)),
                ('a_tipo', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.Membresia')),
                ('cliente', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.Profile')),
            ],
        ),
    ]
