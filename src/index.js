const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { getWs } = require('./webpay'); // Asegúrate de importar la función getWs correctamente

const app = express();
const port = 3005;

// Middleware para procesar los datos del formulario correctamente
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true })); // Asegúrate de usar urlencoded para recibir los datos de formularios
app.use(bodyParser.json());

app.use(cors());
app.use(bodyParser.json());

// Ruta para iniciar la transacción
app.post('/api/webpay/init', async (req, res) => {
    const { totalAmount } = req.body;

    // Crear la transacción en Webpay
    const buyOrder = Math.floor(Math.random() * 100000);
    const sessionId = Math.floor(Math.random() * 100000);
    const returnUrl = `http://localhost:${port}/api/webpay/return`; // Aquí es donde Webpay redirigirá

    const data = JSON.stringify({
        buy_order: buyOrder,
        session_id: sessionId,
        amount: Math.round(totalAmount), // Asegúrate de que sea un número entero
        return_url: returnUrl
    });

    const method = 'POST';
    const type = 'sandbox'; // Cambiar a 'live' en producción
    const endpoint = '/rswebpaytransaction/api/webpay/v1.0/transactions';

    const response = await getWs(data, method, type, endpoint);

    if (response) {
        res.json({
            url: response.url,
            token: response.token
        });
    } else {
        res.status(500).json({ message: 'Error iniciando la transacción con Webpay' });
    }
});

// Ruta para manejar el retorno desde Webpay
app.post('/api/webpay/return', async (req, res) => {
    console.log(req.body); // Agrega esto para depurar los datos que llegan desde Webpay
    const token = req.body.token_ws;
  
    if (!token) {
      return res.status(400).json({ message: 'No se recibió el token de Webpay' });
    }
  
    // Crea la solicitud para confirmar la transacción con Webpay
    const method = 'PUT';
    const type = 'sandbox'; // Cambiar a 'live' en producción
    const endpoint = `/rswebpaytransaction/api/webpay/v1.0/transactions/${token}`;
  
    const response = await getWs(null, method, type, endpoint);
  
    // Verifica la respuesta de Webpay
    if (response) {
      if (response.status === 'AUTHORIZED') {
        res.redirect('http://localhost:3000/compra-exitosa');
      } else {
        res.redirect('http://localhost:3000/compra-fallida');
      }
    } else {
      res.redirect('http://localhost:3000/error');
    }
  });
  
  

// Inicia el servidor
app.listen(port, () => {
    console.log(`Backend de Webpay corriendo en http://localhost:${port}`);
});
