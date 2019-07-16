from rest_framework.permissions import BasePermission, IsAuthenticated, SAFE_METHODS


class ReadOnly (BasePermission):
    def has_permission(self, request, view):
        return request.method in SAFE_METHODS

class IsNotAnonymous(IsAuthenticated):
    def has_permission(self, request, view):
        return super(IsNotAnonymous, self).has_permission(request, view) and not request.user.is_anonymous

class IsAdmin (IsNotAnonymous):
    def has_permission(self, request, view):
        is_authenticated = super(IsAdmin, self).has_permission(request, view)
        return is_authenticated and (request.user.is_superuser or request.user.is_admin)


class IsCliente (IsNotAnonymous):
    def has_permission(self, request, view):
        is_authenticated = super(IsCliente, self).has_permission(request, view)
        return is_authenticated and not request.user.is_admin and request.user.cliente is not None


class IsClientePremium (IsCliente):
    def has_permission(self, request, view):
        is_cliente = super(IsClientePremium, self).has_permission(request, view)
        return is_cliente and request.user.cliente.is_premium()

class IsSuperAdmin (IsAuthenticated):
    def has_permission(self, request, view):
        is_authenticated = super(IsSuperAdmin, self).has_permission(request, view)
        return is_authenticated and request.user.is_superuser