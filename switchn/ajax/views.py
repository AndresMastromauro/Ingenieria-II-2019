from rest_framework import viewsets, permissions, views
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import Http404, HttpResponseForbidden
from app.models import *
from .serializers import *
from users.models import *
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class PaisesViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = PaisSerializer
    queryset = Pais.objects.all().order_by('nombre')


class ProvinciasViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = ProvinciaSerializer

    def get_queryset(self):
        queryset = Provincia.objects.all().order_by('nombre')
        pais = self.request.query_params.get('pais', None)
        id_provincia = self.request.query_params.get('id', None)
        if id_provincia is not None:
            return queryset.filter(id=id_provincia)
        if pais is not None:
            queryset = queryset.filter(pais_id=pais)
        return queryset


class LocalidadesViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = LocalidadSerializer

    def get_queryset(self):
        queryset = Localidad.objects.all().order_by('nombre')
        provincia = self.request.query_params.get('provincia', None)
        pais = self.request.query_params.get('pais', None)
        id_localidad = self.request.query_params.get('id', None)
        if id_localidad is not None:
            return queryset.filter(id=id_localidad)
        if provincia is not None:
            queryset = queryset.filter(provincia_id=provincia)
        return queryset


class CallesViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = CalleSerializer

    def get_queryset(self):
        queryset = Calle.objects.all().order_by('nombre')
        localidad = self.request.query_params.get('localidad', None)
        id_calle = self.request.query_params.get('id', None)
        if id_calle is not None:
            return queryset.filter(id=id_calle)
        if localidad is not None:
            queryset = queryset.filter(localidad_id=localidad)
        return queryset

class CalleDetailView(views.APIView):
    def get_object(self, pk):
        try:
            return Calle.objects.get(pk=pk)
        except:
            raise Http404

    def get(self, request, pk):
        calle = self.get_object(pk)
        serializer = CalleSerializer(calle)
        return Response(serializer.data)


class PropiedadesViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = PropiedadSerializer

    def create(self, request, *args, **kwargs):
        serializer = PropiedadCreacionSerializer(data=request.data)
        if serializer.is_valid():
            Propiedad.objects.create(**serializer.validated_data)
            return Response("Ok")
        return Response("bad")

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

    @action(detail=True)
    def reservas(self, request, *args, **kwargs):
        ''' Trae las reservas adjudicadas '''
        propiedad = self.get_object()
        reservas = propiedad.reserva_set.exclude(cliente__isnull=True)
        return Response(ReservaSerializer(reservas, many=True).data)

    @action(detail=True)
    def subastas(self, request, *args, **kwargs):
        subastas = self.get_object().get_subastas()
        serializer = SubastaSerializer(subastas, many=True)
        return Response(serializer.data)


class TiposPropiedadViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = TipoPropiedadSerializer
    queryset = TipoPropiedad.objects.all()


class EstadoSubastaViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = EstadoSubastaSerializer

    def get_queryset(self):
        queryset = EstadoSubasta.objects.all()
        return queryset

'''
class ReservaViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = ReservaSerializer

    def get_queryset(self):
        queryset = Reserva.objects.all().order_by('semana')
        return queryset
'''


class SubastaViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = SubastaSerializer

    def get_queryset(self):
        queryset = Subasta.objects.all().order_by('precioBase')
        return queryset

    @action(detail=True, methods=["get"])
    def ofertas(self, request, *args, **kwargs):
        subasta = self.get_object()
        ofertas = OfertaSubasta.objects.filter(subasta_id=subasta.id)
        serializer = OfertaSubastaSerializer(ofertas, many=True)
        return Response(serializer.data)


class OfertaSubastaViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = OfertaSubastaSerializer

    def get_queryset(self):
        queryset = OfertaSubasta.objects.all().order_by('monto')
        return queryset


class CreditViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Credit.objects.all()
        serializer = CreditSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Credit.objects.all()
        credit = get_object_or_404(queryset, pk=pk)
        serializer = CreditSerializer(credit)
        return Response(serializer.data)

class MembresiaViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Membresia.objects.all()
        serializer = MembresiaSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Membresia.objects.all()
        membresia = get_object_or_404(queryset, pk=pk)
        serializer = MembresiaSerializer(membresia)
        return Response(serializer.data)

class ProfileViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Profile.objects.all()
        serializer = ProfileSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Profile.objects.all()
        profile = get_object_or_404(queryset, pk=pk)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)



class UserViewSet(viewsets.ModelViewSet):
    """
        A viewset for viewing and editing user instances.
        """
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = UserSerializer
    queryset = User.objects.all()




#class PropiedadesLivianasViewSet(viewsets.ModelViewSet):
#    serializer_class = PropiedadLivianaSerializer
#    queryset = Propiedad.objects.all()
#    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)


