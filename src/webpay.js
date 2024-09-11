// src/webpay.js
const axios = require('axios');

// Función para hacer las solicitudes HTTP a Webpay
async function getWs(data, method, type, endpoint) {
    const baseUrl = (type === 'live') 
        ? 'https://webpay3g.transbank.cl' 
        : 'https://webpay3gint.transbank.cl'; // Cambiar entre producción y sandbox

    const TbkApiKeyId = '597055555532'; // API Key de ejemplo
    const TbkApiKeySecret = '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'; // Llave secreta de ejemplo

    try {
        const response = await axios({
            method: method,
            url: baseUrl + endpoint,
            headers: {
                'Tbk-Api-Key-Id': TbkApiKeyId,
                'Tbk-Api-Key-Secret': TbkApiKeySecret,
                'Content-Type': 'application/json',
            },
            data: data
        });

        return response.data; // Retorna la respuesta de la API
    } catch (error) {
        console.error('Error al conectar con Webpay:', error);
        return null;
    }
}

module.exports = { getWs }; // Asegúrate de que estás exportando la función correctamente