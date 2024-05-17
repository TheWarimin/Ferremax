from django.shortcuts import render
from rest_framework import viewsets, generics
from .serializer import MarcaSerializer, CategoriaSerializer, ProductoSerializer, CustomUserSerializer
from .models import Marca, Categoria, Producto, CustomUser
from rest_framework.parsers import MultiPartParser, FormParser

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

class CustomUserCreate(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer