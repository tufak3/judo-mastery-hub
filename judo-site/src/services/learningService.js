const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/$/, '');

class LearningService {
    async getAllCourses() {
        try {
            const response = await fetch(`${API_URL}/courses`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            return [];
        }
    }

    async getCourseById(id) {
        try {
            const response = await fetch(`${API_URL}/courses/${id}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching course ${id}:`, error);
            return null;
        }
    }

    async addCourse(courseData) {
        try {
            const response = await fetch(`${API_URL}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error adding course:', error);
            return null;
        }
    }

    async updateCourse(id, courseData) {
        try {
            const response = await fetch(`${API_URL}/courses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error updating course:', error);
            return null;
        }
    }

    async deleteCourse(id) {
        try {
            const response = await fetch(`${API_URL}/courses/${id}`, {
                method: 'DELETE',
            });
            return response.ok;
        } catch (error) {
            console.error('Error deleting course:', error);
            return false;
        }
    }

    async enrollInCourse(courseId, studentData) {
        try {
            const response = await fetch(`${API_URL}/courses/${courseId}/enroll`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error enrolling in course:', error);
            return null;
        }
    }
}

const learningService = new LearningService();
export default learningService; 