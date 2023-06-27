const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { getUserName } = require('./funcs/getUserName.js');
const { postRegistration } = require('./funcs/postRegistration.js');
const { postLogin } = require('./funcs/postLogin.js');

const server = express();
server.use(express.json());
//TODO: if the server and the client is on the same
//then the origin is not needed, and use consts and envs
server.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
server.use(cookieParser());

server.get('/api/userName/', getUserName);
server.post('/api/registration/', postRegistration);
server.post('/api/login/', postLogin);

server.listen(process.env.EXPRESSPORT, () => {
  console.log(`A szerver a kovetkezo porton fut: ${process.env.EXPRESSPORT}`);
});
