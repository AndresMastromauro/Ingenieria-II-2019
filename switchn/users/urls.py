from django.urls import path, include
from knox import views as knox_views
from .views import UserDataView, LoginView, RegisterAPI



urlpatterns = [
    #path(r'login/', LoginView.as_view()),
    path(r'user/', UserDataView.as_view()),
    path(r'login/', LoginView.as_view(), name='knox_login'),
    path(r'logout/', knox_views.LogoutView.as_view(), name='knox_logout'),
    path(r'logoutall/', knox_views.LogoutAllView.as_view(), name='knox_logoutall'),
    path(r'register/', RegisterAPI.as_view(), name='knox_register'),
]
