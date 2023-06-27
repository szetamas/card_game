const jwt = require('jsonwebtoken');
const { mySQLPool } = require('./mySQLPool.js');
const { generateRandomChars } = require('./generateRandomChars.js');
const dotenv = require('dotenv');
dotenv.config();
const JWTACCESTOKEN_EXPIRESIN = 60 * 20; //20 minutes
const JWTREFRESHTOKEN_EXPIRESIN = 60 * 60 * 24 * 2; //2 days

async function postLogin(req, res) {
  //sleep for a second (to prevent brute force, may need something
  //check that connection still alive or not, and then drop it or some kinda)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let connection;
  try {
    const { userPrivateID } = req.body;
    //TODO: may i wana check that the userPrivateID has only letters and numbers
    if (userPrivateID === undefined || userPrivateID.length !== 30) {
      res.status(400).send({ error: 'Rossz a privát id.' });
      return -1;
    }

    connection = await mySQLPool.getConnection();
    let sqlQuery = 'SELECT ID FROM users WHERE userPrivateID = ?';
    let [rows] = await connection.execute(sqlQuery, [userPrivateID]);
    if (rows.length < 1) {
      connection.release();
      res
        .status(400)
        .send({ error: 'Lehet, nem jól adtad meg a privát id-t.' });
      return -1;
    }
    const userId = rows[0].ID;

    let refreshTokenID = generateRandomChars(9, false);
    do {
      sqlQuery = 'SELECT ID FROM jwtRefreshTokens WHERE ID = ?';
      [rows] = await connection.execute(sqlQuery, [refreshTokenID]);
      if (rows.length !== 0) {
        refreshTokenID = generateRandomChars(9, false);
      }
    } while (rows.length !== 0);

    const jwtAccesToken = jwt.sign(
      { userId: userId },
      process.env.JWTACCESTOKENKEY,
      {
        expiresIn: JWTACCESTOKEN_EXPIRESIN,
      }
    );
    const jwtRefreshToken = jwt.sign(
      { id: refreshTokenID, userId: userId },
      process.env.JWTREFRESHTOKENKEY,
      {
        expiresIn: JWTREFRESHTOKEN_EXPIRESIN,
      }
    );

    sqlQuery =
      'INSERT INTO jwtRefreshTokens (ID, refreshToken, userID) VALUES (?,?,?)';
    [rows] = await connection.execute(sqlQuery, [
      refreshTokenID,
      jwtRefreshToken,
      userId,
    ]);
    if (rows.affectedRows < 1) {
      connection.release();
      res.status(500).send({ error: 'Hiba történt a bejelentkezés közben.' });
      return -1;
    }
    connection.release();
    res.cookie('jwtAccesToken', jwtAccesToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      expiresIn: JWTACCESTOKEN_EXPIRESIN,
    });
    res.cookie('jwtRefreshToken', jwtRefreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      expiresIn: JWTREFRESHTOKEN_EXPIRESIN,
    });
    res.status(200).send({ succes: 'sikeres bejelentkezés' });
    return 1;
  } catch (error) {
    if (connection !== undefined) {
      connection.release();
    }
    res.status(500).send({ error: 'Hiba' });
    return -1;
    //TODO: may i wana log error to a file or something
  }
}

module.exports = { postLogin };
