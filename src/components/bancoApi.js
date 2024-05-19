import axios from 'axios';

async function ValorDolar() {
    const hoy = new Date();

    // Calcular la fecha 5 días atrás
    const firstDate = new Date(hoy);
    firstDate.setDate(firstDate.getDate() - 5);
    const firstDateString = firstDate.toISOString().split('T')[0];  // Formato 'yyyy-MM-dd'

    // Calcular la fecha 3 días atrás
    const fechaValor = new Date(hoy);
    fechaValor.setDate(fechaValor.getDate() - 3);
    const fechaValorString = `${fechaValor.getDate().toString().padStart(2, '0')}-${(fechaValor.getMonth() + 1).toString().padStart(2, '0')}-${fechaValor.getFullYear()}`;  // Formato 'dd-MM-yyyy'

    // Construir la URL
    const url = `https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx?user=ivostambuk7@gmail.com&pass=2749Ivostambuk&firstdate=${firstDateString}&timeseries=F073.TCO.PRE.Z.D&function=GetSeries`;

    try {
        // Hacer la solicitud GET
        const response = await axios.get(url);
        console.log(response);
        if (response.status !== 200) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = response.data;

        // Extraer el valor de 3 días atrás
        const observacion = data.Series.Obs.find(obs => obs.indexDateString === fechaValorString);
        if (observacion) {
            return parseFloat(observacion.value);
        } else {
            throw new Error(`No se encontró el valor para la fecha ${fechaValorString}`);
        }
    } catch (error) {
        throw new Error(`Hubo un problema con la solicitud: ${error.message}`);
    }
}

export { ValorDolar };
