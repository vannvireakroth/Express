import DB_connect from "../configs/db.js";

export const createOrdermodel = (user_id, items, total_price, payment_method, shipping_address, note) => {
    return DB_connect.query(
        `INSERT INTO orders (user_id, items, total_price, payment_method, shipping_address, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [user_id, JSON.stringify(items), total_price, payment_method, shipping_address, note]
    );
};

export const getAllOrders = async () => {
  const query = `
    SELECT 
      orders.id,
      orders.user_id,
      orders.items,
      orders.total_price,
      orders.payment_method,
      orders.shipping_address,
      orders.notes,
      orders.created_at
    FROM orders
    ORDER BY orders.id DESC
  `;
  return await DB_connect.query(query);
};

export const getOrdersByUserId = (user_id) => {
    return DB_connect.query(
        `SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC`,
        [user_id]
    );
};

