from django.urls import path, include
from dynamic_rest.routers import DynamicRouter
from rest_framework.routers import DefaultRouter
from .views.propiedades import PropiedadesViewSet
from .views.subastas import SubastaViewSet
from .views.usuarios import ClienteViewSet
from .views.utils import CallesViewSet, ProvinciasViewSet, PaisesViewSet, LocalidadesViewSet
from knox.views import LogoutView

router = DynamicRouter()

# router.register(r'login', LoginView.as_view(), base_name='login')
router.register_resource(PropiedadesViewSet)
router.register_resource(SubastaViewSet)
router.register_resource(ClienteViewSet)

geo_router = DynamicRouter()
geo_router.register(r'geo/paises', PaisesViewSet, base_name='paises')
geo_router.register(r'geo/provincias', ProvinciasViewSet, base_name='provincias')
geo_router.register(r'geo/localidades', LocalidadesViewSet, base_name='localidades')
geo_router.register(r'geo/calles', CallesViewSet, base_name='calles')

urlpatterns = [
    path(r'', include(router.urls)),
    path(r'', include(geo_router.urls)),
]

