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


class TipoPropiedadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoPropiedad
        fields = ('id', 'descripcion')


class PropiedadSerializer(serializers.ModelSerializer):
    direccion = serializers.SerializerMethodField()
    tipo = TipoPropiedadSerializer()

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
        fields = ('id', 'titulo', 'descripcion', 'direccion', 'image', 'tipo')

class PropiedadCreacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propiedad
        fields = '__all__'

class EstadoSubastaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoSubasta
        fields = '__all__'

class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = '__all__'


class OfertaSubastaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfertaSubasta
        fields = '__all__'


class SubastaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subasta
        fields = '__all__'


class CreditSerializer(serializers.ModelSerializer):
     class Meta:
        model = Credit
        fields = '__all__'

class MembresiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membresia
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email') # ademas si ponemos __all__ viaja la contraseña!


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = '__all__'

class reservaRandomSerializer(serializers.ModelSerializer):
    propiedad = PropiedadSerializer(many=False, read_only=True)

    class Meta:
        model=Reserva
        fields=('semana', 'propiedad')



class subastaRandonSerializer(serializers.ModelSerializer):
    reserva = reservaRandomSerializer(many=False, read_only=True)

    class Meta:
        model=Subasta
        fields=('precioBase', 'estado', 'reserva')