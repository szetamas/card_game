const jwt = require('jsonwebtoken');
const { mySQLPool } = require('./mySQLPool.js');
const dotenv = require('dotenv');
dotenv.config();

async function getUserName(req, res) {
  //sleep for a second (to prevent brute force, may need something
  //check that connection still alive or not, and then drop it or some kinda)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let connection;
  try {
    const { jwtAccesToken } = req.cookies;
    if (jwtAccesToken === undefined) {
      connection.release();
      res.status(400).send({
        error:
          'Nem találtam jwtAccesToken-t a kérésben, vagy lejárt a jwtAccesToken.',
      });
      return -1;
    }
    const decodedAccesToken = jwt.verify(
      jwtAccesToken,
      process.env.JWTACCESTOKENKEY
    );

    connection = await mySQLPool.getConnection();
    let sqlQuery = 'SELECT userName FROM users WHERE ID = ?';
    let [rows] = await connection.execute(sqlQuery, [decodedAccesToken.userId]);
    if (rows.length < 1) {
      connection.release();
      res
        .status(400)
        .send({ error: 'Nincs ilyen felhasználó az adatbázisban.' });
      return -1;
    }

    connection.release();
    res.status(200).send({
      userName: rows[0].userName,
    });
    return 1;
  } catch (error) {
    if (connection !== undefined) {
      connection.release();
    }
    res.status(500).send({ error: 'hiba' });
    return -1;
    //TODO: may i wana log error to a file or something
  }
}

module.exports = { getUserName };
