// ===== JOKE API HANDLER =====

class JokeAPI {
    constructor() {
        this.baseURL = 'https://official-joke-api.appspot.com';
        this.currentJoke = null;
        this.jokeHistory = this.loadHistory();
        this.favorites = this.loadFavorites();
    }

    /**
     * Lấy ngẫu nhiên một chuyện cười
     */
    async getRandomJoke() {
        try {
            const response = await fetch(`${this.baseURL}/random_joke`);
            if (!response.ok) {
                throw new Error('Không thể lấy chuyện cười');
            }
            const joke = await response.json();
            this.currentJoke = joke;
            this.addToHistory(joke);
            return joke;
        } catch (error) {
            console.error('Lỗi API:', error);
            throw error;
        }
    }

    /**
     * Lấy chuyện cười theo loại
     */
    async getJokeByType(type = 'general') {
        try {
            const response = await fetch(`${this.baseURL}/jokes/${type}/random`);
            if (!response.ok) {
                throw new Error('Không thể lấy chuyện cười');
            }
            const joke = await response.json();
            this.currentJoke = joke;
            this.addToHistory(joke);
            return joke;
        } catch (error) {
            console.error('Lỗi API:', error);
            throw error;
        }
    }

    /**
     * Lấy chuyện cười theo định dạng
     */
    async getJokeByFormat(format = 'single') {
        try {
            const response = await fetch(`${this.baseURL}/jokes/${format}/random`);
            if (!response.ok) {
                throw new Error('Không thể lấy chuyện cười');
            }
            const joke = await response.json();
            this.currentJoke = joke;
            this.addToHistory(joke);
            return joke;
        } catch (error) {
            console.error('Lỗi API:', error);
            throw error;
        }
    }

    /**
     * Lấy chuyện cười với bộ lọc
     */
    async getJokeWithFilters(type = 'any', format = 'any') {
        try {
            let url = `${this.baseURL}/jokes`;
            
            // Nếu có filter type
            if (type !== 'any' && format === 'any') {
                url += `/${type}/random`;
            }
            // Nếu có filter format
            else if (type === 'any' && format !== 'any') {
                url += `/${format}/random`;
            }
            // Nếu có cả hai filter
            else if (type !== 'any' && format !== 'any') {
                url += `/${type}/${format}/random`;
            }
            // Không có filter
            else {
                url += `/random`;
            }

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Không thể lấy chuyện cười');
            }
            const joke = await response.json();
            this.currentJoke = joke;
            this.addToHistory(joke);
            return joke;
        } catch (error) {
            console.error('Lỗi API:', error);
            throw error;
        }
    }

    /**
     * Lấy danh sách các loại chuyện cười
     */
    async getJokeTypes() {
        try {
            const response = await fetch(`${this.baseURL}/types`);
            if (!response.ok) {
                throw new Error('Không thể lấy loại chuyện cười');
            }
            return await response.json();
        } catch (error) {
            console.error('Lỗi API:', error);
            throw error;
        }
    }

    /**
     * Lấy tất cả chuyện cười theo loại
     */
    async getAllJokesByType(type) {
        try {
            const response = await fetch(`${this.baseURL}/jokes/${type}/ten`);
            if (!response.ok) {
                throw new Error('Không thể lấy chuyện cười');
            }
            return await response.json();
        } catch (error) {
            console.error('Lỗi API:', error);
            throw error;
        }
    }

    /**
     * Thêm chuyện cười vào lịch sử
     */
    addToHistory(joke) {
        const historyItem = {
            id: joke.id,
            type: joke.type,
            setup: joke.setup || joke.joke,
            delivery: joke.delivery || '',
            timestamp: new Date().toLocaleTimeString('vi-VN'),
            fullText: this.formatJoke(joke)
        };

        // Loại bỏ mục trùng lặp nếu có
        this.jokeHistory = this.jokeHistory.filter(item => item.id !== joke.id);
        
        // Thêm vào đầu
        this.jokeHistory.unshift(historyItem);
        
        // Giữ lại tối đa 50 mục
        if (this.jokeHistory.length > 50) {
            this.jokeHistory = this.jokeHistory.slice(0, 50);
        }

        this.saveHistory();
    }

    /**
     * Lưu lịch sử vào localStorage
     */
    saveHistory() {
        localStorage.setItem('jokeHistory', JSON.stringify(this.jokeHistory));
    }

    /**
     * Tải lịch sử từ localStorage
     */
    loadHistory() {
        try {
            const history = localStorage.getItem('jokeHistory');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Lỗi tải lịch sử:', error);
            return [];
        }
    }

    /**
     * Xóa lịch sử
     */
    clearHistory() {
        this.jokeHistory = [];
        localStorage.removeItem('jokeHistory');
    }

    /**
     * Thêm vào yêu thích
     */
    addToFavorites(joke) {
        const favoriteItem = {
            id: joke.id,
            type: joke.type,
            setup: joke.setup || joke.joke,
            delivery: joke.delivery || '',
            fullText: this.formatJoke(joke),
            addedAt: new Date().toLocaleString('vi-VN')
        };

        // Kiểm tra xem đã tồn tại chưa
        if (!this.favorites.some(item => item.id === joke.id)) {
            this.favorites.unshift(favoriteItem);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    /**
     * Xóa khỏi yêu thích
     */
    removeFromFavorites(jokeId) {
        this.favorites = this.favorites.filter(item => item.id !== jokeId);
        this.saveFavorites();
    }

    /**
     * Lưu yêu thích vào localStorage
     */
    saveFavorites() {
        localStorage.setItem('jokeFavorites', JSON.stringify(this.favorites));
    }

    /**
     * Tải yêu thích từ localStorage
     */
    loadFavorites() {
        try {
            const favorites = localStorage.getItem('jokeFavorites');
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('Lỗi tải yêu thích:', error);
            return [];
        }
    }

    /**
     * Kiểm tra xem chuyện cười có trong yêu thích không
     */
    isFavorite(jokeId) {
        return this.favorites.some(item => item.id === jokeId);
    }

    /**
     * Định dạng chuyện cười thành chuỗi
     */
    formatJoke(joke) {
        if (joke.delivery) {
            // Two-part joke
            return `${joke.setup} ${joke.delivery}`;\n        } else {\n            // Single joke\n            return joke.joke;\n        }\n    }\n\n    /**\n     * Lấy số lượng chuyện cười đã lấy\n     */\n    getJokeCount() {\n        return this.jokeHistory.length;\n    }\n\n    /**\n     * Lấy số lượng yêu thích\n     */\n    getFavoriteCount() {\n        return this.favorites.length;\n    }\n}\n\n// Export\nif (typeof module !== 'undefined' && module.exports) {\n    module.exports = JokeAPI;\n}\n