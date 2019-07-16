from rest_framework import serializers
from dynamic_rest.serializers import DynamicModelSerializer
from dynamic_rest.fields import DynamicMethodField
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from datetime import date

from .models import SwitchnUser

class SwitchnUserSerializer(DynamicModelSerializer):
    class Meta:
        model = SwitchnUser
        fields = (
            'id',
            'nombre',
            'apellido',
            'fecha_nacimiento',
            'email',
            'is_admin',
            'is_superuser',
            'membresia',
            'is_active'
        )
    membresia = DynamicMethodField()

    def get_membresia(self, user):
        try:
            return user.cliente.membresia.codigo
        except:
            return None


class LoginSerializer (serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Los datos de inicio de sesión son erróneos")


class SignUpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    fecha_nacimiento = serializers.DateField()
    tarjeta_credito = serializers.IntegerField()

    def validate_email(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("El email ya está registrado")
        return value

    def validate_fecha_nacimiento(self, value):
        today = date.today()
        if today.year - value.year - ((today.month, today.day) < (value.month, value.day)) < 18:
            raise serializers.ValidationError("Debe ser mayor de 18 años")
        return value

    def create(self, validated_data):
        # no es muy 'pythonico' que digamos, pero vamo pa delante
        return {
            "profile_data": {
                "fecha_nacimiento": validated_data["fecha_nacimiento"],
                "tarjeta_credito": validated_data["tarjeta_credito"]
            },
            "user_data": {
                "email": validated_data["email"],
                "username": validated_data["email"],
                "password": validated_data["password"],
                "first_name": validated_data["first_name"],
                "last_name": validated_data["last_name"]
            }
        }