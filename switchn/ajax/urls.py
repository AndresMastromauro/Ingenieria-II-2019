'''
from rest_framework import routers

from django.urls import path, include

from .views.propiedades import (
    PropiedadesViewSet,
    SubastaViewSet,
    PropiedadesRandomViewSet,
    SubastaRandomViewSet
)


from .views.usuarios import (
    ProfileViewSet
)

router = routers.DefaultRouter()

""" Propiedades """
#router.register(r'propiedades', PropiedadesViewSet, basename='propiedades-ajax')
# router.register(r'subastas', SubastaViewSet, basename='subastas')
# Accesos random a propiedad y subasta
router.register(r'propiedadRandom', PropiedadesRandomViewSet, basename='propiedadRandom')
router.register(r'subastaRandom', SubastaRandomViewSet, basename='subastaRandom')


# Ahora se accede a las reservas a traves de la propiedad -> /ajax/propiedades/(id)/reservas
# TODO: acceder a traves de un usuario


""" Usuarios """
# router.register(r'membresia', views.MembresiaViewSet, basename='membresia')
# router.register(r'profiles', ProfileViewSet, basename='profiles')

'''

urlpatterns = [
    # path('', include(router.urls)),
]

