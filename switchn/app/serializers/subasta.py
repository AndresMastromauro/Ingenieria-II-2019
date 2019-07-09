from rest_framework.serializers import Serializer, DecimalField
from dynamic_rest.serializers import DynamicModelSerializer
from dynamic_rest.fields import DynamicMethodField, DynamicRelationField

from app.models import Subasta, Propiedad, OfertaSubasta
from app.serializers.usuario import ClienteSerializer

'''
class OfertaSerializer(Serializer):
    monto = DecimalField(max_digits=15, decimal_places=2)
'''

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
        return propiedad.string_direccion()



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
    propiedad = DynamicRelationField('SubastaPropiedadSerializer')
    ganador = DynamicRelationField('ClienteSerializer', deferred=True)

    def get_precio_actual(self, subasta):
        best_offer = subasta.get_best_offer()
        if best_offer is None:
            return subasta.precio_base
        return best_offer.monto