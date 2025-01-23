class MessageForm {
    constructor() {
        this.form = document.getElementById('messageForm');
        this.input = document.getElementById('messageInput');
        this.submitBtn = document.querySelector('.submit-btn');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.input.addEventListener('input', this.validateInput.bind(this));
    }

    validateInput() {
        const value = this.input.value.trim();
        this.submitBtn.disabled = value.length === 0;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const message = this.input.value.trim();
        if (!message) return;

        this.submitBtn.disabled = true;
        
        try {
            const response = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });

            if (response.ok) {
                this.input.value = '';
                alert('ส่งข้อความสำเร็จ!');
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        } finally {
            this.submitBtn.disabled = false;
        }
    }
}

new MessageForm();