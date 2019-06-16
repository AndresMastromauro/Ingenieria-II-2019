from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

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
  class Meta:
    model = User
    fields = ('id', 'username', 'first_name', 'last_name', 'email', 'password')
    extra_kwargs = {'password': {'write_only': True}}

  def create(self, validated_data):
    user = User.objects.create_user(username=validated_data['username'], first_name= validated_data['first_name'],
                                    last_name= validated_data['last_name'], email=validated_data['email'],
                                    password= validated_data['password'])

    return user