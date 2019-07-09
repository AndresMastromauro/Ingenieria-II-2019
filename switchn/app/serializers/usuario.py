from dynamic_rest.serializers import DynamicModelSerializer
from dynamic_rest.fields import DynamicRelationField, DynamicMethodField
from django.db.models import ObjectDoesNotExist
from rest_framework import serializers

from datetime import date

from app.serializers.subasta import SubastaSerializer
from app.serializers.propiedad import ReservaSerializer
from app.models import Cliente, Pago
from users.models import SwitchnUser


class PagoSerializer(DynamicModelSerializer):
    class Meta:
        model = Pago
        fields = (
            'monto',
            'pendiente'
        )


class SwitchnUserSerializer(DynamicModelSerializer):
    class Meta:
        model = SwitchnUser
        fields = (
            'id',
            'nombre',
            'apellido',
            'fecha_nacimiento',
            'email'
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



'''
class UserSerializer(DynamicModelSerializer):
    class Meta:
        model = User
        name = 'user'
        fields = (
            'first_name',
            'last_name',
            'email',
            'es_admin',
            'profile'
        )

    profile = DynamicRelationField('ClienteSerializer', embed=True, required=False)
    es_admin = DynamicMethodField()

    def get_es_admin(self, u):
        return u.is_staff
'''

class SignUpSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    fecha_nacimiento = serializers.DateField()
    tarjeta_credito = serializers.IntegerField()

    '''
    def validate_email(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("El email ya está registrado")
        return value
    '''

    def validate_fecha_nacimiento(self, value):
        today = date.today()
        if today.year - value.year - ((today.month, today.day) < (value.month, value.day)) < 18:
            raise serializers.ValidationError("Debe ser mayor de 18 años")
        return value

    def create(self, validated_data):
        # no es muy 'pythonico' que digamos, pero vamo pa delante
        return {
            "fecha_nacimiento": validated_data["fecha_nacimiento"],
            "tarjeta_credito": validated_data["tarjeta_credito"],
            "email": validated_data["email"],
            "password": validated_data["password"],
            "first_name": validated_data["first_name"],
            "last_name": validated_data["last_name"]
        }