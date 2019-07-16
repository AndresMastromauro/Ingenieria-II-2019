from dynamic_rest.viewsets import DynamicModelViewSet
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError, NotFound

from app.permissions import IsSuperAdmin
from users.models import SwitchnUser
from users.serializers import SwitchnUserSerializer

class AdminsViewSet(DynamicModelViewSet):
    serializer_class = SwitchnUserSerializer
    permission_classes = [IsSuperAdmin]
    # queryset = SwitchnUser.objects.filter(is_admin=True)

    def list(self, request, *args, **kwargs):
        request.query_params.add('filter{is_admin}', True)
        return super(AdminsViewSet, self).list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        request.query_params.add('filter{is_admin}', True)
        return super(AdminsViewSet, self).retrieve(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if not user.is_admin:
            raise NotFound
        if not user.is_active:
            raise ValidationError('El usuario no se encuentra activo')
        user.is_active = False
        user.save()
        return Response({'detail': 'Cuenta desactivada'})