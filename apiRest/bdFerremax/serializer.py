from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Marca, Categoria, Producto, ProductoPedido, CustomUser, Carrito, ProductoCarrito, WebpayTransactionItem, WebpayTransaction, Empleado, Pedido, MetodoPago, Sucursal, EMPLOYEE_ROLES

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

User = get_user_model()

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'direccion', 'telefono', 'is_employee', 'employee_role', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            direccion=validated_data.get('direccion', ''),
            telefono=validated_data.get('telefono', ''),
            is_employee=validated_data.get('is_employee', False),
            employee_role=validated_data.get('employee_role', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = ['user', 'role']

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

class MetodoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MetodoPago
        fields = '__all__'

class SucursalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sucursal
        fields = '__all__'

class PedidoProductoSerializer(serializers.ModelSerializer):
    producto_id = serializers.PrimaryKeyRelatedField(source='producto.id', read_only=True)  
    nombre_producto = serializers.CharField(source='producto.nombre', read_only=True) 

    class Meta:
        model = ProductoPedido
        fields = ('producto_id', 'nombre_producto', 'cantidad')

class PedidoSerializer(serializers.ModelSerializer):
    productos = PedidoProductoSerializer(source='productopedido_set', many=True, read_only=True)

    class Meta:
        model = Pedido
        fields = ['id', 'metodo_pago','fecha_pedido', 'envio', 'sucursal', 'direccion', 'telefono', 'total', 'usuario', 'productos','voucher']

    def create(self, validated_data):
        productos_data = validated_data.pop('productos', [])
        pedido = Pedido.objects.create(**validated_data)
        for producto_data in productos_data:
            ProductoPedido.objects.create(
                pedido=pedido,
                producto=producto_data['producto'],
                cantidad=producto_data['cantidad']
            )
        return pedido





