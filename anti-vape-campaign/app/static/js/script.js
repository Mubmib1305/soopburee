// Common Functions
async function fetchData() {
    try {
        const response = await fetch('/api/messages/active');
        // Debug: ดูข้อมูลที่ได้จาก API
        const data = await response.json();
        console.log('Fetched data:', data);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return { messages: [], emojis: [] };
    }
}

// Anatomy Page Controller
class AnatomyController {
    constructor() {
        this.messageCount = document.getElementById('messageCount');
        this.anatomyImage = document.getElementById('anatomyImage');
        this.maxMessages = 20;
        this.init();
    }

    init() {
        this.fetchAndUpdate();
        setInterval(() => this.fetchAndUpdate(), 5000);
    }

    async fetchAndUpdate() {
        const data = await fetchData();
        const messages = data.messages || [];
        this.updateAnatomyColor(messages.length);
        this.updateCounter(messages.length);
    }

    updateAnatomyColor(totalCount) {
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
            document.getElementById('grayImage').style.clipPath = 
                `polygon(0 ${100 - height}%, 100% ${100 - height}%, 100% 100%, 0 100%)`;
        }
    }

    updateCounter(totalCount) {
        this.messageCount.textContent = `${totalCount}/${this.maxMessages}`;
    }
}

class MessagesController {
    constructor() {
        this.scrollContainer = document.getElementById('scrollMessages');
        this.totalMessages = document.getElementById('totalMessages');
        this.messagesWrapper = document.querySelector('.messages-wrapper');
        this.messages = [];
        this.currentMessageIndex = 0;
        this.messageChangeInterval = 5000;
        this.messageTimer = null;
        
        // โหลดฟอนต์ Prompt แบบโปรแกรม
        this.loadPromptFont();
        
        this.init();
    }

    // เพิ่มเมธอดเพื่อโหลดฟอนต์ Prompt
    loadPromptFont() {
        // สร้าง link element เพื่อโหลดฟอนต์ Prompt
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Prompt:wght@200;400;600&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
        
        console.log('Prompt font link added to document head');
    }

    init() {
        this.fetchAndUpdate();
        setInterval(() => this.fetchAndUpdate(), 5000);
    }

    async fetchAndUpdate() {
        const data = await fetchData();
        const newMessages = data.messages || [];
        
        if (JSON.stringify(this.messages) !== JSON.stringify(newMessages)) {
            this.messages = newMessages;

            this.resetMessageDisplay();
        }
        
        this.updateCounter();
    }

    resetMessageDisplay() {
        if (this.messageTimer) {
            clearInterval(this.messageTimer);
            this.messageTimer = null;
        }

        this.currentMessageIndex = 0;
        
        this.displayCurrentMessage();

        if (this.messages.length > 1) {
            this.messageTimer = setInterval(() => {
                this.currentMessageIndex = (this.currentMessageIndex + 1) % this.messages.length;
                this.displayCurrentMessage();
            }, this.messageChangeInterval);
        }
    }

    displayCurrentMessage() {

        if (this.messages.length === 0) {
            this.scrollContainer.innerHTML = `
                <div class="message-item" style="
                    font-family: 'Prompt', sans-serif !important; 
                    font-weight: 200;
                    font-size: 24px;
                    text-align: center;
                    padding: 20px;
                    opacity: 0;
                    animation: fadeIn 1s ease forwards;
                ">ยังไม่มีข้อความ</div>
            `;
            return;
        }

        const currentMessage = this.messages[this.currentMessageIndex];
        const senderName = currentMessage.sender || 'ไม่ระบุชื่อ';
        
        this.scrollContainer.innerHTML = `
            <div class="message-container" style="
                display: flex;
                flex-direction: column;
                width: 100%;
                max-width: 80%;
                opacity: 0;
                animation: fadeIn 1s ease forwards;
            ">
                <div class="message-item" style="
                    font-family: 'Prompt', sans-serif !important; 
                    font-weight: 200;
                    font-size: 24px;
                    text-align: center;
                    padding: 20px;
                ">${currentMessage.content}</div>
                <div class="message-sender" style="
                    font-family: 'Prompt', sans-serif !important;
                    font-weight: 200;
                    font-size: 16px;
                    text-align: right;
                    padding-right: 20px;
                    margin-top: 5px;
                    color: rgba(255, 255, 255, 0.8);
                ">- ${senderName}</div>
            </div>
        `;

        if (!document.getElementById('message-animations')) {
            const style = document.createElement('style');
            style.id = 'message-animations';
            style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.scrollContainer.style.position = 'absolute';
        this.scrollContainer.style.top = '50%';
        this.scrollContainer.style.left = '50%';
        this.scrollContainer.style.transform = 'translate(-50%, -50%)';
        this.scrollContainer.style.width = '100%';
        this.scrollContainer.style.display = 'flex';
        this.scrollContainer.style.justifyContent = 'center';
        this.scrollContainer.style.alignItems = 'center';
        this.scrollContainer.style.fontFamily = "'Prompt', sans-serif";
    }

    updateCounter() {
        this.totalMessages.textContent = `จำนวนข้อความทั้งหมด: ${this.messages.length}`;
        this.totalMessages.style.fontFamily = "'Prompt', sans-serif";
    }
}

// Emoji Page Controller
class EmojiController {
    constructor() {
        this.emojiContainer = document.getElementById('emojiGrid');
        this.lastUpdateElement = document.getElementById('lastUpdate');
        this.emojis = [];
        this.currentEmojiIndex = 0;
        this.bubbleCount = 300;
        this.emojiDisplayTime = 5000;
        this.gridSize = 4;
        this.lastEmojiTimestamp = null;
        this.bubbleInterval = null;
        this.init();
    }

    init() {
        this.fetchAndUpdate();
        setInterval(() => this.fetchAndUpdate(), 5000);
        setInterval(() => this.updateLastUpdateTime(), 60000);
    }

    async fetchAndUpdate() {
        const data = await fetchData();
        const newEmojis = [];
        
        if (data.emojis && Array.isArray(data.emojis)) {
            data.emojis.forEach(emoji => {
                if (emoji && emoji.content && 
                    emoji.content !== 'EMPTY' && 
                    emoji.content !== 'NULL' && 
                    emoji.content.trim() !== '') {
                    newEmojis.push({
                        content: emoji.content.trim(),
                        type: emoji.type || 'emoji',
                        flower_id: emoji.flower_id || null,
                        timestamp: new Date(emoji.timestamp || Date.now())
                    });
                }
            });
        }

        newEmojis.sort((a, b) => b.timestamp - a.timestamp);

        if (this.emojis.length !== newEmojis.length || 
            JSON.stringify(this.emojis.map(e => e.content)) !== 
            JSON.stringify(newEmojis.map(e => e.content))) {
            
            this.stopAllAnimations();
            this.emojis = newEmojis;
            this.currentEmojiIndex = 0;

            if (newEmojis.length > 0) {
                this.lastEmojiTimestamp = newEmojis[0].timestamp;
                this.updateLastUpdateTime();
            }

            this.startEmojiAnimation();
        }
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

    stopAllAnimations() {
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
            
            const emoji = this.emojis[index];
            this.createBubbles(emoji.content, emoji.type, emoji.flower_id);
            
            setTimeout(() => {
                this.stopAllAnimations();
                showEmoji(index + 1);
            }, this.emojiDisplayTime);
        };

        showEmoji(0);
    }

    createBubbles(emojiContent, emojiType, flowerId) {
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
            
            if (emojiType === 'flower' && flowerId) {
                // สร้าง element รูปภาพสำหรับดอกไม้
                const img = document.createElement('img');
                if (flowerId === 1) {
                    img.src = '/static/images/Flower_1.png'; 
                    img.alt = 'ดอกกล้วยไม้';
                } else if (flowerId === 2) {
                    img.src = '/static/images/Flower_2.png';
                    img.alt = 'ดอกเดหลี';
                } else if (flowerId === 3) {
                    img.src = '/static/images/Flower_3.png';
                    img.alt = 'ดอกไอริส';
                } else {
                    img.src = '/static/images/Flower_1.png';
                    img.alt = 'ดอกไม้';
                }
                img.style.width = '100%';
                img.style.height = '100%';
                bubble.appendChild(img);
            } else {
                bubble.textContent = emojiContent;
            }
            
            const scale = 1 + Math.random() * 0.5;
            const duration = 1500 + Math.random() * 1000;
            const rotateStart = -30 + Math.random() * 60;
            const rotateEnd = -360 + Math.random() * 720;
            const pathControl1 = -30 + Math.random() * 60;

            if (emojiType === 'flower') {
                bubble.style.cssText = `
                    left: ${startX}%;
                    top: ${startY}%;
                    width: ${30 * scale}px;
                    height: ${30 * scale}px;
                    animation-duration: ${duration}ms;
                    --rotate-start: ${rotateStart}deg;
                    --rotate-end: ${rotateEnd}deg;
                    --path-control1: ${pathControl1}px;
                    --random-scale: ${0.5 + Math.random() * 0.5};
                    opacity: 0;
                `;
            } else {
                bubble.style.cssText = `
                    left: ${startX}%;
                    top: ${startY}%;
                    font-size: ${18 * scale}px;
                    animation-duration: ${duration}ms;
                    --rotate-start: ${rotateStart}deg;
                    --rotate-end: ${rotateEnd}deg;
                    --path-control1: ${pathControl1}px;
                    --random-scale: ${0.5 + Math.random() * 0.5};
                    opacity: 0;
                `;
            }
            
            this.emojiContainer.appendChild(bubble);
            
            setTimeout(() => bubble.style.opacity = '1', 10);

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
}

// Page Initialization Functions
function initAnatomyPage() {
    new AnatomyController();
}

function initMessagesPage() {
    new MessagesController();
}

function initEmojiPage() {
    new EmojiController();
}