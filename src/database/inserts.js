require('../config/bootstrap');

const fs = require('fs');
const { Client } = require('pg');
const copyFrom = require('pg-copy-streams').from;

const client = new Client({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

function dbinserts() {
  const stream = client.query(
    copyFrom(
      `COPY installations (installation_date, data_provider, system_size, zip_code, state, cost) FROM STDIN DELIMITER ',' CSV HEADER;`
    )
  );

  const fileStream = fs.createReadStream('src/database/installations.csv');
  const result = fileStream.pipe(stream);

  result.on('end', () => {
    console.log('Installations end!');
    process.exit(0);
  });
}

client
  .connect()
  .then(() => {
    console.log('Conected.');
    dbinserts();
  })
  .catch(e => console.log('Connect Error:', e));
