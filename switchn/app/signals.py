from django.dispatch import Signal
from datetime import date, timedelta
from .utils import adjust_date_to_next_monday


def dar_credito_inicial(sender, **kwargs):
    instance = kwargs['instance']
    created = kwargs['created']
    if created:
        instance.add_credit(2)

def inicializar_propiedad(sender, **kwargs):
    """
        Callback a ejecutar cuando se crea una propiedad.
        Genera el pool de Hotsales y la subasta en la semana 25
    """
    instance = kwargs.get('instance')
    created = kwargs.get('created')
    if created:
        semana_siguiente = adjust_date_to_next_monday(date.today())
        for i in range(24):
            instance.hotsales.create(semana=semana_siguiente)
            semana_siguiente += timedelta(days=7)
        instance.create_subasta(semana_siguiente, 2000)
