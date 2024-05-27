import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import emailjs from 'emailjs-com';
import Alert from '@mui/material/Alert';

const Footer = () => {
    const [open, setOpen] = useState(false);
    const [confirmation, setConfirmation] = useState("");
  
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
  
    const sendEmail = (e) => {
      e.preventDefault();
  
      const name = e.target.elements.name.value;
      const email = e.target.elements.email.value;
      const message = e.target.elements.message.value;
  
      emailjs.sendForm('service_ez6wmdk', 'template_fz9aqru', e.target, 'q3PxNW5Q_tee_r-ZT')
        .then((result) => {
            console.log(result.text);
            setConfirmation("Tu mensaje ha sido enviado con éxito. Te responderemos lo antes posible.");
        }, (error) => {
            console.log(error.text);
            setConfirmation("Lo sentimos, hubo un error al enviar tu mensaje. Por favor, inténtalo de nuevo.");
        });
      handleClose();
    }
  
    return (
      <Box sx={{ p: 2, mt: 'auto', textAlign: 'center' }}>
        <Typography variant="body1" color="white">
          © 2024 Ferremax. Todos los derechos reservados.
        </Typography>
        {confirmation && <Alert severity="success">{confirmation}</Alert>}
        <Button color="primary" onClick={handleOpen}>Contacto</Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Contacto</DialogTitle>
          <form onSubmit={sendEmail}>
            <DialogContent>
              <TextField name="name" required fullWidth label="Nombre" />
              <TextField name="email" required fullWidth label="Correo" />
              <TextField name="message" required fullWidth multiline rows={4} label="Mensaje" />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">Cancelar</Button>
              <Button type="submit" color="primary">Enviar</Button>
            </DialogActions>
          </form>
        </Dialog>
      </Box>
    );
  };
  
  export default Footer;