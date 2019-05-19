from django import forms
from .models import Reserva, Subasta, OfertaSubasta


class ReservaForm(forms.ModelForm):
    class Meta:
        model = Reserva
        fields = ('propiedad', 'semana')


class SubastaForm(forms.ModelForm):
    class Meta:
        model = Subasta
        fields = '__all__'


class pujarForm(forms.ModelForm):
    class Meta:
        model = OfertaSubasta
        fields = ('monto',)
