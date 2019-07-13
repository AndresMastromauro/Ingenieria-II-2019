from dynamic_rest.viewsets import DynamicModelViewSet
from rest_framework.response import Response
from rest_framework.decorators import action
from ..serializers import HotsaleSerializer

from ..permissions import IsAdmin, IsCliente, ReadOnly

class HotsalesViewSet(DynamicModelViewSet):
    serializer_class = HotsaleSerializer
    permission_classes = [IsAdmin | (IsCliente & ReadOnly)]

    def destroy(self, request, *args, **kwargs):
        self.get_object().desactivar()
        return Response({'detail': 'Hotsale desactivado'})

    @action(detail=True, methods=['post'], permission_classes=[IsCliente])
    def comprar (self, request, *args, **kwargs):
        self.get_object().vender_a(request.user.cliente)
        return Response({'detail': 'Compra realizada exitosamente'})
