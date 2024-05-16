from rest_framework import serializers
from .models import Marca, Categoria, Producto

class MarcaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Marca
        fields = '__all__'  # Esto serializará todos los campos del modelo Marca

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'  # Esto serializará todos los campos del modelo Categoria

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'