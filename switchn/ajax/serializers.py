from rest_framework import serializers
from app.models import *

class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pais
        fields = '__all__'

class ProvinciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provincia
        fields = '__all__'

class LocalidadSerializer(serializers.ModelSerializer):
    calles = serializers.HyperlinkedRelatedField(view_name="calles", many=True, read_only=True)
    class Meta:
        model = Localidad
        fields = '__all__'

class CalleSerializer(serializers.HyperlinkedModelSerializer):
    localidad = serializers.HyperlinkedIdentityField(view_name="localidades")
    class Meta:
        model = Calle
        fields = '__all__'

class PropiedadLivianaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propiedad
        fields = '__all__'
