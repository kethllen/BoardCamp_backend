import connection from "../database/database.js";
import dayjs from "dayjs";
import moment from "moment";

export async function getRentals(req, res) {
  try {
    let gameId = "";
    let customerId = "";
    let offset = "";
    if (req.query.offset) {
      offset = `OFFSET ${req.query.offset}`;
    }

    let limit = "";
    if (req.query.limit) {
      limit = `LIMIT ${req.query.limit}`;
    }
    if (req.query.customerId) {
      customerId = `WHERE rentals."customerId"= ${parseInt(
        req.query.customerId
      )}`;
    }

    if (req.query.gameId) {
      gameId = `WHERE rentals."gameId"  = ${parseInt(req.query.gameId)}`;
    }

    const result = await connection.query({
      text: `
          SELECT 
            rentals.*,
            customers.id,
            customers.name,
            games.id,
            games.name,
            games."categoryId",
            categories.name
          FROM rentals
            JOIN customers ON rentals."customerId"=customers.id
            JOIN games ON rentals."gameId"=games.id
            JOIN categories ON games."categoryId"=categories.id
          ${offset}
          ${limit}
          ${customerId}
          ${gameId}
      `,
      rowMode: "array",
    });
    res.send(
      result.rows.map((row) => {
        const [
          id,
          customerId,
          gameId,
          rentDate,
          daysRented,
          returnDate,
          originalPrice,
          delayFee,
          idCustomer,
          nameCustomer,
          idGame,
          nameGame,
          categoryId,
          categoryName,
        ] = row;

        return {
          id,
          customerId,
          gameId,
          rentDate,
          daysRented,
          returnDate,
          originalPrice,
          delayFee,
          customer: { id: idCustomer, name: nameCustomer },
          game: {
            id: idGame,
            name: nameGame,
            categoryId: categoryId,
            categoryName: categoryName,
          },
        };
      })
    );
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}

export async function postRental(req, res) {
  try {
    const { customerId, gameId, daysRented } = req.body;
    let gameAvailable = true;
    const rentDate = dayjs().format("YYYY-MM-DD");
    const game = await connection.query(`SELECT * FROM games WHERE id=$1`, [
      gameId,
    ]);

    const idCustomer = await connection.query(
      `SELECT * FROM customers WHERE id=$1`,
      [customerId]
    );
    const rentalsActive = await connection.query(
      `SELECT * FROM rentals WHERE "gameId"=$1 and "returnDate"=${null}`,
      [gameId]
    );
    if (rentalsActive.rowCount == game.rows[0].stockTotal) {
      gameAvailable = false;
    }

    if (idCustomer.rowCount > 0 && game.rowCount > 0 && gameAvailable == true) {
      const originalPrice = game.rows[0].pricePerDay * daysRented;
      await connection.query(
        `
        INSERT INTO rentals ("customerId", "gameId", "rentDate", "daysRented","returnDate","originalPrice","delayFee")
          VALUES ($1, $2, $3, $4, ${null}, $5, ${null})
      `,
        [customerId, gameId, rentDate, daysRented, originalPrice]
      );

      res.sendStatus(201);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function returnRental(req, res) {
  try {
    const id = parseInt(req.params.id);
    const returnDate = dayjs().format("YYYY-MM-DD");
    const rental = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [
      id,
    ]);
    if (rental.rowCount == 0) {
      return res.sendStatus(404);
    } else if (rental.rows[0].returnDate !== null) {
      return res.sendStatus(400);
    }
    const pricePerDay = await connection.query(
      `SELECT "pricePerDay" FROM games WHERE id=$1`,
      [rental.rows[0].gameId]
    );
    let diff = moment(returnDate, "YYYY-MM-DD").diff(
      moment(rental.rows[0].rentDate, "YYYY-MM-DD")
    );

    const dias = moment.duration(diff).asDays();
    const delayFee = parseInt(pricePerDay.rows[0].pricePerDay) * parseInt(dias);
    console.log("delayFee " + delayFee);
    await connection.query(
      `
      UPDATE rentals
        SET "returnDate"=$2, "delayFee"=$3
        WHERE id=$1
    `,
      [id, returnDate, delayFee]
    );
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function deleteRental(req, res) {
  try {
    const id = req.params.id;
    const rental = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [
      id,
    ]);
    if (rental.rowCount == 0) {
      return res.sendStatus(404);
    } else if (rental.rows[0].returnDate !== null) {
      return res.sendStatus(400);
    }
    await connection.query(
      `
    DELETE FROM rentals WHERE id=$1
  `,
      [id]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
