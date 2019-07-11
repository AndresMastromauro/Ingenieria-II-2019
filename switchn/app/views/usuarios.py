from dynamic_rest.viewsets import DynamicModelViewSet

from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action

from knox.auth import TokenAuthentication

from app.permissions import IsAdmin, IsCliente
from app.serializers import SwitchnUserSerializer, ClienteSerializer


class ClienteViewSet (DynamicModelViewSet):
    authentication_classes = [TokenAuthentication]
    serializer_class = ClienteSerializer

    def get_permissions(self):
        if self.action in ['list']:
            permission_classes = [IsAdmin]
        elif self.action == 'create':
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsCliente | IsAdmin]
        return [permission() for permission in permission_classes]


    def list(self, request, *args, **kwargs):
        return super(ClienteViewSet, self).list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        super(ClienteViewSet, self).create(request, *args, **kwargs)
        return Response({"detail": "Cuenta creada exitosamente"})

    def retrieve(self, request, *args, **kwargs):
        if request.user.is_admin or request.user.cliente == self.get_object():
            return super(ClienteViewSet, self).retrieve(request, *args, **kwargs)
        raise PermissionDenied

    def update(self, request, *args, **kwargs):
        if request.user.is_admin or request.user.cliente == self.get_object():
            return super(ClienteViewSet, self).update(request, *args, **kwargs)
        raise PermissionDenied

    def destroy(self, request, *args, **kwargs):
        if request.user.is_admin or request.user.cliente == self.get_object():
            return super(ClienteViewSet, self).destroy(request, *args, **kwargs)
        raise PermissionDenied

    @action(detail=True, methods=['post', 'delete'], permission_classes=[IsAdmin | IsCliente])
    def solicitud(self, request, *args, **kwargs):
        cliente = self.get_object()
        if request.user.is_admin:
            if cliente.has_solicitud_pendiente():
                solicitud = cliente.get_ultima_solicitud()
                if request.method.lower() == 'post':
                    solicitud.aceptar()
                    return Response({'detail': f'Solicitud de pase a {solicitud.a_tipo} de {cliente.user.apellido}, {cliente.user.nombre} aceptada'})
                else:
                    solicitud.rechazar()
                    return Response({'detail': f'Solicitud de pase a {solicitud.a_tipo} de {cliente.user.apellido}, {cliente.user.nombre} rechazada'})
            raise ValidationError('El cliente no tiene solicitudes pendientes')
        elif cliente == request.user.cliente:
            if request.method.lower() == 'post':
                if not cliente.has_solicitud_pendiente():
                    if cliente.is_premium():
                        solicitud = cliente.solicitar_estandar()
                    else:
                        solicitud = cliente.solicitar_premium()
                    return Response({'detail': f'Realizaste una solicitud de pase a {solicitud.a_tipo}'})
                raise ValidationError('Ya tienes una solicitud pendiente')
            else:
                if cliente.has_solicitud_pendiente():
                    solicitud = cliente.get_ultima_solicitud()
                    solicitud.cancelar()
                    return Response({'detail': f'Cancelaste tu solicitud de pase a {solicitud.a_tipo}'})
                else:
                    raise ValidationError('No tienes solicitudes pendientes')
        else:
            raise PermissionDenied





'''
class UserDataView(RetrieveAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        print(self.request.user)
        return self.request.user
'''

"""
class SignUpView(GenericAPIView):
    serializer_class = SignUpSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            cliente = Cliente.create(
                data['email'],
                data['password'],
                data['first_name'],
                data['last_name'],
                data['fecha_nacimiento'],
                data['tarjeta_credito']
                )
            return Response({"detail": "Cuenta creada exitosamente"})
        raise ValidationError(serializer.errors)
"""