from django.urls import path, include
from .api import *
from knox import views as knox_views

urlpatterns=[
    path('auths', include('knox.urls')),
    path('auths/register', RegisterApi.as_view()),
    path('auths/login', LoginApi.as_view()),
    path('auths/user', UserApi.as_view()),
    path('auths/logout', knox_views.LogoutView.as_view(), name='knox_logout'),
]