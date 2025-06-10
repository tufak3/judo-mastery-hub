// Константы для ограничений
export const MAX_IMAGE_WIDTH = 1200;
export const MAX_IMAGE_HEIGHT = 800;
export const MAX_TEXT_LENGTH = 1000;

// Функция для обрезки текста
export const truncateText = (text, maxLength = MAX_TEXT_LENGTH) => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// Функция для предварительной обработки изображения перед загрузкой
export const processImageBeforeUpload = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Вычисляем новые размеры, сохраняя пропорции
        if (width > MAX_IMAGE_WIDTH) {
          height = (height * MAX_IMAGE_WIDTH) / width;
          width = MAX_IMAGE_WIDTH;
        }
        if (height > MAX_IMAGE_HEIGHT) {
          width = (width * MAX_IMAGE_HEIGHT) / height;
          height = MAX_IMAGE_HEIGHT;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Конвертируем в base64
        const base64String = canvas.toDataURL('image/jpeg', 0.8);
        resolve(base64String);
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Функция для проверки размера файла
export const checkFileSize = (file, maxSizeMB = 10) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    throw new Error(`Размер файла не должен превышать ${maxSizeMB}MB`);
  }
  return true;
};

// Функция для проверки типа файла
export const checkFileType = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Поддерживаются только файлы формата JPEG, PNG и GIF');
  }
  return true;
}; 