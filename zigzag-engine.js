// ===== ZIG ZAG ANIMATION ENGINE =====

class ZigZagEngine {
    constructor() {
        this.isRunning = false;
        this.currentConfig = ZigZagConfig.create();
        this.currentTime = 0;
        this.animationId = null;
        this.startTime = null;
        this.points = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateConfigDisplay();
    }

    setupEventListeners() {
        // Control inputs
        const amplitude = document.getElementById('amplitude');
        const frequency = document.getElementById('frequency');
        const speed = document.getElementById('speed');
        const direction = document.getElementById('direction');
        const color = document.getElementById('color');

        amplitude.addEventListener('input', (e) => {
            this.currentConfig.amplitude = parseInt(e.target.value);
            document.getElementById('amplitudeValue').textContent = e.target.value + 'px';
            this.updateConfigDisplay();
            this.recalculate();
        });

        frequency.addEventListener('input', (e) => {
            this.currentConfig.frequency = parseInt(e.target.value);
            document.getElementById('frequencyValue').textContent = e.target.value;
            this.updateConfigDisplay();
            this.recalculate();
        });

        speed.addEventListener('input', (e) => {
            this.currentConfig.speed = parseFloat(e.target.value);
            document.getElementById('speedValue').textContent = e.target.value;
            this.updateConfigDisplay();
        });

        direction.addEventListener('change', (e) => {
            this.currentConfig.direction = e.target.value;
            this.updateConfigDisplay();
            this.recalculate();
        });

        color.addEventListener('change', (e) => {
            this.currentConfig.color = e.target.value;
            document.getElementById('movingObject').querySelector('circle').setAttribute('fill', e.target.value);
            this.updateConfigDisplay();
        });

        // Control buttons
        document.getElementById('startBtn').addEventListener('click', () => this.start());
        document.getElementById('stopBtn').addEventListener('click', () => this.stop());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('copyBtn').addEventListener('click', () => this.copyConfig());

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const presetName = e.target.dataset.preset;
                this.loadPreset(presetName);
            });
        });

        this.recalculate();
    }

    calculateZigZagPath() {
        const { amplitude, frequency, startX, startY, endX, endY, direction } = this.currentConfig;
        
        let totalDistance, numPoints;
        
        if (direction === 'horizontal') {
            totalDistance = endX - startX;
        } else if (direction === 'vertical') {
            totalDistance = endY - startY;
        } else {
            totalDistance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        }

        numPoints = Math.abs(totalDistance / 5);
        this.points = [];

        for (let i = 0; i <= numPoints; i++) {
            const progress = i / numPoints;
            const waveValue = Math.sin(progress * frequency * Math.PI * 2);
            const offset = waveValue * amplitude;

            let x, y;

            if (direction === 'horizontal') {
                x = startX + (endX - startX) * progress;
                y = startY + offset;
            } else if (direction === 'vertical') {
                x = startX + offset;
                y = startY + (endY - startY) * progress;
            } else { // diagonal
                x = startX + (endX - startX) * progress;
                y = startY + (endY - startY) * progress;
                // Add perpendicular offset
                const dx = endX - startX;
                const dy = endY - startY;
                const len = Math.sqrt(dx * dx + dy * dy);
                const nx = -dy / len;
                const ny = dx / len;
                x += nx * offset;
                y += ny * offset;
            }

            this.points.push({ x: Math.round(x), y: Math.round(y) });
        }
    }

    recalculate() {
        this.calculateZigZagPath();
        this.drawPath();
    }

    drawPath() {
        const pathLine = document.getElementById('pathLine');
        const pointsString = this.points.map(p => `${p.x},${p.y}`).join(' ');
        pathLine.setAttribute('points', pointsString);
    }

    start() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.startTime = Date.now();
        this.currentTime = 0;

        this.updateStatusIndicator('running');
        document.getElementById('statusText').textContent = 'Đang chạy';

        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }

        this.updateStatusIndicator('stopped');
        document.getElementById('statusText').textContent = 'Đã dừng';
    }

    reset() {
        this.stop();
        this.currentTime = 0;
        this.currentConfig = ZigZagConfig.create();
        
        // Reset UI
        document.getElementById('amplitude').value = 50;
        document.getElementById('frequency').value = 3;
        document.getElementById('speed').value = 2;
        document.getElementById('direction').value = 'horizontal';
        document.getElementById('color').value = '#3498db';

        document.getElementById('amplitudeValue').textContent = '50px';
        document.getElementById('frequencyValue').textContent = '3';
        document.getElementById('speedValue').textContent = '2.0';

        document.getElementById('posX').textContent = '50';
        document.getElementById('posY').textContent = '200';
        document.getElementById('progress').textContent = '0';
        document.getElementById('timeLeft').textContent = '0.0';

        // Reset circle position
        const circle = document.getElementById('movingObject').querySelector('circle');
        circle.setAttribute('cx', 50);
        circle.setAttribute('cy', 200);
        circle.setAttribute('fill', '#3498db');

        this.recalculate();
        this.updateConfigDisplay();
    }

    animate() {
        if (!this.isRunning) return;

        const elapsed = Date.now() - this.startTime;
        const progress = Math.min(elapsed / this.currentConfig.duration, 1);

        // Get position based on progress
        const pointIndex = Math.floor(progress * (this.points.length - 1));
        const point = this.points[pointIndex] || this.points[this.points.length - 1];

        // Update position
        document.getElementById('posX').textContent = Math.round(point.x);
        document.getElementById('posY').textContent = Math.round(point.y);

        // Update progress
        document.getElementById('progress').textContent = Math.round(progress * 100);

        // Update time left
        const timeLeft = Math.max(0, (this.currentConfig.duration - elapsed) / 1000);
        document.getElementById('timeLeft').textContent = timeLeft.toFixed(1);

        // Update circle position
        const circle = document.getElementById('movingObject').querySelector('circle');
        circle.setAttribute('cx', point.x);
        circle.setAttribute('cy', point.y);

        if (progress < 1) {
            this.animationId = requestAnimationFrame(() => this.animate());
        } else {
            this.isRunning = false;
            this.updateStatusIndicator('stopped');
            document.getElementById('statusText').textContent = 'Hoàn thành';
        }
    }

    updateStatusIndicator(status) {
        const indicator = document.getElementById('statusIndicator');
        const dot = indicator.querySelector('.status-dot');

        if (status === 'running') {
            indicator.classList.remove('stopped');
            dot.classList.remove('stopped');
        } else {
            indicator.classList.add('stopped');
            dot.classList.add('stopped');
        }
    }

    loadPreset(presetName) {
        const preset = ZigZagConfig.loadPreset(presetName);
        this.currentConfig = { ...this.currentConfig, ...preset };

        // Update UI
        document.getElementById('amplitude').value = preset.amplitude;
        document.getElementById('frequency').value = preset.frequency;
        document.getElementById('speed').value = preset.speed;
        document.getElementById('direction').value = preset.direction;
        document.getElementById('color').value = preset.color;

        document.getElementById('amplitudeValue').textContent = preset.amplitude + 'px';
        document.getElementById('frequencyValue').textContent = preset.frequency;
        document.getElementById('speedValue').textContent = preset.speed;

        // Update active preset button
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        this.recalculate();
        this.updateConfigDisplay();
    }

    updateConfigDisplay() {
        const config = {
            amplitude: this.currentConfig.amplitude,
            frequency: this.currentConfig.frequency,
            speed: this.currentConfig.speed,
            direction: this.currentConfig.direction,
            color: this.currentConfig.color,
            startX: this.currentConfig.startX,
            startY: this.currentConfig.startY,
            endX: this.currentConfig.endX,
            endY: this.currentConfig.endY
        };

        document.getElementById('configCode').textContent = JSON.stringify(config, null, 2);
    }

    copyConfig() {
        const code = document.getElementById('configCode').textContent;
        navigator.clipboard.writeText(code).then(() => {
            const btn = document.getElementById('copyBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Đã sao chép!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    }

    saveConfig(name) {
        return ZigZagConfig.save(name, this.currentConfig);
    }

    loadConfig(name) {
        const config = ZigZagConfig.load(name);
        if (config) {
            this.currentConfig = config;
            this.recalculate();
            this.updateConfigDisplay();
            return true;
        }
        return false;
    }
}

// Initialize engine when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.zigzagEngine = new ZigZagEngine();
});