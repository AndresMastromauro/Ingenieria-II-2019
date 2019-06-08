from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Credit(models.Model):
    expirationDate = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def _str_(self):
        return (self.user, self.expirationDate)

class Membresia(models.Model):
    tipo = models.CharField(max_length=200,default='estandar')

    def _str_(self):
        return self.tipo

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(default='default.jpg',upload_to='profile_pics')
    creationDate = models.DateTimeField(default=timezone.now)
    membresia =  models.OneToOneField(Membresia, on_delete=models.CASCADE)

    def __str__(self):
        return f'{self.user.username} Profile'

