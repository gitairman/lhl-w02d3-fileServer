const net = require('net');
const { IP, PORT } = require('./constants');
const readline = require('node:readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// establishes a connection with the game server
const connect = function () {
  const conn = net.createConnection({
    host: IP,
    port: PORT,
  });

  // interpret incoming data as text
  conn.setEncoding('utf8');

  conn.on('connect', () => {
    console.log(`Connected to server!`);
    conn.write('My name is Aaron');
  });
  conn.on('connect', () => {
    console.log('Start communicating!');
  });

  conn.on('data', (data) => {
    console.log('\nServer says: ', data, '\n');
  });

  return conn;
};

const connection = connect();

const handleInput = (data) => {
  connection.write(data);
};

rl.on('line', handleInput);

module.exports = connect;
