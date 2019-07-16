from django.db import models
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist

from datetime import date, timedelta

from switchn import settings
from users.models import SwitchnUser

from app.utils import a_year_from_now, adjust_date_to_last_monday, validate_monday, three_days_from_now


class Pais(models.Model):
    nombre = models.CharField(max_length=100, blank=False)

    def __str__(self):
        return self.nombre


class Provincia(models.Model):
    nombre = models.CharField(max_length=100, blank=False)
    pais = models.ForeignKey('Pais', on_delete=models.PROTECT)

    def __str__(self):
        return self.nombre


class Localidad(models.Model):
    nombre = models.CharField(max_length=100, blank=False)
    provincia = models.ForeignKey('Provincia', on_delete=models.PROTECT)

    def __str__(self):
        return self.nombre


class Calle(models.Model):
    nombre = models.CharField(max_length=100, blank=False)
    localidad = models.ForeignKey('Localidad', on_delete=models.PROTECT)

    def __str__(self):
        return self.nombre


class Membresia(models.Model):
    tipo = models.CharField(max_length=200, null=False)
    codigo = models.CharField(max_length=30, primary_key=True)
    arancel = models.DecimalField(max_digits=15, decimal_places=2)

    def __str__(self):
        return self.tipo


class Cliente(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, primary_key=True, on_delete=models.CASCADE)
    creation_date = models.DateTimeField(default=timezone.now)
    membresia =  models.ForeignKey(Membresia, to_field='codigo', on_delete=models.CASCADE, default='ESTANDAR')
    tarjeta_credito = models.CharField(max_length=20, null=False, default='000000000000000')
    subastas_ofertadas = models.ManyToManyField('Subasta', through='OfertaSubasta')

    def __str__(self):
        return f'{self.user} [{self.membresia}]'

    @classmethod
    def create(klass, email, password, nombre, apellido, fecha_nacimiento, tarjeta_credito):
        user = SwitchnUser.objects.create_user(email, password, nombre, apellido, fecha_nacimiento)
        try:
            cliente = klass.objects.create(
                user=user,
                tarjeta_credito=tarjeta_credito
            )
        except:
            user.delete()
            raise
        return cliente


    def get_credit_count(self):
        return self.credit_set.exclude(expiration_date__lte=timezone.now()).count()

    def add_credit(self, ammount=1):
        for i in range(ammount):
            self.credit_set.create()

    def remove_credit(self, ammount=1):
        for i in range(ammount):
            self.credit_set.last().delete()

    def has_credit(self):
        return self.get_credit_count() > 0

    def solicitar_premium(self):
        premium = Membresia.objects.get(codigo='PREMIUM')
        if not self.is_premium() and not self.has_solicitud_pendiente():
            return self.solicitudcambiomembresia_set.create(a_tipo=premium)
        raise ValueError('El usuario ya es premium')

    def solicitar_estandar(self):
        estandar = Membresia.objects.get(codigo='ESTANDAR')
        if self.is_premium() and not self.has_solicitud_pendiente():
            return self.solicitudcambiomembresia_set.create(a_tipo=estandar)

    def has_solicitud_pendiente(self):
        return self.solicitudcambiomembresia_set.filter(pendiente=True).exists()

    def get_ultima_solicitud(self):
        return self.solicitudcambiomembresia_set.first()

    def is_premium(self):
        return self.membresia == Membresia.objects.get(codigo='PREMIUM')

    def reservar(self, propiedad, semana):
        # TODO: Controlar permisos.
        if not self.has_credit():
            from django.core.exceptions import ValidationError
            raise ValidationError("Crédito insuficiente")
        reserva = propiedad.create_reserva(semana, self)
        self.remove_credit()
        return reserva

    def delete(self, using=None, keep_parents=False):
        self.user.delete()
        return super(Cliente, self).delete(using, keep_parents)

    def cargar_pago(self, tipo, monto):
        return self.pagos.create(monto=monto, tipo=tipo)


class Credit(models.Model):
    class Meta:
        ordering = ('expiration_date',)

    expiration_date = models.DateTimeField(default=a_year_from_now)
    user = models.ForeignKey(Cliente, on_delete=models.CASCADE)

    def __str__(self):
        return (self.user, self.expirationDate)


class SolicitudCambioMembresia(models.Model):
    class Meta:
        ordering = ['-fecha_hora']
    a_tipo = models.ForeignKey(Membresia, on_delete=models.CASCADE)
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    fecha_hora = models.DateTimeField(default=timezone.now)
    pendiente = models.BooleanField(default=True)
    aceptada = models.BooleanField(default=False)

    def __str__(self):
        return f'({self.cliente}) => {self.a_tipo}'

    def aceptar(self):
        if not self.pendiente:
            raise ValueError('La solicitud ya fue resuelta o cancelada')
        self.cliente.membresia = self.a_tipo
        self.aceptada = True
        self.pendiente = False
        self.cliente.save()
        self.save()

    def rechazar(self):
        if not self.pendiente:
            raise ValueError('La solicitud ya fue resuelta o cancelada')
        self.pendiente = False
        self.aceptada = False
        self.save()

    def cancelar(self):
        if not self.pendiente:
            raise ValueError('La solicitud ya fue resuelta o cancelada')
        self.pendiente = False
        self.save()


class Propiedad (models.Model):
    class Meta:
        unique_together = (('calle', 'numero', 'piso', 'dpto'),)

    titulo = models.CharField(max_length=30)
    descripcion = models.CharField(max_length=200)
    calle = models.ForeignKey(Calle, on_delete=models.PROTECT)
    numero = models.PositiveIntegerField()
    piso = models.CharField(max_length=10, blank=True)
    dpto = models.CharField(max_length=10, blank=True)
    image = models.TextField(blank=True)
    es_activa = models.BooleanField(null=False, default=True)

    def string_direccion(self):
        localidad = self.calle.localidad
        provincia = localidad.provincia
        pais = provincia.pais
        direccion = "{0} #{1}".format(self.calle, self.numero)
        if (self.piso != ""):
            direccion += ", {0}".format(self.piso)
        if (self.dpto != ""):
            direccion += ", dpto {0}".format(self.dpto)
        return "{0}. {1}, {2}, {3}.".format(direccion, localidad, provincia, pais)

    def __str__(self):
        return "{0}: {1}".format(self.titulo, self.string_direccion())

    def is_available_on_week(self, semana):
        semana = adjust_date_to_last_monday(semana)
        return not self.reserva_set.filter(semana=semana).exists()

    def get_unavailable_weeks(self):
        return [r.semana for r in self.get_reservas()]

    def is_reserva_directa_ready(self, semana):
        semana = adjust_date_to_last_monday(semana)
        if not self.is_available_on_week(semana):
            return False
        hoy = date.today()
        seis_meses = timedelta(weeks=25)
        un_anio = timedelta(weeks=52)
        return (hoy + seis_meses) < semana < (hoy + un_anio)

    def get_reservas(self):
        ultimo_lunes = adjust_date_to_last_monday(date.today())
        return self.reserva_set.filter(semana__gte=ultimo_lunes)

    def has_reservas(self):
        return self.get_reservas().exists()

    def get_subastas(self):
        """ Solo por compatibilidad """
        return self.subastas

    def get_subastas_abiertas(self):
        return self.subastas.filter(es_activa=True)

    def create_reserva(self, semana, cliente=None):
        if not self.es_activa:
            raise ValueError("La propiedad no se encuentra activa")
        semana = adjust_date_to_last_monday(semana)
        return self.reserva_set.create(semana=semana, cliente=cliente)

    def create_subasta(self, semana, precio_base):
        if not self.es_activa:
            raise ValueError("La propiedad no se encuentra activa")
        semana = adjust_date_to_last_monday(semana)
        if self.subastas.filter(semana=semana).exists():
            raise ValueError("Ya existe una subasta para la semana elegida")
        if not self.is_available_on_week(semana):
            raise ValueError("La semana elegida está reservada")
        return self.subastas.create(semana=semana, precio_base=precio_base)

    def create_hotsale(self, semana, precio=None):
        if not self.es_activa:
            raise ValueError("La propiedad no se encuentra activa")
        if not self.is_available_on_week(semana):
            raise ValueError("La semana elegida no está disponible")
        return self.hotsales.create(semana=semana, precio=None)

    @staticmethod
    def get_propiedades_activas():
        return Propiedad.objects.filter(es_activa=True)


    @staticmethod
    def get_available_between(desde=None, hasta=None, queryset=None):
        """
        Devuelve las propiedades que se encuentran disponibles en al menos una semana
        comprendida en el rango dado. Si no se especifica un rango, se establece entre
        la fecha actual mas 25 semanas y la fecha actual mas un año
        """
        if queryset is None:
            queryset = Propiedad.get_propiedades_activas()
        if desde is None or desde < date.today():
            desde = date.today() + timedelta(days=25 * 7)
        if hasta is None:
            hasta = date.today() + timedelta(days=52 * 7)
        elif hasta < desde:
            raise ValueError("Las fechas especificadas son incorrectas")

        queryset = queryset.annotate(
            reservas_periodo=models.Count(
                'reserva',
                filter=(models.Q(reserva__semana__gte=desde) & models.Q(reserva__semana__lte=hasta))
            )
        )

        semanas = ((hasta - desde).days // 7) + 1
        return queryset.filter(reservas_periodo__lt=semanas)


class Reserva (models.Model):
    class Meta:
        unique_together = (('semana','propiedad'),)
        ordering = ('semana',)

    cliente = models.ForeignKey(Cliente, null=True, on_delete=models.CASCADE)
    semana = models.DateField(validators=[validate_monday])
    propiedad = models.ForeignKey(Propiedad, on_delete=models.CASCADE)

    def __str__(self):
        anio = self.semana.isocalendar()[0]
        semana = self.semana.isocalendar()[1]
        return "{0} ({1}, semana: {2})".format(self.propiedad, anio, semana)


class Hotsale(models.Model):
    class Meta:
        unique_together = (('semana', 'propiedad'),)
        ordering = ['semana']

    precio = models.DecimalField(max_digits=15, decimal_places=2, null=True)
    semana = models.DateField()
    propiedad = models.ForeignKey('Propiedad', related_name='hotsales', on_delete=models.CASCADE)
    es_activo = models.BooleanField(default=False)
    comprador = models.ForeignKey('Cliente', related_name='hotsales_adquiridos', on_delete=models.DO_NOTHING, null=True)
    pago = models.OneToOneField('Pago', related_name='detalle_hotsale', on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        anio = self.semana.year
        semana = self.semana.isocalendar()[1]
        activo = f'{"ACTIVO" if self.es_activo else "INACTIVO"}'
        adquirido = f"{f' (Adquirido por {self.comprador})' if self.comprador is not None else ''}"
        return f'[HOTSALE - {activo}] {self.propiedad.titulo} ({anio}, semana: {semana}): ${self.precio}.{adquirido}'

    @classmethod
    def get_hotsale_pool(cls):
        return cls.objects.filter(es_activo=False, comprador__isnull=True, semana__gte=date.today())

    def vender_a(self, cliente):
        if not self.es_activo:
            raise ValueError('El hotsale no se encuentra activo')
        try:
            self.pago = cliente.cargar_pago('H', self.precio)
            self.propiedad.create_reserva(self.semana, cliente)
            self.comprador = cliente
            self.es_activo = False
            self.save()
        except:
            raise ValueError("El cliente no tiene capacidad de pago")

    def desactivar(self):
        self.es_activo = False
        self.save()

class Subasta(models.Model):
    class Meta:
        unique_together = (('semana', 'propiedad'),)
        ordering = ['semana']

    precio_base = models.DecimalField(max_digits=15, decimal_places=2)
    semana = models.DateField()
    fecha_inicio = models.DateField(default=date.today)
    fecha_fin = models.DateField(default=three_days_from_now)
    es_activa = models.BooleanField(default=True)
    ofertantes = models.ManyToManyField('Cliente', related_name='+', through='OfertaSubasta')
    ganador = models.ForeignKey('Cliente', null=True, related_name='subastas_ganadas', on_delete=models.DO_NOTHING)
    propiedad = models.ForeignKey('Propiedad', related_name='subastas', on_delete=models.CASCADE)
    pago = models.OneToOneField('Pago', related_name='detalle_subasta', on_delete=models.DO_NOTHING, null=True)

    def __str__(self):
        anio = self.semana.isocalendar()[0]
        semana = self.semana.isocalendar()[1]
        return "{0} / base: ${1} ({2}, semana: {3})".format(self.propiedad.titulo, self.precio_base, anio, semana)

    def is_open(self):
        return self.es_activa

    def get_offers(self, **kwargs):
        queryset = self.ofertasubasta_set.order_by("-monto")
        if "exclude_users" in kwargs:
            exclude = kwargs["exclude_users"]
            for user in exclude:
                queryset = queryset.exclude(cliente=user)
        return queryset

    def get_best_offer(self, **kwargs):
        return self.get_offers(**kwargs).first()

    def make_offer(self, cliente, monto):
        if not self.is_open():
            raise ValueError("La subasta se encuentra cerrada")
        if monto <= self.precio_base:
            raise ValueError("El monto ingresado debe ser mayor al precio base")

        if self.get_best_offer() is not None and monto <= self.get_best_offer().monto:
            raise ValueError("El monto ingresado debe ser mayor al de la última oferta")

        return self.ofertasubasta_set.create(cliente=cliente, monto=monto)

    def close(self):
        if not self.is_open():
            raise ValueError('La subasta no se encuentra activa')
        exclude = []
        best_offer = self.get_best_offer(exclude_users=exclude)
        while best_offer is not None and not best_offer.cliente.has_credit():
            exclude.append(best_offer.cliente)
            best_offer = self.get_best_offer(exclude_users=exclude)
        if best_offer is not None:
            try:
                self.pago = best_offer.cobrar()
                self.ganador = best_offer.cliente
                self.ganador.reservar(self.propiedad, self.semana)
            except:
                # FIXME: Ver como se resuelve posta.
                self.propiedad.create_hotsale(semana=self.semana)
        else:
            self.propiedad.create_hotsale(semana=self.semana)
        # self.fecha_fin = timezone.now()
        self.es_activa = False
        self.save()



class OfertaSubasta(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT)
    subasta = models.ForeignKey(Subasta, on_delete=models.PROTECT)
    fechaHora = models.DateTimeField(default=timezone.now)
    monto = models.DecimalField(max_digits=15, decimal_places=2)

    def __str__(self):
        return f'[{self.subasta}] {self.cliente} => ${self.monto} ({date.strftime(self.fechaHora, "%d/%m/%Y - %H:%M:%S")})'

    def cobrar(self):
        return self.cliente.cargar_pago('S', self.monto)


class Pago(models.Model):
    tipo = models.CharField(max_length=1, choices=(
        ('H', 'Hotsale'),
        ('S', 'Subasta')
    ), blank=True)
    monto = models.DecimalField(max_digits=15, decimal_places=2)
    cliente = models.ForeignKey('Cliente', related_name='pagos', on_delete=models.CASCADE)
    pendiente = models.BooleanField(default=True)
    fecha = models.DateField(default=timezone.now)

    def __str__(self):
        estado = f'{"PENDIENTE" if self.pendiente else "CANCELADO"}'
        detalle = self.get_detalle()
        return f'{detalle}: ${self.monto} [{estado}]'

    def get_detalle(self):
        if self.tipo == '':
            return None
        try:
            if self.tipo == 'H':
                det = self.detalle_hotsale
                return f'[HOTSALE] {det.propiedad} ({det.semana})'
            if self.tipo == 'S':
                det = self.detalle_subasta
                return f'[SUBASTA] {det.propiedad} ({det.semana})'
        except ObjectDoesNotExist:
            return None