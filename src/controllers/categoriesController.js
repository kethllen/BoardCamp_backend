import connection from "../database/database.js";

export async function getCategories(req, res) {
  try {
    const categories = await connection.query("select * from categories");
    res.status(200).send(categories.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function postCategory(req, res) {
  try {
    const { name } = req.body;
    const categories = await connection.query("select * from categories");
    for (let i = 0; i < categories.rows.length; i++) {
      if (categories.rows[i].name == name) {
        return res.sendStatus(409);
      }
    }
    await connection.query(
      `
      INSERT INTO 
        categories (name) 
        VALUES ($1)`,
      [name]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
