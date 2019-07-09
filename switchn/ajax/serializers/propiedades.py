from rest_framework import serializers

from app.models import Propiedad, Reserva, Subasta, OfertaSubasta

class ReservaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reserva
        fields = '__all__'


class OfertaSubastaSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfertaSubasta
        fields = '__all__'


class PropiedadDetalleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Propiedad
        fields = (
            'id',
            'titulo',
            'descripcion',
            'direccion',
            'image',
            'es_activa',
            'semanas_reservadas'
        )

    direccion = serializers.SerializerMethodField()
    semanas_reservadas = serializers.SerializerMethodField()

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

    def get_semanas_reservadas(self, propiedad):
        return propiedad.get_unavailable_weeks()


class PropiedadSerializer(serializers.ModelSerializer):
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

    piso = serializers.CharField(max_length=10, required=False, default='')
    dpto = serializers.CharField(max_length=10, required=False, default='')


class SubastaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subasta
        fields = '__all__'
        depth = 1

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


class ReservaRandomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Reserva
        fields=('semana', 'propiedad')

    propiedad = PropiedadDetalleSerializer(many=False, read_only=True)


class SubastaRandomSerializer(serializers.ModelSerializer):
    class Meta:
        model=Subasta
        fields=('precioBase', 'es_activa', 'reserva')

    reserva = ReservaRandomSerializer(many=False, read_only=True)