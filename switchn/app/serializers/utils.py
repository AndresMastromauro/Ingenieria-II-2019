from rest_framework import serializers

from app.models import Pais, Provincia, Localidad, Calle


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
