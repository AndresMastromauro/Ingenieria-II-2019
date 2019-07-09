from django.apps import AppConfig

class AppConfig(AppConfig):
    name = 'app'

    def ready(self):
        from django.db.models.signals import post_save
        from django.dispatch import receiver

        from app.models import Cliente

        @receiver(post_save, sender=Cliente, dispatch_uid='dar_credito')
        def dar_credito_inicial(sender, **kwargs):
            instance = kwargs['instance']
            created = kwargs['created']
            if created:
                instance.add_credit(2)