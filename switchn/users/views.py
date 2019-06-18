from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib import messages
from .forms import UserRegisterForm
from django.contrib.admin.views import main
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer
from .serializers import LoginSerializer, UserSerializer, RegisterSerializer, SignUpSerializer
from knox.auth import AuthToken, TokenAuthentication
from rest_framework.authentication import BasicAuthentication
from .models import Profile
from ajax.serializers import ProfileSerializer

def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
                form.save()
                username = form.cleaned_data.get('username')
                messages.success(request, f'{username} Su cuenta fue creada! Ya puede ingresar! ')
                return redirect('app-home')
    else:
        form = UserRegisterForm()
    return render (request, 'users/register.html', {'form':form})

@login_required
def profile(request):
        return render(request, 'users/profile.html')

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    @method_decorator(csrf_exempt)
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })



class UserDataView(generics.RetrieveAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        print(self.request.user)
        return self.request.user



# Register API
class RegisterAPI(generics.GenericAPIView):
  serializer_class = RegisterSerializer

  @method_decorator(csrf_exempt)
  def post(self, request, *args, **kwargs):
    serializer = self.get_serializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    return Response({
      "user": UserSerializer(user, context=self.get_serializer_context()).data,
      "token": AuthToken.objects.create(user)[1]
})

class SignUpView(generics.GenericAPIView):
    serializer_class = SignUpSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            user = User.objects.create_user(**(data["user_data"]))
            profile = Profile.objects.create(user=user, **(data["profile_data"]))
            return Response(ProfileSerializer(profile).data)
        raise serializers.ValidationError(serializer.errors)
