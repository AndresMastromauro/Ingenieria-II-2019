from dynamic_rest.viewsets import DynamicModelViewSet

from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from knox.auth import TokenAuthentication

from app.permissions import IsAdmin, IsCliente
from app.serializers import SwitchnUserSerializer, ClienteSerializer


class ClienteViewSet (DynamicModelViewSet):
    authentication_classes = [TokenAuthentication]
    # permission_classes = [IsCliente]
    serializer_class = ClienteSerializer

    def get_permissions(self):
        if self.action == 'list':
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