from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic.base import TemplateView
from common.models import *


class PropiedadesListado (TemplateView):
    template_name = 'propiedades_base.html'

    def get_context_data(self, **kwargs):
        context = super(PropiedadesListado, self).get_context_data(**kwargs)
        context['title'] = 'Listado de Propiedades'
        context['propiedades'] = Propiedad.objects.all()
        return context


class Landing (TemplateView):
    pass


class PropiedadesAlta (TemplateView):
    template_name = 'propiedades_alta_base.html'

    def get_context_data(self, **kwargs):
        context = super(PropiedadesAlta, self).get_context_data(**kwargs)
        context['title'] = 'Agregar Propiedad'
        context['paises'] = Pais.objects.all()
        return context
    
    """ def POST(request):
        for k, v in request.POST.items():
            print("%s: %s" % (k, v)) """


def recibirDatosPropiedad(request):
    if (request.method == 'POST'):
        for k, v in request.POST.items():
            print("%s: %s" % (k, v))
    return HttpResponse('HOLA')

