import * as OrderModel from "../models/orders.model.js";
import * as CartModel from "../models/cart.model.js";

export const createOrderscontroller = async (req, res) => {
  const user_id = req.users.id;
  const { payment_method, shipping_address, note } = req.body;

  try {
    const cart = await CartModel.getCartByUser(user_id);

    if (!cart.rows.length) {
      return res.status(400).json({
        message: "Cart is empty on this user..!"
      });
    }

    const items = cart.rows.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      product_id: item.product_id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
      total_price: item.total_price,
    }));

    const total_price = items.reduce((sum, item) => {
      return sum + parseFloat(item.total_price);
    }, 0);

    const result = await OrderModel.createOrdermodel(
      user_id,
      items,
      total_price,
      payment_method,
      shipping_address,
      note
    );

    res.status(201).json({
      message: "Order Created..",
      data: result.rows[0],
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error..!",
    });
  }
};

export const getAllOrderscontroller = async (req, res) => {
  try {
    const result = await OrderModel.getAllOrders();

    res.status(200).json({
      message: "Get All Orders..",
      data: result.rows,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error..!",
    });
  }
};