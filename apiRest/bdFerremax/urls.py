from django.urls import path, include
from rest_framework import routers
from bdFerremax import views
from .views import UserGroupsView, ValorArgView, ValorEuroView, ValorDolarView, WebpayTransactionViewSet, WebpayTransactionItemViewSet, AddToCartView, customUserViewSet, CustomUserCreate, MarcaViewSet, CategoriaViewSet, ProductoViewSet, CarritoViewSet, ProductoCarritoViewSet, WebpayView, WebpayReturnView

router = routers.DefaultRouter()
router.register(r'marca', views.MarcaViewSet, 'marca')
router.register(r'Categoria', views.CategoriaViewSet, 'Categoria')
router.register(r'Producto', views.ProductoViewSet, 'Producto')
router.register(r'carritos', CarritoViewSet)
router.register(r'productos-carrito', ProductoCarritoViewSet)
router.register(r'usuarios', customUserViewSet)
router.register(r'WebpayItems', WebpayTransactionItemViewSet, 'WebpayItems')
router.register(r'webpaytransactions', WebpayTransactionViewSet, 'webpaytransactions')

urlpatterns = [
    path('', include(router.urls)),
    path('user-groups/', UserGroupsView.as_view(), name='user-groups'),
    path('valor-arg/', ValorArgView.as_view(), name='valor-arg'),
    path('valor-euro/', ValorEuroView.as_view(), name='valor-euro'),
    path('valor-dolar/', ValorDolarView.as_view(), name='valor-dolar'),
    path('add-to-cart/', AddToCartView.as_view(), name='add-to-cart'),
    path('register/', CustomUserCreate.as_view(), name='register'),
    path('login/', views.LoginUserView.as_view(), name='login'),
    path('logout/', views.LogoutUserView.as_view(), name='logout'),
    path('webpay/', WebpayView.as_view(), name='webpay'),
    path('webpayreturn/', WebpayReturnView.as_view(), name='webpay_return'),
]