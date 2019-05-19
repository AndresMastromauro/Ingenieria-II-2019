from django.shortcuts import render
from .models import *



def home(request):
    context = {
        'posts': PropiedadLiviana.objects.all().order_by('pk').reverse()
    }
    return render(request, 'app/propiedades_base.html', context)


def about(request):

    contextSubastas = {

        'subastas':  Subasta.objects.all().order_by('precioBase').distinct(),
    }
    return render(request, 'app/about.html', contextSubastas, {'title': 'About'})


def detail_auction(request, pk):
    contextReserva = {
        'reservas': Reserva.objects.filter(propiedad__pk=pk),
        'subastas' : Subasta.objects.filter(reserva__propiedad__pk=pk),
        'detalle' : PropiedadLiviana.objects.get(pk=pk),
    }



    return render(request, 'app/detail_auction.html', contextReserva, {'title': 'Detalle Subasta'} )

