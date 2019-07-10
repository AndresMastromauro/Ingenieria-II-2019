from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, NotFound, ValidationError
from dynamic_rest.viewsets import DynamicModelViewSet
from knox.auth import TokenAuthentication

from app.models import Subasta
from app.serializers import SubastaSerializer, OfertaSerializer
from app.permissions import IsAdmin, ReadOnly, IsCliente

class SubastaViewSet (DynamicModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdmin | (IsAuthenticated & ReadOnly)]
    serializer_class = SubastaSerializer
    queryset = Subasta.objects.all()

    def list(self, request, *args, **kwargs):
        if not request.user.is_admin:
            request.query_params.add('filter{es_activa}', True)
        return super(SubastaViewSet, self).list(request, *args, **kwargs)

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            permission_classes = [IsAdmin]
        elif self.action == 'random':
            permission_classes = [ReadOnly]
        else:
            permission_classes = [IsCliente | IsAdmin]
        return [permission() for permission in permission_classes]

    def retrieve(self, request, *args, **kwargs):
        if not request.user.is_admin:
            request.query_params.add('filter{es_activa}', True)
        request.query_params.add('include[]', 'propiedad')
        return super(SubastaViewSet, self).retrieve(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self.get_object().close()
        return Response({'detail': 'Subasta cerrada'})

    @action(detail=True, methods=['post'], permission_classes=[IsCliente])
    def ofertar(self, request, *args, **kwargs):
        try:
            subasta = self.get_object()
            oferta = OfertaSerializer(data=request.data)
            oferta.is_valid(raise_exception=True)
            monto = oferta.validated_data['monto']
            subasta.make_offer(request.user.cliente, monto)
        except ValueError as err:
            raise ValidationError({"detail": err})
        return Response({"detail": "Oferta realizada"})

    """
    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def cerrar(self, request, *args, **kwargs):
        self.get_object().close()
        return Response({'detail': 'Subasta cerrada'})
    """

    @action(detail=False, permission_classes=[ReadOnly])
    def random(self, request, *args, **kwargs):
        queryset = self.get_queryset().filter(es_activa=True).order_by('?')
        if len(queryset) > 0:
            return Response(self.get_serializer(queryset.first()).data)
        else:
            raise NotFound