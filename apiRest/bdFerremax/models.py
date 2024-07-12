from django.db import models
from django.utils.crypto import get_random_string
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils.translation import gettext_lazy as _
from django.conf import settings

class Marca(models.Model):
    nombre = models.CharField(max_length=200)

    def __str__(self):
        return self.nombre

class Categoria(models.Model):
    nombre = models.CharField(max_length=200)

    def __str__(self):
        return self.nombre

class Producto(models.Model):
    codigo = models.CharField(max_length=10, editable=False, unique=True)
    marca = models.ForeignKey(Marca, on_delete=models.CASCADE)
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=200)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    imagen = models.ImageField(upload_to='productos/', null=True, blank=True)
    descripcion = models.TextField(null=True, blank=True) 
    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        if not self.codigo:
            self.codigo = get_random_string(length=10)
        super().save(*args, **kwargs)

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    direccion = models.CharField(max_length=255, null=True, blank=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    is_employee = models.BooleanField(default=False)
    employee_role = models.CharField(max_length=50, null=True, blank=True)

    groups = models.ManyToManyField(
        Group,
        verbose_name=_('groups'),
        blank=True,
        help_text=_(
            'The groups this user belongs to. A user will get all permissions '
            'granted to each of their groups.'
        ),
        related_name="customuser_groups",
        related_query_name="customuser",
    )

    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="customuser_user_permissions",
        related_query_name="customuser",
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def save(self, *args, **kwargs):
        if self.employee_role and not self.is_employee:
            raise ValueError("Cannot assign an employee role to a non-employee user.")
        if self.employee_role == 'administrador':
            self.is_staff = True
            self.is_superuser = True
        super().save(*args, **kwargs)
        Carrito.objects.get_or_create(usuario=self)
    
    def __str__(self):
        return self.email

class Carrito(models.Model):
    usuario = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.usuario.email

class ProductoCarrito(models.Model):
    carrito = models.ForeignKey(Carrito, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField(default=1)

    def incrementar_cantidad(self, cantidad=1):
        self.cantidad += cantidad
        self.save()

    def disminuir_cantidad(self, cantidad=1):
        self.cantidad = max(0, self.cantidad - cantidad)
        self.save()

    def eliminar(self):
        self.delete()

class WebpayTransaction(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    token = models.CharField(max_length=64, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        Pedido.objects.get_or_create(
            usuario=self.user,
            webpay_transaction=self,
            defaults={'estado': 'preparando'}
        )

class WebpayTransactionItem(models.Model):
    transaction = models.ForeignKey(WebpayTransaction, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Producto, on_delete=models.CASCADE)
    quantity = models.IntegerField()

# Empleado roles
EMPLOYEE_ROLES = (
    ('bodeguero', 'Bodeguero'),
    ('cajero', 'Cajero'),
    ('contador', 'Contador'),
    ('administrador', 'Administrador'),
    # Agregar más roles si es necesario
)

class Empleado(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    role = models.CharField(max_length=50, choices=EMPLOYEE_ROLES)

    def __str__(self):
        return f"{self.user.email} - {self.get_role_display()}"

class Pedido(models.Model):
    ESTADOS_PEDIDO = (
        ('preparando', 'Preparando'),
        ('enviado', 'Enviado'),
        ('entregado', 'Entregado'),
    )

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    webpay_transaction = models.ForeignKey(WebpayTransaction, on_delete=models.CASCADE)
    estado = models.CharField(max_length=10, choices=ESTADOS_PEDIDO, default='preparando')
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Pedido {self.id} - {self.usuario.email}'
