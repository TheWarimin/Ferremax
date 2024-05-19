from django.shortcuts import render
from rest_framework.decorators import api_view, action
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework import viewsets, generics
from .serializer import MarcaSerializer, CategoriaSerializer, ProductoSerializer, CustomUserSerializer, CarritoSerializer, ProductoCarritoSerializer, ProductoSerializer
from .models import Marca, Categoria, Producto, CustomUser, Carrito, ProductoCarrito
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer 

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    parser_classes = (MultiPartParser, FormParser)

class CarritoViewSet(viewsets.ModelViewSet):
    queryset = Carrito.objects.all()
    serializer_class = CarritoSerializer

class ProductoCarritoViewSet(viewsets.ModelViewSet):
    queryset = ProductoCarrito.objects.all()
    serializer_class = ProductoCarritoSerializer

    @action(detail=True, methods=['put'])
    def update_quantity(self, request, pk=None):
        producto_carrito = self.get_object()
        cantidad = request.data.get('cantidad')

        if cantidad is not None:
            producto_carrito.cantidad = cantidad
            producto_carrito.save()
            return Response({'status': 'cantidad actualizada'})
        else:
            return Response({'status': 'cantidad no proporcionada'}, status=status.HTTP_400_BAD_REQUEST)

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class CustomUserCreate(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class LoginUserView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Todos los campos son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutUserView(APIView):
    def get(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    
class AddToCartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        carrito, created = Carrito.objects.get_or_create(usuario=user)
        producto_id = request.data.get('producto')
        cantidad = request.data.get('cantidad', 1)

        try:
            producto = Producto.objects.get(id=producto_id)
        except Producto.DoesNotExist:
            return Response({"detail": "Producto no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        producto_carrito, created = ProductoCarrito.objects.get_or_create(
            carrito=carrito,
            producto=producto,
            defaults={'cantidad': cantidad}
        )
        if not created:
            producto_carrito.cantidad += cantidad
            producto_carrito.save()

        return Response({"detail": "Producto añadido al carrito."}, status=status.HTTP_200_OK)