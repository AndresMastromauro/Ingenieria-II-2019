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
        montoA = 0

    contextReserva = {
        'reservas': Reserva.objects.filter(propiedad__pk=pk),
        'subasta' : Subasta.objects.get(pk=pk),
        ###'detalle' : PropiedadLiviana.objects.get(pk=pk),
        'ofertaSubasta' : montoA,
        'form' : '',
        'mensaje' : '',

    }
    if request.method=='POST':
        if request.user.profile.creditos > 0:
            contextReserva['form'] = pujarForm(request.POST)
            if contextReserva['form'].is_valid():
                if (int(contextReserva['form'].__getitem__('monto').value()) > contextReserva['ofertaSubasta']):

                    post = contextReserva['form'].save(commit=False)
                    post.cliente = request.user
                    post.subasta = Subasta.objects.get(pk=pk)
                    post.fechaHora = timezone.now()
                    post.save()

                else:
                    contextReserva['mensaje'] = 'El monto debe superar el precio actual.'
        else:
            contextReserva['mensaje'] = 'No posee creditos suficientes para pujar.'

    else:
        contextReserva['form'] = pujarForm()




    return render(request, 'app/detail_auction.html', contextReserva, {'title': 'Detalle Subasta'} )

