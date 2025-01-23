class DisplayController {
    constructor() {
        this.scrollContainer = document.getElementById('scrollMessages');
        this.totalMessages = document.getElementById('totalMessages');
        this.messageCount = document.getElementById('messageCount');
        this.anatomyImage = document.getElementById('anatomyImage');
        this.messages = [];
        this.isScrolling = false;
        this.maxMessages = 20;
        this.init();
    }

    init() {
        this.fetchMessages();
        setInterval(() => this.fetchMessages(), 5000);
    }

    async fetchMessages() {
        try {
            const response = await fetch('/api/messages/active');
            const data = await response.json();
            this.messages = data.messages || [];
            this.updateDisplay();
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    updateDisplay() {
        this.updateMessages();
        this.updateAnatomyColor();
        this.updateCounters();
    }

    updateMessages() {
        // Create doubled content for seamless scrolling
        const messageElements = this.messages
            .map(msg => `<div class="message-item">${msg.content}</div>`)
            .join('');
        
        const doubledContent = messageElements + messageElements;
        
        if (!this.isScrolling) {
            this.scrollContainer.innerHTML = doubledContent;
            this.startScrolling();
        } else {
            // Update content without disturbing the animation
            const currentScroll = this.scrollContainer.style.transform;
            this.scrollContainer.innerHTML = doubledContent;
            this.scrollContainer.style.transform = currentScroll;
        }
    }

    startScrolling() {
        if (this.isScrolling) return;
        this.isScrolling = true;

        const duration = 30000; // 30 seconds for one complete scroll
        let startTime = null;
        let lastTimestamp = 0;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) % duration;
            const percent = progress / duration;

            // Calculate scroll position
            const totalHeight = this.scrollContainer.scrollHeight / 2;
            const scrollPosition = totalHeight * percent;

            this.scrollContainer.style.transform = `translateY(-${scrollPosition}px)`;

            // Reset when reaching the halfway point
            if (percent >= 0.99) {
                startTime = timestamp;
            }

            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    updateAnatomyColor() {
        const percentage = Math.min(this.messages.length / this.maxMessages, 1);
        const height = 100 * percentage;
        
        // สร้าง element ซ้อนกัน
        const grayImage = this.anatomyImage.cloneNode(true);
        const normalImage = this.anatomyImage;
        
        grayImage.style.filter = 'grayscale(1)';
        grayImage.style.position = 'absolute';
        grayImage.style.clipPath = `polygon(0 ${100 - height}%, 100% ${100 - height}%, 100% 100%, 0 100%)`;
        grayImage.style.zIndex = '1';
        
        if (!document.getElementById('grayImage')) {
            grayImage.id = 'grayImage';
            normalImage.parentNode.appendChild(grayImage);
        } else {
            document.getElementById('grayImage').style.clipPath = `polygon(0 ${100 - height}%, 100% ${100 - height}%, 100% 100%, 0 100%)`;
        }
    }

    updateCounters() {
        this.messageCount.textContent = `${this.messages.length}/${this.maxMessages}`;
        this.totalMessages.textContent = `Total Messages: ${this.messages.length}`;
    }
}

class EnhancedSmokeEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.isActive = false;
        this.lastTime = 0;
        this.smokePoints = this.generateSmokePoints();
    }

    generateSmokePoints() {
        const points = [];
        const numPoints = 3;
        const width = this.canvas.width;
        
        for (let i = 0; i < numPoints; i++) {
            points.push({
                x: width * (0.4 + Math.random() * 0.2),
                y: this.canvas.height - 20,
                lastX: 0,
                lastY: 0
            });
        }
        return points;
    }

    createParticle(x, y) {
        return {
            x,
            y,
            size: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            speedY: -Math.random() * 3 - 2,
            life: 1,
            opacity: Math.random() * 0.5 + 0.5,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 2 - 1,
            turbulence: Math.random() * 0.5,
            color: `rgba(${180 + Math.random() * 20}, ${180 + Math.random() * 20}, ${180 + Math.random() * 20}, 1)`
        };
    }

    update(deltaTime) {
        // Add new particles
        this.smokePoints.forEach(point => {
            if (Math.random() < 0.3) {
                point.lastX = point.x + Math.random() * 10 - 5;
                point.lastY = point.y + Math.random() * 10 - 5;
                this.particles.push(this.createParticle(point.lastX, point.lastY));
            }
        });

        // Update particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= 0.01 * deltaTime;
            p.rotation += p.rotationSpeed * deltaTime;
            p.x += p.speedX + Math.sin(p.y * 0.1) * p.turbulence;
            p.y += p.speedY;
            p.size += 0.2 * deltaTime;
            p.opacity -= 0.005 * deltaTime;

            if (p.life <= 0 || p.opacity <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation * Math.PI / 180);
            
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
            gradient.addColorStop(0, p.color.replace('1)', `${p.opacity})`));
            gradient.addColorStop(0.5, p.color.replace('1)', `${p.opacity * 0.5})`));
            gradient.addColorStop(1, p.color.replace('1)', '0)'));
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }

    animate(currentTime) {
        if (!this.isActive) return;

        const deltaTime = (currentTime - this.lastTime) / 16;
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.draw();

        requestAnimationFrame(time => this.animate(time));
    }

    start() {
        this.isActive = true;
        this.lastTime = performance.now();
        this.animate(this.lastTime);
    }

    stop() {
        this.isActive = false;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.smokePoints = this.generateSmokePoints();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DisplayController();
    
    const canvas = document.getElementById('smokeCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const smokeEffect = new EnhancedSmokeEffect(canvas);
    smokeEffect.start();
    
    window.addEventListener('resize', () => smokeEffect.resize());
});