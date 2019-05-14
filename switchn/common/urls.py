from django.urls import path
from common.views import *

urlpatterns = [
    path('geo/', listaPaises),
    path('geo/pais/<int:id_pais>', listaProvincias),
    path('geo/provincia/<int:id_prov>', listaLocalidades),
    path('geo/localidad/<int:id_loc>', listaCalles),
]