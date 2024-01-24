const dbConfig = require("../database");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  timezone: dbConfig.timezone,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Usuario = require("./usuario")(sequelize, Sequelize);
db.Modelo = require("./modelo")(sequelize, Sequelize);
db.Moto = require("./moto")(sequelize, Sequelize, db.Modelo);
db.Aluguel = require("./aluguel")(sequelize, Sequelize, db.Moto, db.Usuario, db.Modelo);

db.Moto.belongsTo(db.Modelo, { foreignKey: 'modelo_id', as: 'modelo' });
db.Aluguel.belongsTo(db.Usuario, { foreignKey: 'usuario_id', as: 'usuario'});
db.Aluguel.belongsTo(db.Moto, { foreignKey: 'moto_id', as: 'moto'});
db.Aluguel.belongsTo(db.Modelo, { foreignKey: 'modelo_id', as: 'modelo'});


module.exports = db;