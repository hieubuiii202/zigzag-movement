// ===== ZIG ZAG MOVEMENT CONFIGURATION =====
// File cấu hình di chuyển zig zag

const ZigZagConfig = {
    // Cấu hình mặc định
    default: {
        amplitude: 50,          // Biên độ (độ lệch tối đa từ đường thẳng)
        frequency: 3,           // Tần số (số lần zig zag trong quãng đường)
        speed: 2,               // Tốc độ di chuyển (pixel/frame)
        direction: 'horizontal',// Hướng: 'horizontal', 'vertical', 'diagonal'
        color: '#3498db',       // Màu sắc của đối tượng
        startX: 50,             // Vị trí X ban đầu
        startY: 200,            // Vị trí Y ban đầu
        endX: 750,              // Vị trí X kết thúc
        endY: 200,              // Vị trí Y kết thúc
        duration: 10000,        // Thời lượng animation (ms)
        isLooping: false,       // Lặp lại animation
        animationFrames: []     // Mảng lưu các frame
    },

    // Cấu hình preset cho các trường hợp khác nhau
    presets: {
        // Zig zag chậm, biên độ lớn
        slow_large: {
            amplitude: 100,
            frequency: 2,
            speed: 1,
            direction: 'horizontal',
            color: '#e74c3c'
        },

        // Zig zag nhanh, biên độ nhỏ
        fast_small: {
            amplitude: 20,
            frequency: 8,
            speed: 4,
            direction: 'horizontal',
            color: '#2ecc71'
        },

        // Zig zag trung bình (cân bằng)
        balanced: {
            amplitude: 50,
            frequency: 4,
            speed: 2,
            direction: 'horizontal',
            color: '#f39c12'
        },

        // Zig zag theo chiều dọc
        vertical: {
            amplitude: 80,
            frequency: 3,
            speed: 2,
            direction: 'vertical',
            color: '#9b59b6'
        }
    },

    // Hàm tạo cấu hình mới
    create: function(options = {}) {
        return { ...this.default, ...options };
    },

    // Hàm tải preset
    loadPreset: function(presetName) {
        if (this.presets[presetName]) {
            return { ...this.default, ...this.presets[presetName] };
        }
        console.warn(`Preset '${presetName}' không tồn tại`);
        return this.default;
    },

    // Hàm lưu cấu hình vào localStorage
    save: function(configName, config) {
        try {
            const allConfigs = JSON.parse(localStorage.getItem('zigzagConfigs')) || {};
            allConfigs[configName] = config;
            localStorage.setItem('zigzagConfigs', JSON.stringify(allConfigs));
            console.log(`✓ Đã lưu cấu hình: ${configName}`);
            return true;
        } catch (error) {
            console.error('Lỗi khi lưu cấu hình:', error);
            return false;
        }
    },

    // Hàm tải cấu hình từ localStorage
    load: function(configName) {
        try {
            const allConfigs = JSON.parse(localStorage.getItem('zigzagConfigs')) || {};
            if (allConfigs[configName]) {
                console.log(`✓ Đã tải cấu hình: ${configName}`);
                return allConfigs[configName];
            }
            console.warn(`Cấu hình '${configName}' không tồn tại`);
            return null;
        } catch (error) {
            console.error('Lỗi khi tải cấu hình:', error);
            return null;
        }
    },

    // Hàm xóa cấu hình từ localStorage
    delete: function(configName) {
        try {
            const allConfigs = JSON.parse(localStorage.getItem('zigzagConfigs')) || {};
            delete allConfigs[configName];
            localStorage.setItem('zigzagConfigs', JSON.stringify(allConfigs));
            console.log(`✓ Đã xóa cấu hình: ${configName}`);
            return true;
        } catch (error) {
            console.error('Lỗi khi xóa cấu hình:', error);
            return false;
        }
    },

    // Hàm liệt kê tất cả cấu hình
    listAll: function() {
        try {
            const allConfigs = JSON.parse(localStorage.getItem('zigzagConfigs')) || {};
            const configNames = Object.keys(allConfigs);
            console.log('Danh sách cấu hình:', configNames);
            return configNames;
        } catch (error) {
            console.error('Lỗi khi liệt kê cấu hình:', error);
            return [];
        }
    },

    // Hàm xuất cấu hình thành JSON string
    export: function(config) {
        return JSON.stringify(config, null, 2);
    },

    // Hàm nhập cấu hình từ JSON string
    import: function(jsonString) {
        try {
            const config = JSON.parse(jsonString);
            console.log('✓ Đã nhập cấu hình');
            return config;
        } catch (error) {
            console.error('Lỗi định dạng JSON:', error);
            return null;
        }
    },

    // Hàm validate cấu hình
    validate: function(config) {
        const errors = [];
        
        if (config.amplitude < 0) {
            errors.push('Biên độ không thể âm');
        }
        if (config.frequency < 1) {
            errors.push('Tần số phải >= 1');
        }
        if (config.speed <= 0) {
            errors.push('Tốc độ phải > 0');
        }
        if (!['horizontal', 'vertical', 'diagonal'].includes(config.direction)) {
            errors.push('Hướng không hợp lệ');
        }
        if (config.duration <= 0) {
            errors.push('Thời lượng phải > 0');
        }

        if (errors.length > 0) {
            console.error('❌ Lỗi cấu hình:', errors);
            return false;
        }

        console.log('✓ Cấu hình hợp lệ');
        return true;
    },

    // Hàm reset về cấu hình mặc định
    reset: function() {
        localStorage.removeItem('zigzagConfigs');
        console.log('✓ Đã reset tất cả cấu hình');
    }
};

// ===== HELPER FUNCTIONS =====

/**
 * Chuyển đổi cấu hình thành định dạng dễ đọc
 */
function formatConfig(config) {
    return `
Cấu hình Di chuyển Zig Zag
==========================
Biên độ (Amplitude): ${config.amplitude}px
Tần số (Frequency): ${config.frequency}
Tốc độ (Speed): ${config.speed}px/frame
Hướng (Direction): ${config.direction}
Màu sắc (Color): ${config.color}
Vị trí bắt đầu: (${config.startX}, ${config.startY})
Vị trí kết thúc: (${config.endX}, ${config.endY})
Thời lượng: ${config.duration}ms
Lặp lại: ${config.isLooping ? 'Có' : 'Không'}
    `.trim();
}

/**
 * So sánh hai cấu hình
 */
function compareConfigs(config1, config2) {
    const differences = {};
    
    for (let key in config1) {
        if (config1[key] !== config2[key]) {
            differences[key] = {
                old: config1[key],
                new: config2[key]
            };
        }
    }
    
    return Object.keys(differences).length > 0 ? differences : null;
}

/**
 * Merge hai cấu hình
 */
function mergeConfigs(baseConfig, overrides) {
    return { ...baseConfig, ...overrides };
}

// Export cho Node.js (nếu cần)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ZigZagConfig,
        formatConfig,
        compareConfigs,
        mergeConfigs
    };
}