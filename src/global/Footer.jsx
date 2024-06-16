import React, { useState } from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import emailjs from 'emailjs-com';
import Alert from '@mui/material/Alert';

const Footer = () => {
    const [open, setOpen] = useState(false);
    const [confirmation, setConfirmation] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [messageError, setMessageError] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    const sendEmail = (e) => {
        e.preventDefault();

        const name = e.target.elements.name.value;
        const email = e.target.elements.email.value;
        const message = e.target.elements.message.value;

        let valid = true;

        if (name.length < 3) {
            setNameError("El nombre debe tener al menos 3 caracteres");
            valid = false;
        } else {
            setNameError("");
        }

        if (!validateEmail(email)) {
            setEmailError("Correo electrónico no válido");
            valid = false;
        } else {
            setEmailError("");
        }

        if (message.length < 10) {
            setMessageError("El mensaje debe tener al menos 10 caracteres");
            valid = false;
        } else {
            setMessageError("");
        }

        if (!valid) return;

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
                        <TextField
                            name="name"
                            required
                            fullWidth
                            label="Nombre"
                            error={!!nameError}
                            helperText={nameError}
                        />
                        <TextField
                            name="email"
                            required
                            fullWidth
                            label="Correo"
                            error={!!emailError}
                            helperText={emailError}
                        />
                        <TextField
                            name="message"
                            required
                            fullWidth
                            multiline
                            rows={4}
                            label="Mensaje"
                            error={!!messageError}
                            helperText={messageError}
                        />
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
