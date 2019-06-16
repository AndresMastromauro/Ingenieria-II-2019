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
router.register(r'estadossubasta', views.EstadoSubastaViewSet, basename='estadossubasta')

# Ahora se accede a las reservas a traves de la propiedad -> /ajax/propiedades/(id)/reservas
# TODO: acceder a traves de un usuario
# router.register(r'reserva', views.ReservaViewSet, basename='reserva')

router.register(r'subasta', views.SubastaViewSet, basename='subasta')

# Ahora se accede a las ofertas a traves de la subasta! -> /ajax/subasta/(id)/ofertas
# router.register(r'ofertasubasta', views.OfertaSubastaViewSet, basename='ofertasubasta')

router.register(r'creditos', views.CreditViewSet, basename='creditos')
router.register(r'membresia', views.MembresiaViewSet, basename='membresia')
router.register(r'profile', views.ProfileViewSet, basename='profile')
router.register(r'usuarios', views.UserViewSet, basename='usuarios')


# Accesos random a propiedad y subasta
router.register(r'propiedadRandom', views.PropiedadesRandomViewSet, basename='propiedadRandom')
router.register(r'subastaRandom', views.SubastaRandomViewSet, basename='subastaRandom')


urlpatterns = [
    path('', include(router.urls)),
    path('calle/<int:pk>', views.CalleDetailView, name="calle-detail"),
]