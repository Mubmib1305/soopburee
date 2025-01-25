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

document.addEventListener('DOMContentLoaded', () => {
    new DisplayController();
});