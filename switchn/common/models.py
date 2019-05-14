from django.db import models

# Create your models here.

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

""" class Direccion(models.Model):
    calle = models.ForeignKey(Calle, on_delete=models.PROTECT)
    numero = models.PositiveIntegerField()
    piso = models.CharField(max_length=10, blank=True)
    dpto = models.CharField(max_length=10, blank=True)

    def tienePiso(self):
        return (self.piso != '')

    def tieneDpto(self):
        return (self.dpto != '')

    def __str__(self):
        localidad = self.calle.localidad
        provincia = localidad.provincia
        pais = provincia.pais
        direccion = "{0} #{1}".format(self.calle, self.numero)
        if (self.tienePiso()):
            direccion += ", {0}".format(self.piso)
            if (self.tieneDpto()):
                direccion += self.dpto
        return "{0}. {1}, {2}, {3}.".format(direccion, localidad, provincia, pais)

    class Meta:
        unique_together = (('calle', 'numero', 'piso', 'dpto'),) """


class TipoPropiedad (models.Model):
    descripcion = models.CharField(max_length=50, blank=False)

    def __str__(self):
        return self.descripcion

class Propiedad (models.Model):
    titulo = models.CharField(max_length=30, default='Nueva Propiedad')
    descripcion = models.CharField(max_length=200)
    # direccion = models.OneToOneField(Direccion, unique=True, on_delete=models.PROTECT)
    tipo = models.ForeignKey(TipoPropiedad, on_delete=models.PROTECT)
    # foto ?
    calle = models.ForeignKey(Calle, default=0, on_delete=models.PROTECT)
    numero = models.PositiveIntegerField(default=0)
    piso = models.CharField(max_length=10, blank=True)
    dpto = models.CharField(max_length=10, blank=True)

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
