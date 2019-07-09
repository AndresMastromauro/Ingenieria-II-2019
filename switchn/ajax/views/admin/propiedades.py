from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied

from datetime import datetime

from app.models import (
    Propiedad,
    Subasta,
    Reserva
)

from ..serializers.propiedades import (
    PropiedadDetalleSerializer,
    PropiedadSerializer,
    SubastaSerializer,
    ReservaSerializer,
    OfertaSubastaSerializer
)


class PropiedadesAdminViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAdminUser, permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = PropiedadSerializer

    def retrieve(self, request, *args, **kwargs):
        serializer = PropiedadDetalleSerializer(self.get_object())
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        serializer = PropiedadDetalleSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        propiedad = self.get_object()
        if propiedad.has_reservas():
            propiedad.es_activa = False
            propiedad.save()
            return Response("Se cambió el estado de la propiedad a inactiva") # no sabia que responder
        propiedad.delete()
        return Response("Se eliminó la propiedad") # tampoco


    def get_queryset(self):
        queryset = Propiedad.objects.all()
        localidad = self.request.query_params.get('localidad', None)
        if localidad is not None:
            return queryset.filter(calle__localidad_id=localidad)

        provincia = self.request.query_params.get('provincia', None)
        if provincia is not None:
            return queryset.filter(calle__localidad__provincia_id=provincia)

        pais = self.request.query_params.get('pais', None)
        if pais is not None:
            return queryset.filter(calle__localidad__provincia__pais_id=pais)

        return queryset

    @action(detail=False)
    def all(self, request, *args, **kwargs): pass

    @action(detail=True)
    def reservas(self, request, *args, **kwargs):
        ''' Trae las reservas adjudicadas '''
        propiedad = self.get_object()
        # reservas = propiedad.reserva_set.exclude(cliente__isnull=True)
        reservas = propiedad.get_reservas()
        return Response(ReservaSerializer(reservas, many=True).data)

    @action(detail=True, permission_classes=[permissions.IsAuthenticatedOrReadOnly])
    def subastas(self, request, *args, **kwargs):
        if request.method == 'GET':
            subastas = self.get_object().get_subastas()
            serializer = SubastaSerializer(subastas, many=True)
            return Response(serializer.data)
        '''
        else:
            semana = datetime.strptime(request.data["semana"], "%Y-%m-%d").date()
            precio_base = request.data["precioBase"]
            subasta = self.get_object().create_subasta(semana, precio_base)
            return Response(SubastaSerializer(subasta).data)
        '''

    @subastas.mapping.post
    def create_subasta(self, request, *args, **kwargs):
        if not request.user.is_staff:
            raise PermissionDenied("Permiso denegado")
        semana = datetime.strptime(request.data["semana"], "%Y-%m-%d").date()
        precio_base = request.data["precioBase"]
        subasta = self.get_object().create_subasta(semana, precio_base)
        return Response(SubastaSerializer(subasta).data)

    @action(detail=True)
    def reservasSinAdjudicar(self, request, *args, **kwargs):
        ''' Trae las reservas sin adjudicar '''
        propiedad = self.get_object()
        reservas = propiedad.reserva_set.exclude(cliente__isnull=False).exclude(subasta__isnull=False)
        return Response(ReservaSerializer(reservas, many=True).data)
