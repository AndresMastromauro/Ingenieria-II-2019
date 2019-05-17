from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Properties(models.Model):
    name = models.CharField(max_length=100)
    ubication = models.CharField(max_length=100)
    date_posted = models.DateTimeField(default=timezone.now)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(default='default.jpg',upload_to='property_image') 

    def __str__(self):
        return self.name


class Estado (models.Model):
    descripcion = models.CharField(max_length=15)

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
    # foto ?
    calle = models.ForeignKey(Calle, default=0, on_delete=models.PROTECT)
    numero = models.PositiveIntegerField(default=0)
    piso = models.CharField(max_length=10, blank=True)
    dpto = models.CharField(max_length=10, blank=True)
    # imagen = models.ImageField(default='default.jpg', upload_to='property_image')

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


class PropiedadLiviana (models.Model):
    titulo = models.CharField(max_length=30, default='Nueva Propiedad')
    descripcion = models.CharField(max_length=200)
    tipo = models.ForeignKey(TipoPropiedad, on_delete=models.PROTECT)
    direccion = models.CharField(max_length=200, unique=True)
    imagen = models.ImageField(default='default.jpg', upload_to='property_image')

    def __str__(self):
        return "{0}: {1} ({2})".format(self.titulo, self.direccion, self.tipo)

    class Meta:
        verbose_name = 'propiedad'



class Reserva (models.Model):
    cliente = models.ForeignKey(User, null=True, on_delete=models.PROTECT)
    semana = models.DateField()
    propiedad = models.ForeignKey(Propiedad, on_delete=models.PROTECT)

    def __str__(self):
        anio = self.semana.isocalendar()[0]
        semana = self.semana.isocalendar()[1]
        return "{0} => {1} ({2}, {3})".format(self.cliente.username, self.propiedad, anio, semana)

    class Meta:
        unique_together = (('semana','propiedad'),)

class Subasta (models.Model):
    precioBase = models.DecimalField(max_digits=15, decimal_places=2)
    estado = models.ForeignKey(Estado, on_delete=models.PROTECT)
    reserva = models.ForeignKey(Reserva, on_delete=models.PROTECT)


class OfertaSubasta (models.Model):
    cliente = models.ForeignKey(User, on_delete=models.PROTECT)
    subasta = models.ForeignKey(Subasta, on_delete=models.PROTECT)
    fechaHora = models.DateTimeField(default=timezone.now)
    monto = models.DecimalField(max_digits=15, decimal_places=2)


