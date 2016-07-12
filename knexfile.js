require('dotenv').load()

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/galvanize-reads'
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + "?ssl=true"
  }
};
