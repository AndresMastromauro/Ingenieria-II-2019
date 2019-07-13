from django.apps import AppConfig
from django.db.models.signals import post_save

from .signals import dar_credito_inicial, inicializar_propiedad

class AppConfig(AppConfig):
    name = 'app'

    def ready(self):
        post_save.connect(dar_credito_inicial, sender='app.Cliente', dispatch_uid='dar_credito')
        post_save.connect(inicializar_propiedad, sender='app.Propiedad', dispatch_uid='init_propiedad')
