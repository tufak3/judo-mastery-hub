const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');


class NewsService {
  constructor() {
    this.news = [];
  }

  async getAllNews() {
    try {
      const response = await fetch(`${API_URL}/news`);
      const data = await response.json();
      this.news = data;
      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  async getPublishedNews() {
    try {
      const response = await fetch(`${API_URL}/news/published`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching published news:', error);
      return [];
    }
  }

  async addNews(newsItem) {
    try {
      const response = await fetch(`${API_URL}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newsItem),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding news:', error);
      return null;
    }
  }

  async updateNews(id, updatedNews) {
    try {
      const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedNews),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating news:', error);
      return null;
    }
  }

  async deleteNews(id) {
    try {
      const response = await fetch(`${API_URL}/news/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting news:', error);
      return false;
    }
  }
}

const newsService = new NewsService();
export default newsService; 