import { db } from ".";
import { IProduct } from "../interfaces";
import { ProductModel } from "../models";

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {

    try {
        await db.connect()
        const product = await ProductModel.findOne({ slug }).lean()
        await db.disconnect()

        if (!product) return null

        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        });

        return JSON.parse(JSON.stringify(product))

    } catch (error) {
        console.log(error);
        return null
    }
}




interface IProductSlug {
    slug: string
}

export const getAllProductsSlugs = async (): Promise<IProductSlug[]> => {

    await db.connect()
    const products = await ProductModel.find().select('slug -_id').lean()
    await db.disconnect()

    return JSON.parse(JSON.stringify(products))
}


export const getProductsByTerm = async (term: string): Promise<IProduct[]> => {

    term = term.toString().toLocaleLowerCase()

    await db.connect()

    const products = await ProductModel.find({ $text: { $search: term } }) //se debe especificar un index en los campos del modelo 
        .select('title images price inStock slug -_id')
        .lean()

    await db.disconnect()

    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        });

        return product;
    })


    return JSON.parse(JSON.stringify(updatedProducts))
}




export const getAllProducts = async (): Promise<IProduct[]> => {

    await db.connect()
    const products = await ProductModel.find()
        .select('title images price inStock slug -_id')
        .lean()

    await db.disconnect()

    const updatedProducts = products.map(product => {
        product.images = product.images.map(image => {
            return image.includes('http') ? image : `${process.env.HOST_NAME}products/${image}`
        });

        return product;
    })

    return JSON.parse(JSON.stringify(updatedProducts))
}