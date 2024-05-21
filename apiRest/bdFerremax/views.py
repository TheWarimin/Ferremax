import random
from rest_framework.decorators import action
from django.contrib.auth import authenticate, login, logout
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework import viewsets, generics
from .serializer import WebpayTransactionSerializer, WebpayTransactionItemSerializer, MarcaSerializer, CustomUserSerializer, CategoriaSerializer, ProductoSerializer, CustomUserSerializer, CarritoSerializer, ProductoCarritoSerializer, ProductoSerializer
from .models import Marca, CustomUser, Categoria, Producto, CustomUser, Carrito, ProductoCarrito, WebpayTransaction, WebpayTransactionItem
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.webpay.webpay_plus.transaction import Transaction
from django.shortcuts import get_object_or_404

class WebpayView(APIView):
    def post(self, request, *args, **kwargs):
        session_id = request.data.get('user_id')
        amount = request.data.get('amount')
        buy_order = str(random.randrange(1000000, 99999999))
        return_url = request.data.get('return_url')
        products = request.data.get('products')
        try:
            response = Transaction().create(buy_order, session_id, amount, return_url)
        except TypeError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        transaction = WebpayTransaction.objects.create(token=response['token'], amount=amount, user_id=session_id)
        for product in products:
            product_instance = get_object_or_404(Producto, id=product['id'])
            WebpayTransactionItem.objects.create(quantity=product['quantity'], transaction=transaction, product=product_instance)
            carrito = get_object_or_404(Carrito, usuario_id=session_id)
            carrito.productocarrito_set.all().delete()
        return Response({
            'retorno_webpay': {
                'url': response['url'],
                'token': response['token']
            }
        })
    def get(self, request, *args, **kwargs):
        token = request.GET.get('token_ws')
        try:
            transaction = WebpayTransaction.objects.get(token=token)
            response = Transaction().commit(token)
        except WebpayTransaction.DoesNotExist:
            return Response({'error': 'Transacción no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'status': response.get('status'),
            'amount': transaction.amount,
            'order_id': response.get('buy_order')
        })

class WebpayReturnView(APIView):
    def post(self, request, *args, **kwargs):
        token = request.data.get('token_ws')
        if not token:
            return Response({'error': 'token_ws no proporcionado'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            response = Transaction().commit(token)
            if response.get('status') == 'AUTHORIZED':
                webpay_transaction = WebpayTransaction.objects.get(token=token)
                webpay_transaction.status = 'AUTHORIZED'
                webpay_transaction.save()
                carrito = Carrito.objects.get(usuario=webpay_transaction.user)
                carrito.productocarrito_set.all().delete()
                return Response({
                    "detail": "Transacción autorizada.",
                    "status": response.get('status'),
                    "amount": response.get('amount'),
                    "buy_order": response.get('buy_order'),
                    "token_ws": token  # Devuelve el token_ws para confirmar la transacción en el front-end
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "detail": "Transacción no autorizada.",
                    "status": response.get('status')
                }, status=status.HTTP_400_BAD_REQUEST)
        except WebpayTransaction.DoesNotExist:
            return Response({'error': 'Transacción no encontrada.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class WebpayTransactionViewSet(viewsets.ModelViewSet):
    queryset = WebpayTransaction.objects.all()
    serializer_class = WebpayTransactionSerializer

class WebpayTransactionItemViewSet(viewsets.ModelViewSet):
    serializer_class = WebpayTransactionItemSerializer
    def get_queryset(self):
        queryset = WebpayTransactionItem.objects.all()
        transaction_id = self.request.query_params.get('transaction_id', None)
        if transaction_id is not None:
            queryset = queryset.filter(transaction_id=transaction_id)
        return queryset

class MarcaViewSet(viewsets.ModelViewSet):
    queryset = Marca.objects.all()
    serializer_class = MarcaSerializer 

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer

class customUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

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