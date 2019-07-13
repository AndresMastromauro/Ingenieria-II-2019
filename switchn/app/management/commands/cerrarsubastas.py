from django.core.management import BaseCommand, CommandError
from datetime import date

from app.models import Subasta

class Command (BaseCommand):
    help = 'Cierra las subastas que han alcanzado su fecha de expiracion'

    def handle(self, *args, **options):
        subastas = Subasta.objects.filter(es_activa=True, fecha_fin__lte=date.today())
        if subastas.exists():
            for subasta in subastas:
                try:
                    subasta.close()
                    self.stdout.write('Cerrada: %s' % subasta)
                except Exception as E:
                    raise CommandError(E)
        else:
            self.stdout.write('No hay subastas para cerrar')

