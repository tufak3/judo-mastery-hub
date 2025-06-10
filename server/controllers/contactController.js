const Contact = require('../models/Contact');

// Получить контактные данные
exports.getContacts = async (req, res) => {
    try {
        let contact = await Contact.findOne();
        
        if (!contact) {
            contact = await Contact.create({
                address: 'Не указан',
                phone: 'Не указан',
                info: 'Информация отсутствует',
                vk: '',
                telegram: '',
                whatsapp: ''
            });
        }
        
        res.json(contact);
    } catch (error) {
        console.error('Error getting contacts:', error);
        res.status(500).json({ error: 'Ошибка при получении контактных данных' });
    }
};

// Обновить контактные данные
exports.updateContacts = async (req, res) => {
    try {
        let contact = await Contact.findOne();
        
        if (!contact) {
            contact = await Contact.create(req.body);
        } else {
            await contact.update(req.body);
            contact = await Contact.findOne();
        }
        
        res.json(contact);
    } catch (error) {
        console.error('Error updating contacts:', error);
        res.status(500).json({ error: 'Ошибка при обновлении контактных данных' });
    }
};

// Обновить отдельное поле контактных данных
exports.updateContactField = async (req, res) => {
    try {
        const { field } = req.params;
        const { value } = req.body;

        let contact = await Contact.findOne();
        
        if (!contact) {
            return res.status(404).json({ error: 'Контактные данные не найдены' });
        }

        // Проверяем, существует ли такое поле
        if (!contact.dataValues.hasOwnProperty(field)) {
            return res.status(400).json({ error: 'Указанное поле не существует' });
        }

        // Обновляем только указанное поле
        await contact.update({ [field]: value });
        contact = await Contact.findOne();
        
        res.json(contact);
    } catch (error) {
        console.error('Error updating contact field:', error);
        res.status(500).json({ error: 'Ошибка при обновлении поля' });
    }
};

// Создать контактные данные (если не существуют)
exports.createContacts = async (req, res) => {
    try {
        const existingContacts = await Contact.findOne();
        
        if (existingContacts) {
            return res.status(400).json({ error: 'Контактные данные уже существуют' });
        }
        
        const contacts = await Contact.create(req.body);
        res.status(201).json(contacts);
    } catch (error) {
        console.error('Error creating contacts:', error);
        res.status(500).json({ error: 'Ошибка при создании контактных данных' });
    }
}; 