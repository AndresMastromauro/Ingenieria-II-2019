from rest_framework import serializers

from app.models import Credit, Membresia, Cliente

class CreditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Credit
        fields = '__all__'


class MembresiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membresia
        fields = '__all__'

'''
class UserSerializer(serializers.ModelSerializer):
    es_admin = serializers.SerializerMethodField()

    def get_es_admin(self, user):
        return user.is_staff

    class Meta:
        model = Cliente
        fields = ('id', 'username', 'first_name', 'last_name', 'email',
                  'es_admin')


class ClienteSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    membresia = MembresiaSerializer()
    solicitud = serializers.SerializerMethodField()

    def get_solicitud(self, profile):
        return profile.has_solicitud_pendiente()

    class Meta:
        model = Profile
        fields = '__all__'


class ProfileSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('tarjeta_credito', 'fecha_nacimiento')
'''
