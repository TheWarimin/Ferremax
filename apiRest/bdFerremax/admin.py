from django.contrib import admin
from .models import Marca, Categoria, Producto, CustomUser, Carrito, ProductoCarrito

# Register your models here.
admin.site.register(Marca)
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(CustomUser)
admin.site.register(Carrito)
admin.site.register(ProductoCarrito)