const mysql = require("mysql2")

const connection = mysql.createConnection({
  host: 'vedassistemas.com.br',
  user: 'vedas213_vedas_xml_manager',
  password: 'UL9xol=(+@iD',
  database: 'vedas213_vedas_xml_manager'
});
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to MySQL database:', error);
  }
});

module.exports = connection;