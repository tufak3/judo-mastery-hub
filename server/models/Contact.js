const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contact = sequelize.define('Contact', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Не указан'
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Не указан'
    },
    info: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'Информация отсутствует'
    },
    vk: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    telegram: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    whatsapp: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    }
}, {
    timestamps: true
});

module.exports = Contact; 