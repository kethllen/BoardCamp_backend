import connection from "../database/database.js";
import dayjs from "dayjs";

export async function getRentals(req, res) {
  try {
    let gameId = "";
    let customerId = "";

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

    const rentDate = dayjs().format("YYYY-MM-DD");
    const game = await connection.query(`SELECT * FROM games WHERE id=$1`, [
      gameId,
    ]);
    const idCustomer = await connection.query(
      `SELECT "id" FROM customers WHERE id=$1`,
      [customerId]
    );
    if (idCustomer && game) {
      const originalPrice = game.pricePerDay * daysRented;
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
  } catch (error) {}
}
export async function returnRental(req, res) {
  try {
    const id = parseInt(req.params.id);
    const returnDate = dayjs().format("YYYY-MM-DD");
    const rental = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [
      id,
    ]);
    if (!rental) {
      return res.sendStatus(404);
    } else if (rental.returnDate !== null) {
      return res.sendStatus(400);
    }
    const pricePerDay = await connection.query(
      `SELECT "pricePerDay" FROM games WHERE id=$1`,
      [rental.gameId]
    );
    let diff = moment(returnDate, "YYYY-MM-DD").diff(
      moment(rental.rentDate, "YYYY-MM-DD")
    );
    const dias = moment.duration(diff).asDays();
    const delayFee = pricePerDay * dias;
    await connection.query(
      `
      UPDATE rentals
        SET returnDate=$2, delayFee=$3
        WHERE id=$1
    `,
      [id, returnDate, delayFee]
    );
    res.sendStatus(200);
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}
export async function deleteRental(req, res) {
  try {
    const id = req.params.id;
    const rental = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [
      id,
    ]);
    if (!rental) {
      return res.sendStatus(404);
    } else if (rental.returnDate !== null) {
      return res.sendStatus(400);
    }
    await connection.query(
      `
    DELETE FROM rentals WHERE id=$1
  `,
      [id]
    );

    res.sendStatus(200);
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}
