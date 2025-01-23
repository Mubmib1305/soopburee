class SmokeParticle {
    constructor(canvas, x, y) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = -Math.random() * 3 - 1;
        this.life = 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        this.turbulence = Math.random() * 0.5;
    }

    update() {
        this.life -= 0.01;
        this.rotation += this.rotationSpeed;
        this.x += this.speedX + Math.sin(this.y * 0.1) * this.turbulence;
        this.y += this.speedY;
        this.size += 0.2;
    }

    draw() {
        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(this.rotation * Math.PI / 180);
        this.ctx.beginPath();

        const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
        gradient.addColorStop(0, `rgba(50, 50, 50, ${this.life * 0.5})`);
        gradient.addColorStop(0.5, `rgba(30, 30, 30, ${this.life * 0.3})`);
        gradient.addColorStop(1, `rgba(20, 20, 20, 0)`);

        this.ctx.fillStyle = gradient;
        this.ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }
}

class SmokeEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.isActive = false;
    }

    start() {
        this.isActive = true;
        this.animate();
    }

    stop() {
        this.isActive = false;
    }

    createParticles() {
        if (this.particles.length < 100) {
            const x = this.canvas.width / 2 + Math.random() * 20 - 10;
            const y = this.canvas.height - 50;
            this.particles.push(new SmokeParticle(this.canvas, x, y));
        }
    }

    animate() {
        if (!this.isActive) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.createParticles();

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update();
            particle.draw();

            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('smokeCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const smokeEffect = new SmokeEffect(canvas);
    smokeEffect.start();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});