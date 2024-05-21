from rest_framework import serializers
from .models import Marca, Categoria, Producto, CustomUser, Carrito, ProductoCarrito, WebpayTransactionItem, WebpayTransaction

class WebpayTransactionItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.nombre')
    product_price = serializers.DecimalField(source='product.precio', max_digits=10, decimal_places=2)
    
    class Meta:
        model = WebpayTransactionItem
        fields = ['product_name', 'product_price', 'quantity']

class WebpayTransactionSerializer(serializers.ModelSerializer):
    items = WebpayTransactionItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = WebpayTransaction
        fields = ['user', 'amount', 'token', 'created_at', 'items']

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = '__all__' 

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__' 

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'password', 'direccion', 'telefono')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class ProductoCarritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductoCarrito
        fields = ['id', 'producto', 'cantidad']


class CarritoSerializer(serializers.ModelSerializer):
    usuario = serializers.EmailField(source='usuario.email')
    productos = ProductoCarritoSerializer(source='productocarrito_set', many=True)

    class Meta:
        model = Carrito
        fields = ['id', 'usuario', 'productos']