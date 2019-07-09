"""
Script de Carga Inicial

"""

from app.models import Pais, Provincia, Localidad, Calle, Cliente, Membresia
from users.models import SwitchnUser
from datetime import date

datos = {
    "Argentina": {
        "Buenos Aires": {
            "San Pedro": [
                "San Martin",
                "Rivadavia",
                "Avenida Belgrano"
            ],
            "Mar del Plata": [
                "Avenida Colón",
                "Peralta Ramos",
                "Arenales"
            ],
            "Tandil": [
                "Avenida Santamarina",
                "25 de Mayo",
                "Cerrito"
            ]
        },
        "Córdoba": {
            "Capital": [
                "Avenida Colón",
                "Avenida San Juan",
                "Carlos Jiménez"
            ],
            "Río Cuarto": [
                "Avenida Mitre",
                "Rodrigo Bueno",
                "Fratelli Branca"
            ]
        }
    }
}


for pais, provincias in datos.items():
    P = Pais.objects.create(nombre=pais)
    for provincia, localidades in provincias.items():
        p = Provincia.objects.create(pais=P, nombre=provincia)
        for localidad, calles in localidades.items():
            l = Localidad.objects.create(provincia=p, nombre=localidad)
            for calle in calles:
                Calle.objects.create(localidad=l, nombre=calle)

# MEMBRESIAS
Membresia.objects.create(codigo='ESTANDAR', tipo='Estándar', arancel=1000)
Membresia.objects.create(codigo='PREMIUM', tipo='Premium', arancel=1800)

user_groups = {
    "admins": [
        {
            "email": "srbarriga@lavecindad.mx",
            "password": "12345678",
            "nombre": "Edgar",
            "apellido": "Vivar",
        },
        {
            "email": "jirafales@lavecindad.mx",
            "password": "12345678",
            "nombre": "Rubén",
            "apellido": "Aguirre",
        }
    ],
    "clientes": [
        {
            "email": "chilindrina@lavecindad.mx",
            "password": "12345678" ,
            "nombre": "Maria Antonieta",
            "apellido": "de las Nieves",
            "fecha_nacimiento": date(1950, 12, 22),
            "tarjeta_credito": "1234123412341234",
            "premium": False

        },
        {
            "email": "kiko@lavecindad.mx",
            "password": "12345678",
            "nombre": "Carlos",
            "apellido": "Villagrán",
            "fecha_nacimiento": date(1944, 1, 12),
            "tarjeta_credito": "1234123412341234",
            "premium": True
        }
    ]
}

for user in user_groups["admins"]:
    SwitchnUser.objects.create_admin(**user)

for user in user_groups["clientes"]:
    user = user.copy()
    is_premium = user.pop("premium")
    c = Cliente.create(**user)
    if is_premium:
        s = c.solicitar_premium()
        s.aceptar()
