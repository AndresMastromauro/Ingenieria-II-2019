from django.contrib import admin
from common.models import *

# Register your models here.






@admin.register(Provincia)
class ProvinciaAdmin (admin.ModelAdmin):
    pass

class CalleInline (admin.TabularInline):
    model = Calle

@admin.register(Localidad)
class LocalidadInline (admin.ModelAdmin):
    inlines = [
        CalleInline
    ]

class ProvinciaInline (admin.StackedInline):
    model = Provincia
    inlines = [
        LocalidadInline
    ]

@admin.register(Pais)
class PaisAdmin (admin.ModelAdmin):
    inlines = [
        ProvinciaInline
    ]

@admin.register(Propiedad)
class PropiedadAdmin (admin.ModelAdmin):
    fields = ('titulo', 'descripcion', 'tipo', ('calle', 'numero'), ('piso', 'dpto'),)

@admin.register(TipoPropiedad)
class TipoPropiedad(admin.ModelAdmin):
    pass