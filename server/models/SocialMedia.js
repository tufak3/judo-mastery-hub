const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SocialMedia = sequelize.define('SocialMedia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    platform: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['vk', 'telegram', 'whatsapp']]
        }
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    contactId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Contacts',
            key: 'id'
        }
    }
}, {
    timestamps: true
});

module.exports = SocialMedia; 