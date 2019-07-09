from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from app.models import Cliente
from app.serializers.usuario import ClienteSerializer

'''
class UserViewSet(viewsets.ModelViewSet):
    """
        A viewset for viewing and editing user instances.
        """
    permission_classes = (permissions.IsAuthenticatedOrReadOnly,)
    serializer_class = UserSerializer
    queryset = Cliente.objects.all()
'''

class ProfileViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Cliente.objects.all()
        serializer = ClienteSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Cliente.objects.all()
        profile = get_object_or_404(queryset, pk=pk)
        serializer = ClienteSerializer(profile)
        return Response(serializer.data)


"""
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
"""