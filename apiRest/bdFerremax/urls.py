from django.urls import path, include
from rest_framework import routers
from bdFerremax import views
from .views import AddToCartView, customUserViewSet, CustomUserCreate, MarcaViewSet, CategoriaViewSet, ProductoViewSet, CarritoViewSet, ProductoCarritoViewSet, WebpayView, WebpayReturnView

router = routers.DefaultRouter()
router.register(r'marca', views.MarcaViewSet, 'marca')
router.register(r'Categoria', views.CategoriaViewSet, 'Categoria')
router.register(r'Producto', views.ProductoViewSet, 'Producto')
router.register(r'carritos', CarritoViewSet)
router.register(r'productos-carrito', ProductoCarritoViewSet)
router.register(r'usuarios', customUserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('register/', CustomUserCreate.as_view(), name='register'),
    path('login/', views.LoginUserView.as_view(), name='login'),
    path('logout/', views.LogoutUserView.as_view(), name='logout'),
    path('webpay/', WebpayView.as_view(), name='webpay'),
    path('webpayreturn/', WebpayReturnView.as_view(), name='webpay_return'),
]