from django.urls import path, include
from rest_framework import routers
from bdFerremax import views
from .views import CustomUserCreate, MarcaViewSet, CategoriaViewSet, ProductoViewSet

router = routers.DefaultRouter()
router.register(r'marca', views.MarcaViewSet, 'marca')
router.register(r'Categoria', views.CategoriaViewSet, 'Categoria')
router.register(r'Producto', views.ProductoViewSet, 'Producto')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', CustomUserCreate.as_view(), name='register'),
]