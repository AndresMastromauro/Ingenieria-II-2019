from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from users.models import Profile
from ajax.serializers import ProfileSerializerPost

class UserSerializer (serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

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
        fields = ('username', 'first_name', 'last_name', 'email', 'password','profile',)
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['username'], first_name= validated_data['first_name'],
                                    last_name= validated_data['last_name'], email=validated_data['email'],
                                    password= validated_data['password'])
        profile_data = validated_data.pop('profile')
        profile = Profile.objects.create(user = user, membresia=profile_data['membresia'], tarjeta_credito=profile_data['tarjeta_credito'],
                                     fecha_nacimiento=profile_data['fecha_nacimiento']
    )
        return user