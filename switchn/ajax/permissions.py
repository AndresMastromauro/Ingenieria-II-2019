from rest_framework.permissions import BasePermission
from users.models import Profile

class IsClientePremium (BasePermission):
    def has_permission(self, request, view):
        user = request.user
        profile = Profile.objects.get(user=user)
        return profile.is_premium()