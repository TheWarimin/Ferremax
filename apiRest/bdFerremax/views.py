from django.shortcuts import render
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from rest_framework import viewsets, generics
from .serializer import MarcaSerializer, CategoriaSerializer, ProductoSerializer, CustomUserSerializer, CarritoSerializer, ProductoCarritoSerializer, ProductoSerializer
from .models import Marca, Categoria, Producto, CustomUser, Carrito, ProductoCarrito
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

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

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

class CustomUserCreate(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

class LoginUserView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Todos los campos son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=email, password=password)
        if user is not None:
            login(request, user)
            return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutUserView(APIView):
    def get(self, request):
        logout(request)
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)