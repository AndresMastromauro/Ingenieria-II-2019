from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError



class Credit(models.Model):
    expirationDate = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return (self.user, self.expirationDate)


class Membresia(models.Model):
    tipo = models.CharField(max_length=200, null=False)
    arancel = models.DecimalField(max_digits=15, decimal_places=2)

    def __str__(self):
        return self.tipo


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(default='default.jpg',upload_to='profile_pics')
    creationDate = models.DateTimeField(default=timezone.now)
    membresia =  models.ForeignKey(Membresia, on_delete=models.CASCADE, default=1)
    tarjeta_credito = models.CharField(max_length=20, null=False, default=000000000000000)
    fecha_nacimiento = models.DateField(default=timezone.now)

    def __str__(self):
        return f'{self.user.username} Profile'

    def get_credit_count(self):
        return self.user.credit_set.exclude(expirationDate__lte=timezone.now).count()

    def has_credit(self):
        return self.get_credit_count() > 0

    def solicitar_premium(self):
        if not self.has_solicitud_pendiente():
            return self.solicitudcambiomembresia_set.create(a_tipo=Membresia.objects.get(id=2))
        return None

    def has_solicitud_pendiente(self):
        return self.solicitudcambiomembresia_set.filter(pendiente=True).exists()


class SolicitudCambioMembresia(models.Model):
    a_tipo = models.ForeignKey(Membresia, on_delete=models.CASCADE)
    cliente = models.ForeignKey(Profile, on_delete=models.CASCADE)
    fecha_hora = models.DateTimeField(default=timezone.now)
    pendiente = models.BooleanField(default=True)
    # aceptada = models.BooleanField(default=False)

    def __str__(self):
        return f'({self.cliente}) => {self.a_tipo}'

    def aceptar(self):
        self.cliente.membresia = self.a_tipo
        self.aceptada = True
        self.pendiente = False
        self.cliente.save()
        self.save()