module.exports = {
    HOST: "localhost",
    USER: "postgres", //nome do usuário do banco de dados, por padrão é 'root'
    PASSWORD: "12345678dev", //senha do banco de dados
    DB: 'motolink', //nome da database, que no workbench é schema
    //conector com mysql
    dialect: "postgres",
    port: 5432,
    timezone: "3:00",
    pool: {
      //conexões abertas
      max: 20,
      min: 0,
      acquire: 30000,
      //tempo de inatividade da conexão para ser removida
      idle: 10000
    },
    dialectOptions: {
      ssl: false // Defina como true se você estiver usando SSL
    }
  };