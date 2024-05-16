from django.urls import path, include
from rest_framework import routers
from bdFerremax import views


router = routers.DefaultRouter()
router.register(r'marca', views.MarcaViewSet, 'marca')
router.register(r'Categoria', views.CategoriaViewSet, 'Categoria')
router.register(r'Producto', views.ProductoViewSet, 'Producto')


urlpatterns = [
    path('', include(router.urls)), 

]