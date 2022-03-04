import connection from "../database/database.js";

export async function getCustomers(req, res) {
  try {
    let cpf = req.query.cpf;
    if (cpf) {
      const customers = await connection.query(
        `select * from customers WHERE customers.cpf like‘($1)%’`,
        [cpf]
      );
    } else {
      const customers = await connection.query("select * from customers");
    }

    res.status(200).send(customers.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
}
export async function getCustomer(req, res) {
  const { id } = req.params;

  try {
    const { rows: customer } = await db.query(
      `
      SELECT * FROM customers
        WHERE id=$1
    `,
      [id]
    );

    if (customer.length === 0) {
      res.sendStatus(404);
      return;
    }

    res.send(customer[0]);
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}
export async function postCustomer(req, res) {
  try {
    const { name, phone, cpf, birthday } = req.body;

    const result = await db.query(`SELECT id FROM customers WHERE cpf=$1`, [
      cpf,
    ]);
    if (result.rows.length > 0) {
      return res.status(409).send("Cliente já cadastrado");
    }

    await db.query(
      `
      INSERT INTO customers (name, phone, cpf, birthday)
        VALUES ($1, $2, $3, $4)
    `,
      [name, phone, cpf, birthday]
    );

    res.sendStatus(201);
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}
export async function updateCustomer(req, res) {
  try {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body;

    const result = await db.query(`SELECT id FROM customers WHERE cpf=$1`, [
      cpf,
    ]);
    if (result.rows.length > 0) {
      return res.status(409).send("Cliente já cadastrado");
    }

    await db.query(
      `
      UPDATE customers
        SET name=$2, phone=$3, cpf=$4, birthday=$4
        WHERE id=$1
    `,
      [id, name, phone, cpf, birthday]
    );

    res.sendStatus(200);
  } catch (erro) {
    console.log(erro);
    res.sendStatus(500);
  }
}
