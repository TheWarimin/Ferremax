from django.db import models
from django.utils.crypto import get_random_string

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

    def __str__(self):
        return self.nombre

    def save(self, *args, **kwargs):
        if not self.codigo:
            self.codigo = get_random_string(length=10)
        super().save(*args, **kwargs)
