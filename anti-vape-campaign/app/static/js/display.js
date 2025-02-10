class DisplayController {
    constructor() {
        this.scrollContainer = document.getElementById('scrollMessages');
        this.emojiContainer = document.getElementById('emojiGrid');
        this.totalMessages = document.getElementById('totalMessages');
        this.messageCount = document.getElementById('messageCount');
        this.anatomyImage = document.getElementById('anatomyImage');
        this.lastUpdateElement = document.getElementById('lastUpdate');
        this.messages = [];
        this.emojis = [];
        this.currentEmojiIndex = 0;
        this.bubbleInterval = null;
        this.emojiSwitchInterval = null;
        this.isScrolling = false;
        this.maxMessages = 20;
        this.bubbleCount = 300;
        this.emojiDisplayTime = 5000;
        this.gridSize = 4;
        this.lastEmojiTimestamp = null;
        this.init();
    }

    init() {
        this.fetchMessages();
        setInterval(() => this.fetchMessages(), 5000);
        setInterval(() => this.updateLastUpdateTime(), 60000);
    }

    updateLastUpdateTime() {
        if (!this.lastEmojiTimestamp) return;
        
        const now = new Date();
        const diffInSeconds = Math.floor((now - this.lastEmojiTimestamp) / 1000);
        
        let timeText;
        if (diffInSeconds < 60) {
            timeText = 'เมื่อสักครู่';
        } else {
            const diffInMinutes = Math.floor(diffInSeconds / 60);
            if (diffInMinutes < 60) {
                timeText = `${diffInMinutes} นาทีที่แล้ว`;
            } else {
                const hours = Math.floor(diffInMinutes / 60);
                if (hours < 24) {
                    timeText = `${hours} ชั่วโมงที่แล้ว`;
                } else {
                    const days = Math.floor(hours / 24);
                    timeText = `${days} วันที่แล้ว`;
                }
            }
        }
        
        this.lastUpdateElement.textContent = `อัพเดทล่าสุด: ${timeText}`;
    }

    async fetchMessages() {
        try {
            const response = await fetch('/api/messages/active');
            const data = await response.json();
            
            this.messages = data.messages || [];
            
            const newEmojis = [];
            if (data.emojis && Array.isArray(data.emojis)) {
                data.emojis.forEach(emoji => {
                    if (emoji && emoji.content && 
                        emoji.content !== 'EMPTY' && 
                        emoji.content !== 'NULL' && 
                        emoji.content.trim() !== '') {
                        newEmojis.push({
                            content: emoji.content.trim(),
                            timestamp: new Date(emoji.timestamp || Date.now())
                        });
                    }
                });
            }

            newEmojis.sort((a, b) => b.timestamp - a.timestamp);

            if (this.emojis.length !== newEmojis.length || 
                JSON.stringify(this.emojis.map(e => e.content)) !== 
                JSON.stringify(newEmojis.map(e => e.content))) {
                
                console.log('New emojis detected:', newEmojis);
                this.stopAllAnimations();
                this.emojis = newEmojis;
                this.currentEmojiIndex = 0;

                if (newEmojis.length > 0) {
                    this.lastEmojiTimestamp = newEmojis[0].timestamp;
                    this.updateLastUpdateTime();
                }

                this.startEmojiAnimation();
            }

            this.updateMessages();
            this.updateAnatomyColor();
            this.updateCounters();
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }

    stopAllAnimations() {
        if (this.emojiSwitchInterval) {
            clearInterval(this.emojiSwitchInterval);
            this.emojiSwitchInterval = null;
        }
        if (this.bubbleInterval) {
            clearInterval(this.bubbleInterval);
            this.bubbleInterval = null;
        }
        this.emojiContainer.innerHTML = '';
    }

    startEmojiAnimation() {
        if (this.emojis.length === 0) return;
        
        const showEmoji = (index) => {
            if (index >= this.emojis.length) {
                index = 0;
            }
            
            console.log(`Showing emoji ${index + 1}/${this.emojis.length}:`, this.emojis[index].content);
            
            this.createBubbles(this.emojis[index].content);
            
            setTimeout(() => {
                this.stopAllAnimations();
                showEmoji(index + 1);
            }, this.emojiDisplayTime);
        };

        showEmoji(0);
    }

    createBubbles(emojiContent) {
        const grid = Array(this.gridSize).fill().map(() => 
            Array(this.gridSize).fill().map(() => ({
                bubbles: 0,
                maxBubbles: Math.ceil(this.bubbleCount / (this.gridSize * this.gridSize))
            }))
        );

        const createBubble = () => {
            let minRow = 0, minCol = 0, minBubbles = Infinity;
            for (let i = 0; i < this.gridSize; i++) {
                for (let j = 0; j < this.gridSize; j++) {
                    if (grid[i][j].bubbles < minBubbles) {
                        minRow = i;
                        minCol = j;
                        minBubbles = grid[i][j].bubbles;
                    }
                }
            }

            const cellWidth = 100 / this.gridSize;
            const cellHeight = 100 / this.gridSize;
            const startX = (minCol * cellWidth) + (Math.random() * (cellWidth * 0.8) + cellWidth * 0.1);
            const startY = (minRow * cellHeight) + (Math.random() * (cellHeight * 0.8) + cellHeight * 0.1);

            const bubble = document.createElement('div');
            bubble.className = 'emoji-bubble';
            bubble.textContent = emojiContent;
            
            const scale = 1 + Math.random() * 0.5;
            const duration = 1500 + Math.random() * 1000;
            const rotateStart = -30 + Math.random() * 60;
            const rotateEnd = -360 + Math.random() * 720;
            const pathControl1 = -30 + Math.random() * 60;
            const pathControl2 = -30 + Math.random() * 60;

            bubble.style.cssText = `
                left: ${startX}%;
                top: ${startY}%;
                font-size: ${18 * scale}px;
                animation-duration: ${duration}ms;
                animation-delay: 0ms;
                --rotate-start: ${rotateStart}deg;
                --rotate-end: ${rotateEnd}deg;
                --path-control1: ${pathControl1}px;
                --path-control2: ${pathControl2}px;
                --random-scale: ${0.5 + Math.random() * 0.5};
                opacity: 0;
            `;
            
            this.emojiContainer.appendChild(bubble);
            
            setTimeout(() => {
                bubble.style.opacity = '1';
            }, 10);

            bubble.addEventListener('animationend', () => {
                bubble.remove();
                grid[minRow][minCol].bubbles--;
            });

            grid[minRow][minCol].bubbles++;
        };

        const initialBubblesPerCell = Math.ceil(this.bubbleCount / (this.gridSize * this.gridSize));
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                for (let k = 0; k < initialBubblesPerCell; k++) {
                    setTimeout(() => createBubble(), k * 20);
                }
            }
        }

        this.bubbleInterval = setInterval(() => {
            if (this.emojiContainer) {
                const currentBubbles = this.emojiContainer.getElementsByClassName('emoji-bubble');
                if (currentBubbles.length < this.bubbleCount) {
                    createBubble();
                }
            }
        }, 100);
    }

    updateMessages() {
        let messageElements = this.messages
            .map(msg => `<div class="message-item">${msg.content}</div>`)
            .join('');
        messageElements = messageElements + messageElements;
        if (!this.isScrolling) {
            this.scrollContainer.innerHTML = messageElements;
            this.startScrolling();
        } else {
            const currentScroll = this.scrollContainer.style.transform;
            this.scrollContainer.innerHTML = messageElements;
            this.scrollContainer.style.transform = currentScroll;
        }
    }

    startScrolling() {
        if (this.isScrolling) return;
        this.isScrolling = true;

        const duration = 30000;
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) % duration;
            const percent = progress / duration;
            const totalHeight = this.scrollContainer.scrollHeight / 2;
            const scrollPosition = totalHeight * percent;
            this.scrollContainer.style.transform = `translateY(-${scrollPosition}px)`;
            if (percent >= 0.99) {
                startTime = timestamp;
            }
            requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
    }

    updateAnatomyColor() {
        const totalCount = this.messages.length;
        const percentage = Math.min(totalCount / this.maxMessages, 1);
        const height = 100 * percentage;
        
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
        const totalCount = this.messages.length;
        this.messageCount.textContent = `${totalCount}/${this.maxMessages}`;
        this.totalMessages.textContent = `จำนวนข้อความทั้งหมด: ${totalCount}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new DisplayController();
});