from rest_framework import routers
from django.urls import path, include
from . import views

router = routers.DefaultRouter()
router.register(r'paises', views.PaisesViewSet, basename='paises')
router.register(r'provincias', views.ProvinciasViewSet, basename='provincias')
router.register(r'localidades', views.LocalidadesViewSet, basename='localidades')
router.register(r'calles', views.CallesViewSet, basename='calles')
router.register(r'propiedades', views.PropiedadesViewSet, basename='propiedades')
router.register(r'tipospropiedad', views.TiposPropiedadViewSet, basename='tipospropiedad')
router.register(r'estado', views.EstadoViewSet, basename='estado')
router.register(r'reserva', views.ReservaViewSet, basename='reserva')
router.register(r'subasta', views.SubastaViewSet, basename='subasta')
router.register(r'ofertasubasta', views.OfertaSubastaViewSet, basename='ofertasubasta')
router.register(r'creditos', views.CreditViewSet, basename='creditos')
router.register(r'membresia', views.MembresiaViewSet, basename='membresia')
router.register(r'profile', views.ProfileViewSet, basename='profile')
router.register(r'usuarios', views.UserViewSet, basename='usuarios')


urlpatterns = [
    path('', include(router.urls)),
    path('calle/<int:pk>', views.CalleDetailView, name="calle-detail"),
]