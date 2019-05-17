from django.shortcuts import render
from .models import *

def home(request):
    context = {
        'posts': Propiedad.objects.all()
    }
    return render(request, 'app/propiedades_base.html', context)

def about(request):
    return render(request, 'app/about.html', {'title': 'About'})

