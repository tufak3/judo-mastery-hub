const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

class CompetitionsService {
  async getAllCompetitions() {
    try {
      const response = await fetch(`${API_URL}/competitions`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching competitions:', error);
      return [];
    }
  }

  async getActiveCompetitions() {
    try {
      const response = await fetch(`${API_URL}/competitions/active`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching active competitions:', error);
      return [];
    }
  }

  async addCompetition(competition) {
    try {
      const response = await fetch(`${API_URL}/competitions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(competition),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error adding competition:', error);
      return null;
    }
  }

  async updateCompetition(id, competition) {
    try {
      const response = await fetch(`${API_URL}/competitions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(competition),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating competition:', error);
      return null;
    }
  }

  async deleteCompetition(id) {
    try {
      const response = await fetch(`${API_URL}/competitions/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting competition:', error);
      return false;
    }
  }
}

const competitionsService = new CompetitionsService();
export default competitionsService; 