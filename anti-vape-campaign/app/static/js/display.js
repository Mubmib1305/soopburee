class DisplayController {
    constructor() {
        this.scrollContainer = document.getElementById('scrollMessages');
        this.emojiContainer = document.getElementById('emojiGrid');
        this.totalMessages = document.getElementById('totalMessages');
        this.messageCount = document.getElementById('messageCount');
        this.anatomyImage = document.getElementById('anatomyImage');
        this.messages = [];
        this.emojis = [];
        this.currentEmojiIndex = 0;
        this.isScrolling = false;
        this.maxMessages = 20;
        this.bubbleInterval = null;
        this.emojiChangeInterval = null;
        this.bubbleCount = 200;
        this.init();
    }
 
    init() {
        this.fetchMessages();
        setInterval(() => this.fetchMessages(), 5000);
    }
 
    async fetchMessages() {
        try {
            if (this.bubbleInterval) {
                clearInterval(this.bubbleInterval);
            }
            if (this.emojiChangeInterval) {
                clearInterval(this.emojiChangeInterval);
            }
            
            const response = await fetch('/api/messages/active');
            const data = await response.json();
            
            // แยก messages และ emojis จาก response
            this.messages = data.messages || [];
            this.emojis = data.emojis || [];
 
            console.log('Fetched Messages:', this.messages.length, 'messages', this.messages);
            console.log('Fetched Emojis:', this.emojis.length, 'emojis', this.emojis);
            
            this.updateDisplay();
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    }
 
    updateDisplay() {
        this.updateMessages();
        if (this.emojis.length > 0) {
            console.log('Starting emoji loop with', this.emojis.length, 'emojis');
            this.startEmojiLoop();
        }
        this.updateAnatomyColor();
        this.updateCounters();
    }
 
    updateMessages() {
        let messageElements = this.messages
            .map(msg => `<div class="message-item">${msg.content}</div>`)
            .join('');
        
        console.log('Original messages:', this.messages.length);
        
        // ทำซ้ำแค่ 1 ครั้งเพื่อให้ scroll ต่อเนื่อง
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
 
    startEmojiLoop() {
        if (!this.emojis || this.emojis.length === 0) return;
        
        // เคลียร์ interval เก่าก่อนเริ่มใหม่ทุกครั้ง
        if (this.emojiChangeInterval) {
            clearInterval(this.emojiChangeInterval);
            this.emojiChangeInterval = null;
        }
        
        // เริ่มจากอิโมจิแรก
        this.currentEmojiIndex = 0;
        this.updateEmojis();
 
        // เปลี่ยนอิโมจิทุก 5 วินาที
        this.emojiChangeInterval = setInterval(() => {
            // เพิ่ม index ไปที่อิโมจิถัดไป
            this.currentEmojiIndex++;
            
            // ถ้าเกินจำนวนอิโมจิที่มี ให้กลับไปเริ่มที่ 0
            if (this.currentEmojiIndex >= this.emojis.length) {
                this.currentEmojiIndex = 0;
            }
            
            console.log('Switching to emoji:', this.emojis[this.currentEmojiIndex].content);
            this.updateEmojis();
        }, 5000);
    }
 
    updateEmojis() {
        if (!this.emojiContainer || !this.emojis[this.currentEmojiIndex]) return;
        
        // เคลียร์ interval การสร้างบับเบิลเก่า
        if (this.bubbleInterval) {
            clearInterval(this.bubbleInterval);
            this.bubbleInterval = null;
        }
        
        // เคลียร์บับเบิลเก่าออก
        this.emojiContainer.innerHTML = '';
        
        const currentEmoji = this.emojis[this.currentEmojiIndex].content;
        console.log('Current emoji:', currentEmoji);
 
        const createBubble = () => {
            const bubble = document.createElement('div');
            bubble.className = 'emoji-bubble';
            bubble.textContent = currentEmoji;
            
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const scale = 0.5 + Math.random() * 1.0;
            const duration = 2000 + Math.random() * 2000;
            const delay = Math.random() * 2000;
            const rotateStart = -30 + Math.random() * 60;
            const rotateEnd = -360 + Math.random() * 720;
            const pathControl1 = -50 + Math.random() * 100;
            const pathControl2 = -50 + Math.random() * 100;
 
            bubble.style.cssText = `
                left: ${startX}%;
                top: ${startY}%;
                font-size: ${18 * scale}px;
                animation-duration: ${duration}ms;
                animation-delay: ${delay}ms;
                --rotate-start: ${rotateStart}deg;
                --rotate-end: ${rotateEnd}deg;
                --path-control1: ${pathControl1}px;
                --path-control2: ${pathControl2}px;
                --random-scale: ${0.5 + Math.random() * 0.5};
            `;
            
            this.emojiContainer.appendChild(bubble);
            
            bubble.addEventListener('animationend', () => {
                bubble.remove();
            });
        };
 
        // สร้างบับเบิลชุดใหม่
        for (let i = 0; i < this.bubbleCount; i++) {
            setTimeout(() => createBubble(), i * 50);
        }
        
        // สร้างบับเบิลเพิ่มเติมเรื่อยๆ
        this.bubbleInterval = setInterval(() => {
            if (this.emojiContainer.childNodes.length < this.bubbleCount) {
                createBubble();
            }
        }, 50);
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
        // ใช้เฉพาะจำนวนข้อความในการคำนวณ percentage
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
        // นับเฉพาะข้อความ ไม่รวมอิโมจิ
        const totalCount = this.messages.length;
        console.log('Total count (messages only):', totalCount, '(Messages:', this.messages.length, ')');
        this.messageCount.textContent = `${totalCount}/${this.maxMessages}`;
        this.totalMessages.textContent = `Total Messages: ${totalCount}`;
    }
 }
 
 document.addEventListener('DOMContentLoaded', () => {
    new DisplayController();
 });