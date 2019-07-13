from django.core.exceptions import ObjectDoesNotExist
from rest_framework import serializers
from dynamic_rest.serializers import DynamicModelSerializer
from dynamic_rest.fields import DynamicMethodField, DynamicRelationField

from app.models import *
from users.models import SwitchnUser
from users.serializers import SwitchnUserSerializer

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

class PagoSerializer(DynamicModelSerializer):
    class Meta:
        model = Pago
        fields = (
            'monto',
            'pendiente'
        )

class ClienteSerializer(DynamicModelSerializer):
    class Meta:
        model = Cliente
        name = 'cliente'
        fields = (
            'datos_personales',
            'membresia',
            'tarjeta_credito',
            'creation_date',
            'creditos',
            'reservas',
            'subastas_ofertadas',
            'subastas_ganadas',
            'pagos',
            'solicitud',
            # write only:
            'nombre',
            'apellido',
            'email',
            'password',
            'fecha_nacimiento'
        )
        read_only_fields = (
            'datos_personales',
            'creation_date',
            'reservas',
            'membresia',
            'subastas'
        )
        deferred_fields = (
            'reservas',
            'subastas_ofertadas',
            'subastas_ganadas',
            'pagos'
        )

    datos_personales = DynamicRelationField('SwitchnUserSerializer', source='user', embed=True)
    creditos = DynamicMethodField()
    reservas = DynamicRelationField('ReservaSerializer', source="reserva_set", many=True, embed=True)
    subastas_ofertadas = DynamicRelationField('SubastaSerializer', many=True, embed=True)
    subastas_ganadas = DynamicRelationField('SubastaSerializer', many=True, embed=True)
    pagos = DynamicRelationField('PagoSerializer', many=True, embed=True)
    solicitud = DynamicMethodField()
    # para el registro y manejo del perfil:
    email = serializers.EmailField(write_only=True, required=True)
    nombre = serializers.CharField(max_length=100, write_only=True, required=True)
    apellido = serializers.CharField(max_length=100, write_only=True, required=True)
    fecha_nacimiento = serializers.DateField(write_only=True, required=True)
    password = serializers.CharField(max_length=150, write_only=True, required=True)


    def get_creditos(self, cliente):
        return cliente.get_credit_count()

    def get_reservas(self, cliente):
        return ReservaSerializer(cliente.reserva_set, many=True)

    def get_solicitud(self, cliente):
        return cliente.has_solicitud_pendiente()

    def validate_email(self, value):
        try:
            SwitchnUser.objects.get(email=value)
        except ObjectDoesNotExist:
            return value
        raise serializers.ValidationError("El email ingresado ya fue registrado")

    def create(self, validated_data):
        return Cliente.create(**validated_data)

    def update(self, instance, validated_data):
        instance.email = validated_data.get('email', instance.email)
        instance.password = validated_data.get('password', instance.password)
        instance.nombre = validated_data.get('nombre', instance.nombre)
        instance.apellido = validated_data.get('apellido', instance.apellido)
        instance.fecha_nacimiento = validated_data.get('fecha_nacimiento', instance.fecha_nacimiento)
        instance.save()
        return instance

class PropiedadSerializer(DynamicModelSerializer):
    # FIXME: OJO CON LA DIRECCION. En el cliente se requiere todos los campos (admin) ¿Como hacemos?
    class Meta:
        model = Propiedad
        name = "propiedad"
        plural_name = "propiedades"
        fields = (
            'id',
            'titulo',
            'descripcion',
            'direccion',
            'image',
            'semanas_reservadas',
            'subastas',
            'hotsales',
            'calle',
            'numero',
            'piso',
            'dpto',
            'es_activa'
        )
        deferred_fields = (
            'semanas_reservadas',
        )
        read_only_fields = (
            'subastas',
            'hotsales',
        )
        write_only_fields = (
            'calle',
            'numero',
            'piso',
            'dpto'
        )

    direccion = DynamicMethodField()
    semanas_reservadas = DynamicMethodField(requires=['reserva_set'])
    subastas = DynamicRelationField('SubastaSerializer', many=True, deferred=True, embed=True)
    hotsales = DynamicRelationField('HotsaleSerializer', many=True, deferred=True, embed=True)
    piso = serializers.CharField(max_length=10, write_only=True, required=False, allow_null=True, allow_blank=True)
    dpto = serializers.CharField(max_length=10, write_only=True, required=False, allow_null=True, allow_blank=True)

    def get_semanas_reservadas(self, propiedad):
        return propiedad.get_unavailable_weeks()

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

    def validate(self, attrs):
        direccion_registrada = Propiedad.objects.filter(
            calle=attrs.get('calle', None),
            numero=attrs.get('numero', None),
            piso__iexact=attrs.get("piso", ""),
            dpto__iexact=attrs.get("dpto", "")
            ).exclude(id=attrs.get('id', None)).exists()
        if direccion_registrada:
            raise serializers.ValidationError("La dirección ya está registrada")
        return attrs

class ReservaSerializer(DynamicModelSerializer):
    class Meta:
        model = Reserva
        fields = (
            'propiedad',
            'semana'
        )
        read_only_fields = (
            'propiedad',
        )
        required_fields = (
            'semana',
        )

    propiedad = DynamicRelationField('PropiedadSerializer', embed=True, deferred=True)

class OfertaSerializer(DynamicModelSerializer):
    class Meta:
        model = OfertaSubasta
        fields = (
            'cliente',
            'subasta',
            'monto'
        )
        read_only_fields = (
            'cliente',
            'subasta'
        )

class SubastaPropiedadSerializer(DynamicModelSerializer):
    class Meta:
        model = Propiedad
        name = "propiedad"
        plural_name = "propiedades"
        fields = (
            'id',
            'titulo',
            'descripcion',
            'direccion',
            'image',
        )

    direccion = DynamicMethodField()

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



class SubastaSerializer(DynamicModelSerializer):
    class Meta:
        model = Subasta
        name = "subasta"
        plural_name = "subastas"
        fields = (
            'id',
            'semana',
            'precio_actual',
            'precio_base',
            'ganador',
            'propiedad',
            'es_activa'
        )
        deferred_fields = (
            'es_activa'
        )
        read_only_fields = (
            'precio_actual',
            'ganador',
            'es_activa'
        )

    precio_actual = DynamicMethodField(requires=['ofertasubasta_set'])
    propiedad = DynamicRelationField('SubastaPropiedadSerializer', embed=True)
    ganador = DynamicRelationField('ClienteSerializer', deferred=True, embed=True)

    def get_precio_actual(self, subasta):
        best_offer = subasta.get_best_offer()
        if best_offer is None:
            return subasta.precio_base
        return best_offer.monto

'''
class HotsalePropiedadSerializer(DynamicModelSerializer):
    class Meta:
        model = Propiedad
        name = "propiedad"
        plural_name = "propiedades"
        fields = (
            'id',
            'titulo',
            'descripcion',
            'direccion',
            'image',
        )

    direccion = DynamicMethodField()

    def get_direccion(self, propiedad):
        return propiedad.string_direccion()
'''

class HotsaleSerializer (DynamicModelSerializer):
    class Meta:
        model = Hotsale
        name = 'hotsale'
        fields = (
            'id',
            "propiedad",
            "semana",
            "precio",
            "es_activo",
            "comprador",
        )

        deferred_fields = (
            'comprador',
        )

        read_only_fields = (
            'comprador',
        )

    propiedad = DynamicRelationField('SubastaPropiedadSerializer')