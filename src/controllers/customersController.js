import connection from "../database/database.js";

export async function getCustomers(req, res) {
  try {
    let cpf = "";
    let offset = "";
    if (req.query.offset) {
      offset = `OFFSET ${req.query.offset}`;
    }

    let limit = "";
    if (req.query.limit) {
      limit = `LIMIT ${req.query.limit}`;
    }
    if (req.query.cpf) {
      cpf = req.query.cpf;
      console.log("cpf " + cpf);
      const customers = await connection.query(
        `SELECT * 
         FROM customers
         ${offset}
         ${limit}
         WHERE customers.cpf
          LIKE '${cpf}%'`
      );
      return res.status(200).send(customers.rows);
    } else {
      const customers = await connection.query(`
        SELECT * 
        FROM customers
        ${offset}
        ${limit}`);
      return res.status(200).send(customers.rows);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function getCustomer(req, res) {
  const id = parseInt(req.params.id);

  try {
    const customer = await connection.query(
      `
      SELECT * FROM customers
        WHERE id=$1
    `,
      [id]
    );

    if (customer.rowCount === 0) {
      res.sendStatus(404);
      return;
    }

    res.send(customer.rows[0]);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function postCustomer(req, res) {
  try {
    const { name, phone, cpf, birthday } = req.body;

    const result = await connection.query(
      `SELECT id FROM customers WHERE cpf=$1`,
      [cpf]
    );
    if (result.rows.length > 0) {
      return res.status(409).send("Cliente já cadastrado");
    }

    await connection.query(
      `
      INSERT INTO customers (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4)
    `,
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function updateCustomer(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { name, phone, cpf, birthday } = req.body;
    const customer = await connection.query(
      `SELECT * FROM customers WHERE id=$1`,
      [id]
    );
    const result = await connection.query(
      `SELECT id FROM customers WHERE cpf=$1`,
      [cpf]
    );
    if (result.rows.length > 0 && cpf !== customer.rows[0].cpf) {
      return res.status(409).send("Cliente já cadastrado");
    }

    await connection.query(
      `
      UPDATE customers
        SET name=$2, phone=$3, cpf=$4, birthday=$5
        WHERE id=$1
    `,
      [id, name, phone, cpf, birthday]
    );

    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
