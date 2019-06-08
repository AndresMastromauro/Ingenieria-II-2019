from rest_framework import viewsets, permissions, views
from rest_framework.response import Response
from django.http import Http404, HttpResponseForbidden
from app.models import *
from .serializers import *

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
    pass

'''
class PropiedadesLivianasViewSet(viewsets.ModelViewSet):
    serializer_class = PropiedadLivianaSerializer
    queryset = PropiedadLiviana.objects.all()
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
'''

