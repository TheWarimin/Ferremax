from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

def generar_voucher(pedido):
    ruta_pdf = os.path.join('vouchers', f'pedido_{pedido.id}.pdf')
    c = canvas.Canvas(ruta_pdf, pagesize=letter)
    width, height = letter

    c.setFont("Helvetica-Bold", 24)
    c.drawString((width - c.stringWidth("Ferremax", "Helvetica-Bold", 24)) / 2, height - 50, "Ferremax")

    c.setFont("Helvetica", 12)
    c.drawString(100, height - 100, f"Pedido ID: {pedido.id}")
    c.drawString(100, height - 120, f"Usuario: {pedido.usuario.username}")
    c.drawString(100, height - 140, f"Correo Electrónico: {pedido.usuario.email}")
    c.drawString(100, height - 160, f"Método de Pago: {pedido.metodo_pago.nombre}")
    c.drawString(100, height - 180, f"Envío: {pedido.get_envio_display()}")

    if pedido.envio == 'domicilio':
        c.drawString(100, height - 200, f"Dirección: {pedido.direccion}")
        c.drawString(100, height - 220, f"Teléfono: {pedido.telefono}")
    elif pedido.envio == 'sucursal':
        c.drawString(100, height - 200, f"Sucursal: {pedido.sucursal.nombre}")
        c.drawString(100, height - 220, f"Dirección: {pedido.sucursal.direccion}")

    c.drawString(100, height - 260, "Productos:")
    y_position = height - 280

    if pedido.envio == 'domicilio':
        c.drawString(100, y_position, f"- Servicio de delivery (Cantidad: 1, Precio: $3000)")
        y_position -= 20  

    for producto_pedido in pedido.productopedido_set.all():
        producto = producto_pedido.producto
        total_producto = producto.precio * producto_pedido.cantidad
        c.drawString(100, y_position, f"- {producto.nombre} (Cantidad: {producto_pedido.cantidad}, Precio: ${producto.precio})")
        y_position -= 20  

    c.drawString(100, y_position - 20, f"Total: ${pedido.total}")

    c.showPage()
    c.save()
    return ruta_pdf
