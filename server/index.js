import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())

const ACCESS_TOKEN = process.env.ACCESS_TOKEN

// Ruta crear el checkout de MercadoPago
app.post('/create-checkout', async (req, res) => {
    const {items} = req.body;

    try {
        const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${ACCESS_TOKEN}`,
                "Content-type": 'application/json'
            },
            body: JSON.stringify({
                items,
                back_urls: {
                    success: "https://tuweb.com/success",
                    failure: "https://tuweb.com/failure",
                    pending: "https://tuweb.com/pending"
                },
                auto_return: "approved"
            })
        })
        const data = await response.json()
        res.json({url: data.init_point})

    } catch (error) {
        res.status(500).json({error: 'Error al crear la orden de pago'})
    }
});


app.listen(3000, () => {
    console.log('Servidor en el puerto 3000')
})