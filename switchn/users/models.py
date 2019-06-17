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
        return self.user.credit_set.exclude(expirationDate__le=timezone.now).count()

