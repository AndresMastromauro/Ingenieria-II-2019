from django import forms
from .models import *

class ReservaForm(forms.ModelForm):
    class Meta:
        model = Reserva
        fields = ('propiedad', 'semana')


class SubastaForm(forms.ModelForm):
    class Meta:
        model = Subasta
        fields = '__all__'