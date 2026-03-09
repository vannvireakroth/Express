import DB_connect from "../configs/db.js";

export const createUser = async (name, email, password) => {
    return DB_connect.query(
        `INSERT INTO users (name, email, password)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [name, email, password]
    );
};

export const findUser = async (email) => {
    return DB_connect.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
};