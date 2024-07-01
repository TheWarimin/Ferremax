from rest_framework import serializers
from .models import Marca, Categoria, Producto, CustomUser, Carrito, ProductoCarrito, WebpayTransactionItem, WebpayTransaction, Empleado, EMPLOYEE_ROLES

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
    groups = serializers.SerializerMethodField()
    employee_role = serializers.ChoiceField(choices=EMPLOYEE_ROLES, required=False, allow_blank=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'username', 'direccion', 'telefono', 'is_employee', 'employee_role', 'groups']

    def get_groups(self, obj):
        return [group.name for group in obj.groups.all()]

    def validate(self, data):
        if data.get('employee_role') and not data.get('is_employee'):
            raise serializers.ValidationError("Cannot assign an employee role to a non-employee user.")
        return data

class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = ['user', 'role']
    
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