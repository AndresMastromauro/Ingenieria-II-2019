from django.shortcuts import render
from django.http import HttpResponse
from common.models import *
import json
# Create your views here.

def _JSONResponse(object):
    return HttpResponse(json.dumps(object), content_type='application/json')


def listaPaises(request):
    return _JSONResponse(
        [{'id': pais.id, 'nombre': pais.nombre} for pais in Pais.objects.order_by('nombre')])

def listaProvincias(request, id_pais):
    return _JSONResponse(
        [ {'id': prov.id, 'nombre': prov.nombre} for prov in Provincia.objects.filter(pais_id=id_pais).order_by('nombre') ])

def listaLocalidades(request, id_prov):
    return _JSONResponse(
        [ {'id': loc.id, 'nombre': loc.nombre} for loc in Localidad.objects.filter(provincia_id=id_prov).order_by('nombre') ])

def listaCalles(request, id_loc):
    return _JSONResponse(
        [ {'id': calle.id, 'nombre': calle.nombre} for calle in Calle.objects.filter(localidad_id=id_loc).order_by('nombre') ])

