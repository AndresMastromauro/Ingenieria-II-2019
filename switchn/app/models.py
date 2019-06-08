from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


def validate_monday(value):
    if not value.isocalendar() [2] == 1 :
        raise ValidationError("Debe elegir un Lunes")


class Estado (models.Model):
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


class Propiedad (models.Model):
    titulo = models.CharField(max_length=30, default='Nueva Propiedad')
    descripcion = models.CharField(max_length=200)
    tipo = models.ForeignKey(TipoPropiedad, on_delete=models.PROTECT)
    calle = models.ForeignKey(Calle, default=0, on_delete=models.PROTECT)
    numero = models.PositiveIntegerField(default=0)
    piso = models.CharField(max_length=10, blank=True)
    dpto = models.CharField(max_length=10, blank=True)
    image = models.ImageField(default='default.jpg', upload_to='property_image')

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

    class Meta:
        unique_together = (('semana','propiedad'),)

class Subasta (models.Model):
    precioBase = models.DecimalField(max_digits=15, decimal_places=2)
    estado = models.ForeignKey(Estado, on_delete=models.PROTECT)
    reserva = models.OneToOneField(Reserva, on_delete=models.PROTECT)

    def __str__(self):
        anio = self.reserva.semana.isocalendar() [0]
        semana = self.reserva.semana.isocalendar() [1]
        return "{0} / base: ${1} ({2}, semana: {3})".format(self.reserva.propiedad.titulo, self.precioBase, anio, semana)




class OfertaSubasta (models.Model):
    cliente = models.ForeignKey(User, on_delete=models.PROTECT)
    subasta = models.ForeignKey(Subasta, on_delete=models.PROTECT)
    fechaHora = models.DateTimeField(default=timezone.now)
    monto = models.DecimalField(max_digits=15, decimal_places=2)

    class Meta:
        unique_together = (('cliente','subasta'),)