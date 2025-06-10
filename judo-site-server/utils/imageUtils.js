const sharp = require('sharp');

// Константы для обработки изображений
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_DIMENSION = 1920; // Максимальная ширина или высота
const JPEG_QUALITY = 80; // Качество JPEG

/**
 * Обработка base64 изображения
 * @param {string} base64Image - изображение в формате base64
 * @returns {Promise<string>} обработанное изображение в формате base64
 */
const processImage = async (base64Image) => {
    try {
        // Удаляем префикс data URL если есть
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Проверяем размер файла
        if (imageBuffer.length > MAX_IMAGE_SIZE) {
            throw new Error('Изображение слишком большое (максимум 10MB)');
        }

        // Обрабатываем изображение
        const processedBuffer = await sharp(imageBuffer)
            .resize(MAX_DIMENSION, MAX_DIMENSION, {
                fit: 'inside',
                withoutEnlargement: true
            })
            .jpeg({ quality: JPEG_QUALITY })
            .toBuffer();

        // Конвертируем обратно в base64
        return `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Ошибка при обработке изображения');
    }
};

/**
 * Проверка валидности изображения
 * @param {string} base64Image - изображение в формате base64
 */
const validateImage = (base64Image) => {
    if (!base64Image) {
        throw new Error('Изображение не предоставлено');
    }

    if (!base64Image.startsWith('data:image/')) {
        throw new Error('Неверный формат изображения');
    }

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    if (imageBuffer.length > MAX_IMAGE_SIZE) {
        throw new Error('Изображение слишком большое (максимум 10MB)');
    }
};

module.exports = {
    processImage,
    validateImage,
    MAX_IMAGE_SIZE,
    MAX_DIMENSION,
    JPEG_QUALITY
}; 