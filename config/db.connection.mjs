import mysql from "mysql2"

const connection = mysql.createConnection({
  host: 'vedassistemas.com.br',
  user: 'vedas213_xml2024',
  password: '7u,4zYm3!TZx',
  database: 'vedas213_liberacao'
});
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  }
});

export { connection };