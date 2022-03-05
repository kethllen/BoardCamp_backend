import connection from "../database/database.js";

export async function getRentals(req, res) {
  try {
    let gameId = "";
    let customerId = "";
    if (req.query.customerId) {
      customerId = `WHERE rentals."customerId "= ${req.query.customerId}`;
    }
    if (req.query.gameId) {
      gameId = `WHERE rentals."gameId"  = ${req.query.gameId}`;
    }

    const result = await db.query({
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
            JOIN categories ON games."categoryId"=categories.name
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
  } catch (error) {}
}
export async function updateRental(req, res) {
  try {
  } catch (error) {}
}
export async function deleteRental(req, res) {
  try {
  } catch (error) {}
}
