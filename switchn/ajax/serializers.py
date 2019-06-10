from rest_framework import serializers
from app.models import *
from users.models import *

class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pais
        fields = '__all__'

class ProvinciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provincia
        fields = '__all__'

class LocalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localidad
        fields = '__all__'

class CalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calle
        fields = '__all__'

class DireccionSerializer(serializers.Serializer):
    pass

class PropiedadSerializer(serializers.ModelSerializer):
    direccion = serializers.SerializerMethodField()

    def get_direccion(self, propiedad):
        calle = propiedad.calle
        localidad = calle.localidad
        provincia = localidad.provincia
        pais = provincia.pais
        return {
            "calle": {
                "nombre": calle.nombre,
                "id": calle.id
            },
            "numero": propiedad.numero,
            "piso": propiedad.piso,
            "dpto": propiedad.dpto,
            "localidad": {
                "nombre": localidad.nombre,
                "id": localidad.id
            },
            "provincia": {
                "nombre": provincia.nombre,
                "id": provincia.id
            },
            "pais": {
                "nombre": pais.nombre,
                "id": pais.id
            }
        }

    class Meta:
        model = Propiedad
        fields = '__all__'

class EstadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estado
        fields = '__all__'

class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = '__all__'

class SubastaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subasta
        fields = '__all__'

class OfertaSubastaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfertaSubasta
        fields = '__all__'

class CreditSerializer(serializers.ModelSerializer):
     class Meta:
        model = Credit
        fields = '__all__'

class MembresiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membresia
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
