const { mySQLPool } = require('./mySQLPool.js');
const { generateRandomChars } = require('./generateRandomChars.js');
const {
  userNameHasSpecialChars,
} = require('../../src/validationFuncs/userNameHasSpecialChars.js');

async function postRegistration(req, res) {
  //sleep for a second (to prevent brute force, may need something
  //check that connection still alive or not, and then drop it or some kinda)
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let connection;
  try {
    const { userName } = req.body;
    if (
      userName === undefined ||
      userName.length < 2 ||
      userName.length > 30 ||
      userNameHasSpecialChars(userName)
    ) {
      res.status(400).send({ error: 'Rossz a username.' });
      return -1;
    }

    connection = await mySQLPool.getConnection();
    let sqlQuery = 'SELECT userName FROM users WHERE userName = ?';
    let [rows] = await mySQLPool.execute(sqlQuery, [userName]);
    if (rows.length !== 0) {
      connection.release();
      res.status(400).send({ error: 'A username foglalt :/' });
      return -1;
    }

    let userID = generateRandomChars(9, false);
    let userPrivateID = generateRandomChars(30);
    do {
      sqlQuery = 'SELECT ID FROM users WHERE userPrivateID = ? OR ID = ?';
      [rows] = await mySQLPool.execute(sqlQuery, [userPrivateID, userID]);
      if (rows.length !== 0) {
        userID = generateRandomChars(9, false);
        userPrivateID = generateRandomChars(30);
      }
    } while (rows.length !== 0);

    sqlQuery = 'INSERT INTO users (ID, userName, userPrivateID) VALUES (?,?,?)';
    [rows] = await connection.execute(sqlQuery, [
      userID,
      userName,
      userPrivateID,
    ]);
    if (rows.affectedRows < 1) {
      connection.release();
      res.status(500).send({ error: 'Hiba történt a regisztráció közben.' });
      return -1;
    }
    //i dont set cookies here, because if something goes wrong
    //the user may dont get the privateID, and cant login
    connection.release();
    res.status(200).send({
      succes:
        'Sikeres regisztráció, a privát azonosítód: [ ' +
        userPrivateID +
        ' ] TEDD EL, MERT EZZEL TUDSZ MAJD BEJELENTKEZNI!',
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

module.exports = { postRegistration };
