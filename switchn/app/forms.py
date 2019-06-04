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


class pujarForm(forms.ModelForm):
    class Meta:
        model = OfertaSubasta
        fields = ('monto',)


class closeForm(forms.ModelForm):
    class Meta:
        model = Reserva
        exclude = ( 'semana', 'propiedad')


class DireccionForm(forms.Form):
    pais = forms.ChoiceField()
    provincia = forms.ChoiceField()
    localidad = forms.ChoiceField()
    calle = forms.CharField()
    numero = forms.NumberInput()
    piso = forms.CharField()
    dpto = forms.CharField()

    class Meta:
        fields = [
            ('pais', 'provincia', 'localidad'),
            ('calle', 'numero', 'piso', 'dpto')
        ]

class PropiedadForm(forms.ModelForm):
    # TODO: Agregar validaciones
    pais = forms.ModelChoiceField(Pais.objects.all())
    provincia = forms.ModelChoiceField(Provincia.objects.all())
    localidad = forms.ModelChoiceField(Localidad.objects.all())
    numero = forms.NumberInput()
    piso = forms.CharField(required=False)
    dpto = forms.CharField(required=False)

