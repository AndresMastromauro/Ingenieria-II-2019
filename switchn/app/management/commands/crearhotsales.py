from django.core.management import BaseCommand
from datetime import date, timedelta

from app.models import Propiedad
from app.utils import adjust_date_to_next_monday

class Command (BaseCommand):
    help = "Genera el pool de hotsales para todas las propiedades que no lo tuvieran"

    def handle(self, *args, **options):
        propiedades = Propiedad.objects.all()
        for propiedad in propiedades:
            creados = 0
            self.stdout.write('Creando hotsales para "%s"...' % propiedad, ending='')
            lunes_siguiente = adjust_date_to_next_monday(date.today())
            for i in range(24):
                try:
                    propiedad.create_hotsale(semana=lunes_siguiente)
                    creados += 1
                except:
                    pass
                lunes_siguiente = lunes_siguiente + timedelta(days=7)
            self.stdout.write('%i hotsales creados' % creados)