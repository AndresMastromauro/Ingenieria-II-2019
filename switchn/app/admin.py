from django.contrib import admin
from django.contrib.admin import ModelAdmin
from django.forms import inlineformset_factory
from .models import *
from .forms import *

# admin.site.register(Properties)

admin.site.site_header = 'Home Switch Home'

@admin.register(Reserva)
class ReservaAdmin (admin.ModelAdmin):
    pass

class ReservaInline(admin.StackedInline):
    model = Reserva

@admin.register(Subasta)
class SubastaAdmin (admin.ModelAdmin):
    formset = inlineformset_factory(Reserva, Subasta, form=SubastaForm)
    change_form_template = "admin/change_form_subasta.html"

@admin.register(Propiedad)
class PropiedadAdmin (admin.ModelAdmin):
    form = PropiedadForm
    fieldsets = (
        (None, {
            'fields': ['titulo','descripcion', 'tipo']
        }),
        ('Direccion',{
            'fields': [
                ('pais', 'provincia', 'localidad'),
                ('calle', 'numero'),
                ('piso', 'dpto')
            ]
        })
    )

    class Media:
        js = ('jquery-3.4.1.js', 'utils.js','admin/change_form_propiedad.js')

@admin.register(Estado)
class EstadoAdmin (admin.ModelAdmin):
    pass

@admin.register(OfertaSubasta)
class OfertaSubastaAdmin (admin.ModelAdmin):
    pass

class MyModelAdmin(admin.ModelAdmin):

    #...
    change_list_template = "path/to/change_list.html"


@admin.register(Calle)
class CalleAdmin (admin.ModelAdmin):
    pass

'''
class CalleInline (admin.TabularInline):
    model = Calle
'''

@admin.register(Localidad)
class LocalidadAdmin (admin.ModelAdmin):
    pass

'''
class LocalidadInline (admin.TabularInline):
    model = Localidad
'''

@admin.register(Provincia)
class ProvinciaAdmin (admin.ModelAdmin):
    pass

'''
class ProvinciaInline (admin.StackedInline):
    model = Provincia
'''

@admin.register(Pais)
class PaisAdmin (admin.ModelAdmin):
    pass

'''
@admin.register(Propiedad)
class PropiedadAdmin (admin.ModelAdmin):
    pass
'''

@admin.register(TipoPropiedad)
class TipoPropiedad(admin.ModelAdmin):
    pass

@admin.register(PropiedadLiviana)
class PropiedadLiviana(admin.ModelAdmin):
    pass