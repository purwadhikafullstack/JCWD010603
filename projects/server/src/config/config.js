module.exports = {
  development: {
    username: process.env.user,
    password: process.env.pass,
    database: process.env.database,
    host: process.env.host,
    dialect: "mysql",
    timezone: '+07:00'
  }

  // test= {
  //   username= "root",
  //   password= null,
  //   database= "database_test",
  //   host= "127.0.0.1",
  //   dialect= "mysql"
  // },
  // production= {
  //   username= "root",
  //   password= null,
  //   database= "database_production",
  //   host= "127.0.0.1",
  //   dialect= "mysql"
  // }
};
