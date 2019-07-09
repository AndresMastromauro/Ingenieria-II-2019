from dynamic_rest.serializers import DynamicModelSerializer
from dynamic_rest.fields import DynamicRelationField, DynamicMethodField

from app.models import Propiedad, Hotsale

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

class HotsaleSerializer (DynamicModelSerializer):
    class Meta:
        model = Hotsale
        name = 'hotsale'
        fields = (
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
            'es_activo',
            'comprador',
            'propiedad'
        )

    propiedad = DynamicRelationField('HotsalePropiedadSerializer')