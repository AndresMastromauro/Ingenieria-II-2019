from dynamic_rest.serializers import DynamicModelSerializer
from dynamic_rest.fields import DynamicMethodField, DynamicRelationField
from rest_framework import serializers

from app.models import Propiedad, Reserva
from app.serializers.subasta import SubastaSerializer
from app.serializers.hotsale import HotsaleSerializer


class PropiedadSerializer(DynamicModelSerializer):

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
            'dpto'
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
    subastas = DynamicRelationField('SubastaSerializer', many=True, deferred=True)
    hotsales = DynamicRelationField('HotsaleSerializer', many=True, deferred=True)

    def get_semanas_reservadas(self, propiedad):
        return propiedad.get_unavailable_weeks()

    def get_direccion(self, propiedad):
        return propiedad.string_direccion()

    def validate(self, attrs):
        direccion_registrada = Propiedad.objects.filter(
            calle=attrs['calle'],
            numero=attrs['numero'],
            piso__iexact=attrs["piso"],
            dpto__iexact=attrs["dpto"]
        ).exists()
        if direccion_registrada:
            raise serializers.ValidationError("La dirección ya está registrada")
        return attrs



class ReservaSerializer (DynamicModelSerializer):
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
