from django.urls import path, include
from backoffice.views import *

urlpatterns = [
    path('propiedades/', PropiedadesListado.as_view()),
    path('propiedades/alta', PropiedadesAlta.as_view()),
    path('propiedades/confirm', recibirDatosPropiedad),
    path('data/', include('common.urls'))
]