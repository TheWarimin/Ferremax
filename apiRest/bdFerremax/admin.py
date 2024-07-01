from django.contrib import admin
from .models import CustomUser, Empleado, Marca, Categoria, Producto, Carrito, ProductoCarrito, WebpayTransaction, WebpayTransactionItem

admin.site.register(CustomUser)
admin.site.register(Empleado)
admin.site.register(Marca)
admin.site.register(Categoria)
admin.site.register(Producto)
admin.site.register(Carrito)
admin.site.register(ProductoCarrito)
admin.site.register(WebpayTransaction)
admin.site.register(WebpayTransactionItem)
