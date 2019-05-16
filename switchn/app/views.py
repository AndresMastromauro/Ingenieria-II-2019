from django.shortcuts import render
from .models import Properties

def home(request):
    context = {
        'posts': Properties.objects.all()
    }
    return render(request, 'app/app.html', context)

def about(request):
    return render(request, 'app/about.html', {'title': 'About'})

