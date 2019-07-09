from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class SwitchnUserManager(BaseUserManager):
    def create_user(self, email, password, nombre, apellido, fecha_nacimiento=None):
        user = self.model(email=email, nombre=nombre, apellido=apellido, fecha_nacimiento=fecha_nacimiento)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_admin(self, email, password, nombre, apellido):
        user = self.create_user(email, password, nombre, apellido)
        user.is_admin = True
        user.save(using=self._db)
        return user


class SwitchnUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        verbose_name='email address',
        max_length=255,
        unique=True,
    )
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField(null=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'

    objects = SwitchnUserManager()

    def __str__(self):
        return f'{self.apellido.upper()}, {self.nombre} ({self.email})'