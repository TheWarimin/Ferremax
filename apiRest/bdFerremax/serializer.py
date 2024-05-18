from rest_framework import serializers
from .models import Marca, Categoria, Producto, CustomUser, Carrito, ProductoCarrito


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
    producto = ProductoSerializer()

    class Meta:
        model = ProductoCarrito
        fields = '__all__'

class CarritoSerializer(serializers.ModelSerializer):
    productos = ProductoCarritoSerializer(many=True, read_only=True, source='productocarrito_set')

    class Meta:
        model = Carrito
        fields = ['usuario', 'productos']