const net = require('net');
const { IP, PORT } = require('./constants');
const fs = require('fs');
const path = require('path');
const fileName = 'test.txt';

const clientManagement = (client) => {
  client.setEncoding('utf8');
  const activeConnections = client.server._connections;
  client.write(
    `Hello there, you are one of ${activeConnections} connected clients`
  );

  console.log(`There are currently ${activeConnections} connected clients`);

  const handleData = (data) => {
    const dataArr = data.split(' ');
    console.log(dataArr);

    console.log('\nConnected Client says: ', data);

    const searchFile = (dir, fileName, op) => {
      // read the contents of the directory
      fs.readdir(dir, (err, files) => {
        if (err) throw err;
        // search through the files
        for (const file of files) {
          const filePath = path.join(dir, file);
          // get the file stats
          fs.stat(filePath, (err, fileStat) => {
            if (err) throw err;
            // if the file is a directory, recursive call
            if (fileStat.isDirectory()) {
              searchFile(filePath, fileName, op);
            } else if (file.endsWith(fileName)) {
              // if the file is a match
              if (op === 'send') {
                const readStream = fs.createReadStream(filePath);
                readStream.on('data', (chunk) => {
                  client.write(chunk);
                });
              }
              if (op === 'delete') {
                fs.unlink(filePath, (err) => {
                  if (err) throw err;
                  console.log(`${filePath} was deleted`);
                  return;
                });
              }
            }
          });
        }
      });
    };

    if (dataArr[0] === 'send') {
      searchFile(__dirname, dataArr[1], 'send');
    }
    if (dataArr[0] === 'delete') {
      searchFile(__dirname, dataArr[1], 'delete');
    }
  };

  client.on('data', handleData);
};

const server = net.createServer(clientManagement);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
