import cloudinary from "../configs/cloudinary.js";
import * as ProductModel from "../models/products.model.js";

export const createProductController = async (req, res) => {
    const { name, description, price, stock, category } = req.body;

    try {
        let image_url = null;
        let public_id = null;

        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "imgprd" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(req.file.buffer);
            });

            image_url = uploadResult.secure_url;
            public_id = uploadResult.public_id;
        }

        const result = await ProductModel.createProduct(
            name,
            description,
            price,
            stock,
            category,
            image_url,
            public_id
        );

        res.status(201).json({
            message: "Create product success",
            data: result.rows[0],
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Server error",
        });
    }
};

export const getAllProductController = async (req, res) => {
    try {
        const result = await ProductModel.getallproduct();
        res.status(200).json({
            message: "Get all product",
            data: result.rows
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({   
            message: "Error server"
        });
    }
};

export const getOneProducController = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await ProductModel.getOneProduct(id);
        res.status(200).json({
            message: "Get one product",
            data: result.rows[0]
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error Server"
        });
    }
};

export const updateProductsController = async (req, res) => {
    const id = req.params.id;
    const { name, description, price, stock, category } = req.body;

    try {
        const checkproducts = await ProductModel.getOneProduct(id);

        if (!checkproducts.rows.length) {
            return res.status(404).json({
                message: "No Product",
            });
        }

        let image_url = checkproducts.rows[0].image_url;
        let public_id = checkproducts.rows[0].public_id;

        if (req.file) {
            if (image_url) {
                await cloudinary.uploader.destroy(public_id);
            }

            const up = await new Promise((resolve, reject) => {
                cloudinary.uploader
                    .upload_stream({ folder: "imgprd" }, (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    })
                    .end(req.file.buffer);
            });

            image_url = up.secure_url;
            public_id = up.public_id;
        }

        const result = await ProductModel.updateProduct(
            id,
            name,
            description,
            price,
            stock,
            category,
            image_url,
            public_id
        );

        res.status(200).json({
            message: "Update Product Successfully",
            data: result.rows[0],
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error Server",
        });
    }
};

export const deleteProductsController = async (req, res)=>{
    const id = req.params.id;
    try{
        const checkproduct = await ProductModel.getOneProduct(id);
        if(!checkproduct){
            res.status(404).json({
                message:"Product not found"
            })
        }
        let image_url = checkproduct.rows[0].image_url;
        let public_id = checkproduct.rows[0].public_id;
        if(image_url){
            await cloudinary.uploader.destroy(public_id);
        }
        await ProductModel.deleteProduct(id);

        res.status(200).json({
            message:"Delete success"
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Error server"
        })
    }
}