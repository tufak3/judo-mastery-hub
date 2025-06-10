const Contact = require('./Contact');
const SocialMedia = require('./SocialMedia');

// Определяем связи
Contact.hasMany(SocialMedia, {
    foreignKey: 'contactId',
    onDelete: 'CASCADE'
});

SocialMedia.belongsTo(Contact, {
    foreignKey: 'contactId'
});

module.exports = {
    Contact,
    SocialMedia
}; 