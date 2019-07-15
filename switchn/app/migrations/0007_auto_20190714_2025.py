# Generated by Django 2.1.9 on 2019-07-14 23:25

import app.utils
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0006_auto_20190710_2112'),
    ]

    operations = [
        migrations.AddField(
            model_name='hotsale',
            name='pago',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='detalle_hotsale', to='app.Pago'),
        ),
        migrations.AddField(
            model_name='pago',
            name='tipo',
            field=models.CharField(blank=True, choices=[('H', 'Hotsale'), ('S', 'Subasta')], max_length=1),
        ),
        migrations.AddField(
            model_name='subasta',
            name='pago',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='detalle_subasta', to='app.Pago'),
        ),
        migrations.AlterField(
            model_name='subasta',
            name='fecha_fin',
            field=models.DateField(default=app.utils.three_days_from_now),
        ),
    ]
