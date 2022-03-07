import connection from "../database/database.js";

export async function getGames(req, res) {
  try {
    let offset = "";
    if (req.query.offset) {
      offset = `OFFSET ${req.query.offset}`;
    }

    let limit = "";
    if (req.query.limit) {
      limit = `LIMIT ${req.query.limit}`;
    }

    let name = req.query.name;
    if (name) {
      const games = await connection.query(
        `
      SELECT 
        games.*, 
        categories.name as "categoryName" 
      FROM games
        JOIN categories ON games."categoryId"=categories.id 
        ${offset}
        ${limit}
      WHERE games.name 
        LIKE '${name}%'`
      );
      return res.status(200).send(games.rows);
    } else {
      const games = await connection.query(
        `
      SELECT
        games.*,
        categories.name AS "categoryName"
      FROM games
        JOIN categories ON games."categoryId"=categories.id
      ${offset}
      ${limit}`
      );
      return res.status(200).send(games.rows);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function postGame(req, res) {
  try {
    const { name, image, categoryId } = req.body;
    const stockTotal = parseInt(req.body.stockTotal);
    const pricePerDay = parseInt(req.body.pricePerDay);
    if (stockTotal <= 0 || pricePerDay <= 0) {
      return res.sendStatus(422);
    }
    const games = await connection.query(
      "select * from games WHERE name=($1)",
      [name]
    );
    if (games.rows.length > 0) return res.sendStatus(409);
    const categories = await connection.query(
      "select * from categories WHERE id=($1)",
      [categoryId]
    );
    if (categories.rows.length == 0) return res.sendStatus(400);
    await connection.query(
      `
      INSERT INTO 
        games (name,
        image,
        "stockTotal",
        "categoryId",
        "pricePerDay") 
        VALUES ($1,$2,$3,$4,$5)`,
      [name, image, stockTotal, categoryId, pricePerDay]
    );
    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
