from django.shortcuts import render
from rest_framework import viewsets
from .serializer import MarcaSerializer, CategoriaSerializer, ProductoSerializer
from .models import Marca, Categoria, Producto  
from rest_framework.parsers import MultiPartParser, FormParser

# Create your views here.
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
