import connection from "../database/database.js";

export async function getCategories(req, res) {
  try {
    let offset = "";
    if (req.query.offset) {
      offset = `OFFSET ${req.query.offset}`;
    }

    let limit = "";
    if (req.query.limit) {
      limit = `LIMIT ${req.query.limit}`;
    }
    const categories = await connection.query(`
      SELECT * 
      FROM categories
      ${offset}
      ${limit}`);
    res.status(200).send(categories.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function postCategory(req, res) {
  try {
    const { name } = req.body;
    const categories = await connection.query(
      "SELECT * FROM categories WHERE name=($1)",
      [name]
    );
    if (categories.rows.length > 0) return res.sendStatus(409);
    await connection.query(
      `
      INSERT INTO 
        categories (name) 
        VALUES ($1)`,
      [name]
    );

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
