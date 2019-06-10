from django.shortcuts import render, redirect
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.contrib import messages
from .forms import UserRegisterForm
from django.contrib.admin.views import main
from rest_framework import generics, permissions, serializers
from rest_framework.response import Response
from rest_framework.authtoken.serializers import AuthTokenSerializer
from .serializers import LoginSerializer, UserSerializer
from knox.auth import AuthToken, TokenAuthentication
from rest_framework.authentication import BasicAuthentication

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

