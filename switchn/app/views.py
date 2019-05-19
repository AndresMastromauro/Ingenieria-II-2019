from django.shortcuts import render, redirect
from .models import *
from .forms import pujarForm



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
    monto = OfertaSubasta.objects.filter(subasta__pk=pk).iterator()
    try:
        # Levanta error si monto esta vacio.
        montoA= max(monto, key= lambda p: p.monto).monto
    except ValueError:
        montoA = 'Se el primero en pujar!!!'

    contextReserva = {
        'reservas': Reserva.objects.filter(propiedad__pk=pk),
        'subastas' : Subasta.objects.filter(reserva__propiedad__pk=pk),
        'detalle' : PropiedadLiviana.objects.get(pk=pk),
        'ofertaSubasta' : montoA ,
        'form' : '',
        'mensaje' : 'Debe ofertar un valor mayor al valor actual de la subasta.'

    }
    if request.method=='POST':
        if request.user.profile.creditos > 0:
             contextReserva['form'] = pujarForm(request.POST)
             if contextReserva['form'].is_valid():
                post = contextReserva['form'].save(commit=False)
                post.cliente = request.user
                post.fechaHora = timezone.now()
                post.subasta = Subasta.objects.get(pk=pk)
                post.save()

                redirect('app-about')
        else:
            contextReserva['mensaje'] = 'No posee creditos suficientes como para pujar.'

    else:
        contextReserva['form'] = pujarForm()




    return render(request, 'app/detail_auction.html', contextReserva, {'title': 'Detalle Subasta'} )

