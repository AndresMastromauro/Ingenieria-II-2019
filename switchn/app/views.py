from django.shortcuts import render, redirect
from .models import *
from .forms import pujarForm, closeForm
from users.models import Profile



def home(request):
    context = {
        'posts': Propiedad.objects.all().order_by('pk').reverse()
    }
    return render(request, 'app/propiedades_base.html', context)


def about(request):


    contextSubastas = {

        'subastas':  Subasta.objects.all().order_by('precioBase').distinct(),
    }
    return render(request, 'app/about.html', contextSubastas, {'title': 'About'})


def detail_auction(request, pk):
    monto = OfertaSubasta.objects.filter(subasta__pk=pk).iterator()
    montoBase = Subasta.objects.get(pk=pk).precioBase
    try:
        # Levanta error si monto esta vacio.
        montoA= max(monto, key= lambda p: p.monto).monto
    except ValueError:
        montoA = montoBase

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
                if (int(contextReserva['form'].__getitem__('monto').value()) > montoA):

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

def close_auction(request, pk):
    monto = OfertaSubasta.objects.filter(subasta__pk=pk).order_by('monto').last()
    montoBase = Subasta.objects.get(pk=pk).precioBase
    user = monto

    try:
        # Levanta error si monto esta vacio.
        montoA = monto.monto

    except:
        montoA = montoBase

    contextClose = {
        'reservas': Reserva.objects.filter(propiedad__pk=pk),
        'subasta' : Subasta.objects.get(pk=pk),
        ###'detalle' : PropiedadLiviana.objects.get(pk=pk),
        'ofertaSubasta' : montoA,
        'form' : '',
        'mensaje' : '',
        'ganador' : user
    }

    if request.method == 'POST':
        if request.user.profile.creditos > 0:
            contextClose['form'] = closeForm(request.POST, instance=contextClose['subasta'].reserva)
            contextClose['form'].save(commit=False)
            contextClose['form'].cliente = contextClose['ganador']
            contextClose['form'].save()
            perfil = Profile.objects.get(user__username=user.subasta.reserva.cliente.username)
            perfil.creditos = perfil.creditos - 1
            perfil.save()
            contextClose['mensaje'] = 'Reserva adjudicada.'


        else:
            contextClose['mensaje'] = 'El usuario no tiene los creditos suficientes para adquirir la reserva.'
    else:
        contextClose['form'] = closeForm()


    return render(request, 'admin/close_auction.html', contextClose,{'title': 'Cerrar subasta'})

