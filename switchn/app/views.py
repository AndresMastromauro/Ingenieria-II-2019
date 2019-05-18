from django.shortcuts import render
from .models import *

def home(request):
    context = {
        'posts': PropiedadLiviana.objects.all()
    }
    return render(request, 'app/propiedades_base.html', context)

def about(request):
    return render(request, 'app/about.html', {'title': 'About'})

def detail_auction(request, pk):
    detalle = PropiedadLiviana.objects.get(pk=pk)
    return render(request, 'app/detail_auction.html', {'title': 'Detalle Subasta', 'detalle': detalle})


