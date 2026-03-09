import * as ProductModel from '../models/products.model.js'
import * as CartModel from '../models/cart.model.js'

export const addToCartController = async (req, res) => {
  try {
    const user_id = req.users.id;
    const {product_id, quantity = 1 } = req.body;

    const product = await ProductModel.getOneProduct(product_id);

    if (!product.rows.length) {
      return res.status(400).json({
        message: "Product not found"
      });
    }
    if (isNaN(quantity) || quantity < 1) {
      return res.status(400).json({
        message: "Quantity Product Invalid"
      });
    }

    const result = await CartModel.addToCartModel(
      user_id,
      product_id,
      quantity
    );

    res.status(201).json({
      message: "Product add to cart",
      cart_item: result.rows[0]
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Error server"
    })
  }
}

export const getCartFromUserController = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await CartModel.getCartByUser(user_id);

    // If no cart found or empty
    if (!result.rows || result.rows.length === 0) {
      return res.status(404).json({
        message: "Cart is empty or user not found",
      });
    }

    // Return cart data
    res.status(200).json({
      message: "Cart retrieved successfully",
      cart_data: result.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error..!",
    });
  }
};

export const updatecartController = async (req, res) => {
  const { quantity } = req.body;
  const user_id = req.users.id;
  const cart_id = req.params.id;

  try {
    if (!quantity || Number(quantity) < 1) {
      return res.status(400).json({
        message: "QTY is smaller than 1"
      });
    }

    const result = await CartModel.updateQTYcart(cart_id, user_id, quantity);

    if (!result.rows.length) {
      return res.status(404).json({
        message: "Cart is not found"
      });
    }

    res.status(200).json({
      message: "Update qty cart success",
      data: result.rows[0]
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error"
    });
  }
};

export const deleteCartController = async (req, res) =>{
  const cart_id = req.params.id
  const user_id = req.users.id
  try{
    const result = await CartModel.deleteFromCart(cart_id, user_id)
    if(!result.rows.length){
      return res.status(404).json({
        message:"cart is not found"
      })
    }
    res.status(200).json({
      message:"Delete cart is successfully",
      data:result.rows[0]
    })
  }catch(err){
    console.log(err);
    res.status(500).json({
      message:"error server"
    })
  }
}