from django.contrib import admin
from .models import *

admin.site.register(Properties)

@admin.register(Reserva)
class ReservaAdmin (admin.ModelAdmin):
    # esto en realidad es automatico
    pass

@admin.register(Subasta)
class SubastaAdmin (admin.ModelAdmin):
    pass

@admin.register(Estado)
class EstadoAdmin (admin.ModelAdmin):
    pass

@admin.register(OfertaSubasta)
class OfertaSubastaAdmin (admin.ModelAdmin):
    pass

@admin.register(Calle)
class CalleAdmin (admin.ModelAdmin):
    pass

class CalleInline (admin.TabularInline):
    model = Calle

@admin.register(Localidad)
class LocalidadAdmin (admin.ModelAdmin):
    inlines = [
        CalleInline
    ]

class LocalidadInline (admin.TabularInline):
    model = Localidad

@admin.register(Provincia)
class ProvinciaAdmin (admin.ModelAdmin):
    inlines = [
        LocalidadInline
    ]

class ProvinciaInline (admin.StackedInline):
    model = Provincia

@admin.register(Pais)
class PaisAdmin (admin.ModelAdmin):
    inlines = [
        ProvinciaInline
    ]

@admin.register(Propiedad)
class PropiedadAdmin (admin.ModelAdmin):
    pass

@admin.register(TipoPropiedad)
class TipoPropiedad(admin.ModelAdmin):
    pass