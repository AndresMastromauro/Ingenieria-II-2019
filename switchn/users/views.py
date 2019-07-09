from django.contrib.auth import login
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.generics import RetrieveAPIView
from knox.views import LoginView as KnoxLoginView
from knox.auth import TokenAuthentication

from .serializers import SwitchnUserSerializer


class LoginView(KnoxLoginView):
    permission_classes = (AllowAny,)

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        return super(LoginView, self).post(request, format=None)



class UserDataView(RetrieveAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = SwitchnUserSerializer

    def get_object(self):
        print(self.request.user)
        return self.request.user
