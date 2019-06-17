from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from datetime import date, timedelta


def validate_monday(value):
    if not value.isocalendar() [2] == 1 :
        raise ValidationError("Debe elegir un Lunes")


class EstadoSubasta (models.Model):
    descripcion = models.CharField(max_length=15)

    def __str__(self):
        return self.descripcion


class Pais(models.Model):
    nombre = models.CharField(max_length=100, blank=False)

    def __str__(self):
        return self.nombre


class Provincia(models.Model):
    nombre = models.CharField(max_length=100, blank=False)
    pais = models.ForeignKey(Pais, on_delete=models.PROTECT)

    def __str__(self):
        return self.nombre


class Localidad(models.Model):
    nombre = models.CharField(max_length=100, blank=False)
    provincia = models.ForeignKey(Provincia, on_delete=models.PROTECT)

    def __str__(self):
        return self.nombre


class Calle(models.Model):
    nombre = models.CharField(max_length=100, blank=False)
    localidad = models.ForeignKey(Localidad, on_delete=models.PROTECT)

    def __str__(self):
        return self.nombre


class TipoPropiedad (models.Model):
    descripcion = models.CharField(max_length=50, blank=False)

    def __str__(self):
        return self.descripcion


class ImagenPropiedad(models.Model):
    data = models.TextField()

    @staticmethod
    def get_default_id():
        return 1

    @staticmethod
    def get_default():
        return ImagenPropiedad.objects.get(id=ImagenPropiedad.get_default_id())


class Propiedad (models.Model):
    titulo = models.CharField(max_length=30)
    descripcion = models.CharField(max_length=200)
    # tipo = models.ForeignKey(TipoPropiedad, on_delete=models.PROTECT)
    calle = models.ForeignKey(Calle, on_delete=models.PROTECT)
    numero = models.PositiveIntegerField()
    piso = models.CharField(max_length=10, blank=True)
    dpto = models.CharField(max_length=10, blank=True)
    # image = models.ImageField(default='default.jpg', upload_to='property_image')
    image = models.TextField(blank=True)

    def string_direccion(self):
        localidad = self.calle.localidad
        provincia = localidad.provincia
        pais = provincia.pais
        direccion = "{0} #{1}".format(self.calle, self.numero)
        if (self.piso != ""):
            direccion += ", {0}".format(self.piso)
        if (self.dpto != ""):
            direccion += ", dpto {0}".format(self.dpto)
        return "{0}. {1}, {2}, {3}.".format(direccion, localidad, provincia, pais)

    def __str__(self):
        return "{0}: {1} ({2})".format(self.titulo, self.string_direccion(), self.tipo)

    def is_available_on_week(self, semana):
        # NOTA: se asume que date.weekday() y reserva.semana.weekday() = 0 (lunes)
        if self.reserva_set.filter(semana=semana).exclude(cliente__isnull=True).exists():
            # esta reservada
            return False
        hoy = semana.today()
        seis_meses = timedelta(weeks=25)
        un_anio = timedelta(weeks=52)
        return (hoy + seis_meses) < semana < (hoy + un_anio)

    def get_subastas(self):
        return Subasta.objects.filter(reserva__propiedad=self).filter(estado=1)

    class Meta:
        unique_together = (('calle', 'numero', 'piso', 'dpto'),)



class Reserva (models.Model):
    cliente = models.OneToOneField(User, blank=True,null=True, on_delete=models.PROTECT)
    semana = models.DateField(validators=[validate_monday])
    propiedad = models.ForeignKey(Propiedad, on_delete=models.PROTECT)

    def __str__(self):
        anio = self.semana.isocalendar()[0]
        semana = self.semana.isocalendar()[1]
        return "{0} ({1}, semana: {2})".format(self.propiedad, anio, semana)

    def is_open(self):
        return self.cliente is None

    def is_hotsale_ready(self):
        semanas_restantes = self.semana - date.today()
        return self.is_open() and (timedelta(weeks=1) < semanas_restantes < timedelta(weeks=25))

    class Meta:
        unique_together = (('semana','propiedad'),)


class Subasta (models.Model):
    precioBase = models.DecimalField(max_digits=15, decimal_places=2)
    estado = models.ForeignKey(EstadoSubasta, on_delete=models.PROTECT)
    reserva = models.OneToOneField(Reserva, on_delete=models.PROTECT)

    def __str__(self):
        anio = self.reserva.semana.isocalendar() [0]
        semana = self.reserva.semana.isocalendar() [1]
        return "{0} / base: ${1} ({2}, semana: {3})".format(self.reserva.propiedad.titulo, self.precioBase, anio, semana)

    def is_open(self):
        return self.estado.id == 1 and self.reserva.is_open()

    def get_best_offer(self):
        # siempre es la ultima si controlamos el monto en la creacion
        return self.ofertasubasta_set.last()

    def make_offer(self, cliente, monto):
        if monto <= self.precioBase:
            raise ValidationError("El monto ingresado debe ser mayor al precio base")

        if self.get_best_offer() is not None and monto <= self.get_best_offer().monto:
            raise ValidationError("El monto ingresado debe ser mayor al de la última oferta")

        return self.ofertasubasta_set.create(cliente=cliente, monto=monto)

    def close(self):
        pass



class OfertaSubasta (models.Model):
    cliente = models.ForeignKey(User, on_delete=models.PROTECT)
    subasta = models.ForeignKey(Subasta, on_delete=models.PROTECT)
    fechaHora = models.DateTimeField(default=timezone.now)
    monto = models.DecimalField(max_digits=15, decimal_places=2)

    def __str__(self):
        return f'[{self.subasta}] {self.cliente} => ${self.monto} ({date.strftime(self.fechaHora, "%d/%m/%Y - %H:%M:%S")})'
    # class Meta:
        # unique_together = (('cliente','subasta'),) <- por que?


