from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from users.models import Profile
from ajax.serializers import ProfileSerializerPost
from datetime import date

class UserSerializer (serializers.ModelSerializer):
    es_admin = serializers.SerializerMethodField()

    def get_es_admin(self, user):
        return user.is_staff

    class Meta:
        model = User
        fields = ('id', 'username', 'es_admin')

class LoginSerializer (serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Los datos de inicio de sesión son erróneos")




# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    profile = ProfileSerializerPost()


    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'password','profile')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        User.objects.create_user(**validated_data)
        profile_data = validated_data.pop('profile')
        profile = Profile.objects.create(user=user, tarjeta_credito=profile_data['tarjeta_credito'],
                                     fecha_nacimiento=profile_data['fecha_nacimiento']
    )
        return user


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