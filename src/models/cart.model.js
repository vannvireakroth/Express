import DB_connect from "../configs/db.js";

export const addToCartModel = (user_id, product_id, quantity) => {
    return DB_connect.query(
        `
        INSERT INTO carts (user_id, product_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, product_id)
        DO UPDATE SET quantity = carts.quantity + EXCLUDED.quantity
        RETURNING *;
        `,
        [user_id, product_id, quantity]
    );
};

export const getCartByUser = (user_id) => {
    return DB_connect.query(
        `
        SELECT 
            c.id,
            c.quantity,
            p.id AS product_id,
            p.name,
            p.price,
            p.image_url,
            (p.price * c.quantity) AS total_price
        FROM carts c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = $1
        ORDER BY c.created_at DESC
        `,
        [user_id]
    );
};

export const updateQTYcart = (cart_id, user_id, quantity) => {
    return DB_connect.query(
        `UPDATE carts
         SET quantity = $1
         WHERE id = $2 AND user_id = $3
         RETURNING *`,
        [quantity, cart_id, user_id]
    );
};

export const deleteFromCart = (cart_id, user_id)=>{
    return DB_connect.query(
        `
        Delete from carts where id=$1 and user_id =$2 returning*
        `,
        [cart_id,user_id]
    )
}