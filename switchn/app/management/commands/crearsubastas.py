from django.core.management import BaseCommand, CommandError
from decimal import Decimal
from datetime import date, timedelta

from app.models import Propiedad

class Command (BaseCommand):
    help = 'Crea subastas para todas las propiedades activas disponibles en la semana correspondiente, si no las tuvieran ya'

    def add_arguments(self, parser):
        parser.add_argument('--precio', type=Decimal, default=Decimal('2000.00'))

    def handle(self, *args, **options):
        propiedades = Propiedad.objects.filter(es_activa=True)
        if propiedades.exists():
            creadas = 0
            semana = date.today() + timedelta(days=(7 * 25))
            precio_base = options.get('precio')
            for propiedad in propiedades:
                try:
                    subasta = propiedad.create_subasta(semana, precio_base)
                    self.stdout.write('Creada: %s' % subasta)
                    creadas += 1
                except Exception as E:
                    self.stderr.write(f'{propiedad} | Semana {semana}: {E}')
            if creadas == 0:
                self.stdout.write('No se creó ninguna subasta')
        else:
            self.stdout.write('No hay propiedades activas')

