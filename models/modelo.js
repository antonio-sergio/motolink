module.exports = (sequelize, DataTypes) => {
    const Modelo = sequelize.define("modelo", {
        id: {
            type: DataTypes.INTEGER,
            field: 'id_modelo', 
            primaryKey: true,
            autoIncrement: true
        },
        nome: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        marca: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        cor: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        imagem: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        cilindrada: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        diaria: {
            type: DataTypes.DECIMAL(10, 2),
        }
        
    }, {
        freezeTableName: true
    });
    return Modelo;
};