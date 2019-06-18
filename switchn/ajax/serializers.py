from rest_framework import serializers
from app.models import *
from users.models import *

class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pais
        fields = ('id', 'nombre')
        read_only_fields = ('nombre',)

class ProvinciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provincia
        fields = ('id', 'nombre')
        read_only_fields = ('nombre',)

class LocalidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Localidad
        fields = ('id', 'nombre')
        read_only_fields = ('nombre',)

class CalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Calle
        fields = ('id', 'nombre')
        read_only_fields = ('nombre',)


class TipoPropiedadSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoPropiedad
        fields = ('id', 'descripcion')

class ImagenPropiedadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagenPropiedad
        fields = ["data"]

class DireccionSerializer(serializers.Serializer):
    calle = CalleSerializer()
    localidad = LocalidadSerializer()
    provincia = ProvinciaSerializer()
    pais = PaisSerializer()
    numero = serializers.IntegerField(required=True)
    piso = serializers.CharField(required=False, max_length=10)
    dpto = serializers.CharField(required=False, max_length=10)

    '''
    def validate_pais(self, value):
        if value.get("id") is None:
            raise serializers.ValidationError("No se eligió país")
        if not Pais.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("El pais elegido no está registrado")
        return value

    def validate_provincia(self, value):
        if value.id is None:
            raise serializers.ValidationError("No se eligió provincia")
        if not Provincia.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("La provincia elegida no está registrada")
        if not Provincia.objects.filter(pais_id=self.validate_pais()).exists():
            raise serializers.ValidationError("La provincia y país elegidos no coinciden")
        return value

    def validate_localidad(self, value):
        if value.id is None:
            raise serializers.ValidationError("No se eligió localidad")
        if not Localidad.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("La localidad elegida no está registrada")
        if not Localidad.objects.filter(provincia_id=self.validate_provincia()).exists():
            raise serializers.ValidationError("La localidad y provincia elegidas no coinciden")
        return value

    def validate_calle(self, value):
        if value.id is None:
            raise serializers.ValidationError("No se eligió calle")
        if not Calle.objects.filter(id=value.id).exists():
            raise serializers.ValidationError("La calle elegida no está registrada")
        if not Calle.objects.filter(localidad_id=self.validate_localidad()).exists():
            raise serializers.ValidationError("La calle y localidad elegidas no coinciden")
    '''

    def create(self, validated_data):
        return {
            "calle": Calle.objects.get(id=validated_data["calle"]["id"]),
            "numero": validated_data.numero,
            "piso": validated_data.piso,
            "dpto": validated_data.dpto
        }



class PropiedadDetalleSerializer(serializers.ModelSerializer):
    direccion = serializers.SerializerMethodField()
    # tipo = TipoPropiedadSerializer()

    '''
    def get_image(self, propiedad):
        return propiedad.image.data
    '''

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
        fields = ('id', 'titulo', 'descripcion', 'direccion', 'image', 'es_activa')


class PropiedadSerializer(serializers.ModelSerializer):
    piso = serializers.CharField(max_length=10, required=False, default='')
    dpto = serializers.CharField(max_length=10, required=False, default='')
    class Meta:
        model = Propiedad
        fields = ('titulo', 'descripcion', 'calle', 'numero', 'piso', 'dpto', 'image')
        extra_kwargs = {
            'titulo': {
                'required': True
            },
            'calle': {
                'required': True
            },
            'numero': {
                'required': True
            },
        }


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
    best_offer = serializers.SerializerMethodField()
    ganador = serializers.SerializerMethodField()

    def get_best_offer(self, subasta):
        best = subasta.get_best_offer()
        if best is None:
            return None
        return {
            "monto": best.monto,
            "usuario": best.cliente.username
        }

    def get_ganador(self, subasta):
        cliente = subasta.reserva.cliente
        if cliente is not None:
            return {
                "username": subasta.reserva.cliente.username
            }
        return None

    class Meta:
        model = Subasta
        fields = '__all__'
        depth = 1


class CreditSerializer(serializers.ModelSerializer):
     class Meta:
        model = Credit
        fields = '__all__'

class MembresiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membresia
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    es_admin = serializers.SerializerMethodField()

    def get_es_admin(self, user):
        return user.is_staff

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'es_admin') # ademas si ponemos __all__ viaja la contraseña!


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Profile
        fields = '__all__'

class reservaRandomSerializer(serializers.ModelSerializer):
    propiedad = PropiedadDetalleSerializer(many=False, read_only=True)

    class Meta:
        model=Reserva
        fields=('semana', 'propiedad')



class subastaRandonSerializer(serializers.ModelSerializer):
    reserva = reservaRandomSerializer(many=False, read_only=True)

    class Meta:
        model=Subasta
        fields=('precioBase', 'es_activa', 'reserva')


class ProfileSerializerPost(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = ('tarjeta_credito', 'fecha_nacimiento')
