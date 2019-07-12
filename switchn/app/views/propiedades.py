from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError, NotFound
from knox.auth import TokenAuthentication

from dynamic_rest.viewsets import DynamicModelViewSet

from datetime import datetime

from app.permissions import ReadOnly, IsClientePremium, IsAdmin
from app.serializers import PropiedadSerializer, ReservaSerializer, SubastaSerializer
from app.models import Propiedad



class PropiedadesViewSet(DynamicModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdmin | (IsAuthenticated & ReadOnly)]
    serializer_class = PropiedadSerializer

    def create(self, request, *args, **kwargs):
        return super(PropiedadesViewSet, self).create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        if not request.user.is_admin:
            request.query_params.add('filter{es_activa}', True)
        return super(PropiedadesViewSet, self).list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        if not request.user.is_admin:
            request.query_params.add('filter{es_activa}', True)
        request.query_params.add('include[]', 'semanas_reservadas')
        return super(PropiedadesViewSet, self).retrieve(request, *args, **kwargs)

    def get_queryset(self):
        queryset = Propiedad.objects.all()

        despues_del = self.request.query_params.get('fecha_inicio', None)
        antes_del = self.request.query_params.get('fecha_fin', None)
        if (despues_del is not None or antes_del is not None):
            try:
                despues_del = datetime.strptime(despues_del, '%Y-%m-%d').date() if despues_del is not None else None
                antes_del = datetime.strptime(antes_del, '%Y-%m-%d').date() if antes_del is not None else None
                queryset = Propiedad.get_available_between(despues_del, antes_del, queryset)
            except ValueError as err:
                raise ValidationError(err)

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

    @action(detail=True, methods=['post'], permission_classes=[IsClientePremium], serializer_class=ReservaSerializer)
    def reservar(self, request, *args, **kwargs):
        """
        Genera una reserva directa en la propiedad apuntada
        """
        propiedad = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        semana = serializer.validated_data.get('semana')
        if propiedad.is_reserva_directa_ready(semana):
            # propiedad.create_reserva(semana, request.user.cliente)
            cliente = request.user.cliente
            if cliente.has_credit():
                cliente.reservar(propiedad, semana)
                return Response({"detail": "Reservaste con exito"})
            raise ValidationError({"detail": "No tienes suficiente crédito"})
        raise ValidationError({"detail": "La semana elegida no está disponible"})

    @action(detail=False, permission_classes=[ReadOnly])
    def random(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(es_activa=True).order_by('?')
        if len(queryset) > 0:
            return Response(self.get_serializer(queryset.first()).data)
        else:
            raise NotFound


'''
class PropiedadesRandomViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticatedOrReadOnly,)
    serializer_class = PropiedadDetalleSerializer

    def get_queryset(self):
        queryset = Propiedad.objects.all()
        localidad = self.request.query_params.get('localidad', None)
        if localidad is not None:
            return queryset.filter(calle__localidad_id=localidad).order_by('?')

        provincia = self.request.query_params.get('provincia', None)
        if provincia is not None:
            return queryset.filter(calle__localidad__provincia_id=provincia).order_by('?')

        pais = self.request.query_params.get('pais', None)
        if pais is not None:
            return queryset.filter(calle__localidad__provincia__pais_id=pais).order_by('?')

        return queryset.order_by('?')[:1]


class SubastaRandomViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = SubastaRandomSerializer

    def get_queryset(self):
        queryset = Subasta.objects.all().order_by('?')[:1]
        return queryset

    @action(detail=True, methods=["get"])
    def reservaSubRan(self, request, pk=None):
        reserva = Reserva.objects.filter(subasta__id=pk)
        serializer = ReservaSerializer(reserva, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["get"])
    def propiedadSubRan(self, request, pk=None):
        prop = Propiedad.objects.filter(id=pk)
        serializer = PropiedadSerializer(prop, many=True)
        return Response(serializer.data)
'''