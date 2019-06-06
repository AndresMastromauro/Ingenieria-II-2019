from rest_framework import routers
from django.urls import path, include
from . import views

router = routers.DefaultRouter()
router.register(r'paises', views.PaisesViewSet, basename='paises')
router.register(r'provincias', views.ProvinciasViewSet, basename='provincias')
router.register(r'localidades', views.LocalidadesViewSet, basename='localidades')
router.register(r'calles', views.CallesViewSet, basename='calles')
router.register(r'propiedades', views.PropiedadesLivianasViewSet, basename='propiedades')

urlpatterns = [
    path('', include(router.urls)),
    path('calle/<int:pk>', views.CalleDetailView, name="calle-detail")
]