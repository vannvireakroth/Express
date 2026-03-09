import DB_connect from "../configs/db.js"

export const createProduct = (name, description, price, stock, category, image_url, public_id) => {
    return DB_connect.query(
        "INSERT INTO products (name,description,price,stock,category,image_url,public_id) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *",
        [name, description, price, stock, category, image_url, public_id]
    )
}

export const getallproduct = () => {
    return DB_connect.query(
        "SELECT * FROM products"
    );
}

export const getOneProduct = (id) => {
    return DB_connect.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
    );
};

export const updateProduct = (product) => {
    const { id, name, description, price, stock, category, image_url, public_id } = product;

    return DB_connect.query(
        `UPDATE products 
         SET name=$1, description=$2, price=$3, stock=$4, 
             category=$5, image_url=$6, public_id=$7
         WHERE id=$8 RETURNING *`,
        [name, description, price, stock, category, image_url, public_id, id]
    );
};

export const deleteProduct = (id) =>{
    return DB_connect.query(
        "Delete from products where id = $1",
        [id]
    )
}