import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import { PaypalOrderStatusResponse } from '../../../interfaces'
import { db } from '../../../database'
import { OrderModel } from '../../../models'

type Data = {
    message: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return payOrder(req, res)

        default:
            return res.status(400).json({ message: 'Bad request' })
    }
}



const getPaypalBearerToken = async (): Promise<string | null> => {

    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${PAYPAL_CLIENT}:${PAYPAL_SECRET}`, 'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');


    try {

        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers: {
                'Authorization': `Basic ${base64Token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return data.access_token;


    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data);
        } else {
            console.log(error);
        }

        return null;
    }
}




const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    // Todo: validar sesión del usuario
    // TODO: validar mongoID

    // optenemos el token que nos da paypal para poder acceder a los datos de una roden
    const paypalBearerToken = await getPaypalBearerToken();

    // validamos si tenemos el token
    if (!paypalBearerToken) {
        return res.status(400).json({ message: 'No se pudo confirmar el token de paypal' })
    }

    const { transactionId = '', orderId = '' } = req.body;

    // optenemos la data de como registra la orden dentro paypal
    const { data } = await axios.get<PaypalOrderStatusResponse>(`${process.env.PAYPAL_ORDERS_URL}/${transactionId}`, {
        headers: {
            'Authorization': `Bearer ${paypalBearerToken}`
        }
    });

    // validamos si la orden esta pagada
    if (data.status !== 'COMPLETED') {
        return res.status(401).json({ message: 'Orden no reconocida' });
    }

    // optenemos esa orden de nuestra DB
    await db.connect();
    const dbOrder = await OrderModel.findById(orderId);

    // validamos si esa orden existe en nuestra BD (deberia exister obviamente)
    if (!dbOrder) {
        await db.disconnect();
        return res.status(400).json({ message: 'Orden no existe en nuestra base de datos' });
    }

    // validamos que el total de nuestra orden en la BD sea igual al toal de la orden el paypal
    if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
        await db.disconnect();
        return res.status(400).json({ message: 'Los montos de PayPal y nuestra orden no son iguales' });
    }

    // actualializamos la orde en nuestra BD
    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();
    await db.disconnect();


    return res.status(200).json({ message: 'Orden pagada' });
}