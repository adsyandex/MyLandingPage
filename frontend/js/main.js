// Main JavaScript File

// DOM Elements
const elements = {
    partnerLogos: document.getElementById('partnerLogos'),
    servicesGrid: document.getElementById('servicesGrid'),
    chatDemo: document.getElementById('chatDemo'),
    contactInfo: document.getElementById('contactInfo'),
    contactForm: document.getElementById('contactForm'),
    modal: document.getElementById('notificationModal'),
    modalBody: document.getElementById('modalBody'),
    closeModal: document.getElementById('closeModal')
};

// Data
const partners = ['Telegram', 'AmoCRM', 'TimeWeb.Cloud', 'Roistat', 'PostgreSQL', 'MySQL'];

const services = [
    {
        icon: '🤖',
        title: 'Разработка Telegram-ботов',
        description: 'Создание ботов любой сложности: от бронирования до интеграции с CRM',
        tags: ['Aiogram', 'Python', 'API']
    },
    {
        icon: '🔄',
        title: 'Интеграция с AmoCRM',
        description: 'Настройка воронок, обмен данными, автоматизация продаж',
        tags: ['AmoCRM API', 'Webhooks']
    },
    {
        icon: '🌐',
        title: 'Создание Landing Page',
        description: 'Продающие сайты под ключ с высокой конверсией',
        tags: ['HTML/CSS', 'JavaScript', 'Adaptive']
    },
    {
        icon: '🗄️',
        title: 'Администрирование БД',
        description: 'PostgreSQL, MySQL — оптимизация, поддержка, миграция данных',
        tags: ['PostgreSQL', 'MySQL', 'SQLite']
    },
    {
        icon: '⚡',
        title: 'Готовые решения',
        description: 'Бронирование для салонов, ресторанов, медицинских центров',
        tags: ['Booking', 'Calendar']
    },
    {
        icon: '☁️',
        title: 'Настройка VDS',
        description: 'Размещение проектов на TimeWeb.Cloud и других хостингах',
        tags: ['Linux', 'Nginx', 'Docker']
    }
];

const contactData = {
    name: 'Виталий',
    email: 'amadeus.cyber@gmail.com',
    phone: '+7 (914) 714-79-29',
    telegram: '@haimakrav',
    hours: 'Пн-Пт: 8:00-17:00'
};

// Render Functions
function renderPartners() {
    if (!elements.partnerLogos) return;
    
    elements.partnerLogos.innerHTML = partners
        .map(partner => `<span class="partner-logo">${partner}</span>`)
        .join('');
}

function renderServices() {
    if (!elements.servicesGrid) return;
    
    elements.servicesGrid.innerHTML = services
        .map(service => `
            <div class="service-card">
                <div class="service-icon">${service.icon}</div>
                <h3>${service.title}</h3>
                <p>${service.description}</p>
                <div class="tech-tags">
                    ${service.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `)
        .join('');
}

function renderChatDemo() {
    if (!elements.chatDemo) return;
    
    elements.chatDemo.innerHTML = `
        <div class="message-header">
            <div class="bot-avatar">A</div>
            <div class="bot-name">Amadeus Bot</div>
        </div>
        <div class="message-content">
            <p>👋 Привет, Виталий!</p>
            <p>Я — Amadeus Bot, ваш помощник в разработке IT-решений для бизнеса.</p>
            <p><strong>Что я предлагаю:</strong></p>
            <ul>
                <li>Разработку Telegram-ботов</li>
                <li>Подключение к VDS</li>
                <li>Создание Landing-страниц</li>
                <li>Интеграцию с AmoCRM</li>
                <li>Готовые решения для бронирования</li>
            </ul>
        </div>
        <div class="message-buttons">
            <button class="chat-button" onclick="alert('Демо-режим: Бронирование')">📅 Бронирование</button>
            <button class="chat-button" onclick="alert('Демо-режим: Образец договора')">📄 Образец договора</button>
            <button class="chat-button" onclick="smoothScroll('#contact')">📞 Связаться с менеджером</button>
            <button class="chat-button" onclick="alert('Демо-режим: Прайс-лист')">💰 Прайс-лист</button>
        </div>
    `;
}

function renderContactInfo() {
    if (!elements.contactInfo) return;
    
    elements.contactInfo.innerHTML = `
        <h3>${contactData.name}</h3>
        <p><i class="fas fa-envelope contact-icon"></i> ${contactData.email}</p>
        <p><i class="fas fa-phone contact-icon"></i> ${contactData.phone}</p>
        <p><i class="fab fa-telegram contact-icon"></i> <a href="https://t.me/haimakrav" target="_blank">@haimakrav</a></p>
        <p><i class="fas fa-clock contact-icon"></i> ${contactData.hours}</p>
    `;
}

// Utility Functions
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

function showModal(message, isSuccess = true) {
    if (!elements.modal || !elements.modalBody) return;
    
    elements.modalBody.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 3rem; margin-bottom: 20px;">${isSuccess ? '✅' : '❌'}</div>
            <h3 style="margin-bottom: 15px;">${isSuccess ? 'Спасибо!' : 'Ошибка'}</h3>
            <p>${message}</p>
        </div>
    `;
    elements.modal.classList.add('active');
}

function hideModal() {
    if (!elements.modal) return;
    elements.modal.classList.remove('active');
}

// Form Handling
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name')?.value,
        email: document.getElementById('email')?.value,
        phone: document.getElementById('phone')?.value,
        message: document.getElementById('message')?.value
    };
    
    // Validate
    if (!formData.name || !formData.email || !formData.phone) {
        showModal('Пожалуйста, заполните все обязательные поля', false);
        return;
    }
    
    try {
        // Try to send to backend if available
        const response = await fetch(`${window.location.origin}/api/requests`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        }).catch(() => null); // Silently fail if backend not available
        
        if (response && response.ok) {
            showModal('Ваша заявка принята! Мы свяжемся с вами в ближайшее время.');
        } else {
            // Fallback to local storage
            saveToLocalStorage(formData);
            showModal('Ваша заявка принята! (Сохранено локально)');
        }
        
        e.target.reset();
        
        // Send to analytics
        if (typeof window.roistat !== 'undefined') {
            window.roistat.lead.add();
        }
        
    } catch (error) {
        // Fallback to local storage
        saveToLocalStorage(formData);
        showModal('Ваша заявка принята! (Сохранено локально)');
    }
}

function saveToLocalStorage(data) {
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    requests.push({
        ...data,
        date: new Date().toISOString(),
        status: 'Новая'
    });
    localStorage.setItem('requests', JSON.stringify(requests));
}

// Smooth Scroll for all anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// Initialize
function init() {
    renderPartners();
    renderServices();
    renderChatDemo();
    renderContactInfo();
    initSmoothScroll();
    
    // Пока закоментировал, чтобы потом вставить код формы с AmoCRM(после этого закоментированного)
    // if (elements.contactForm) {
    //     elements.contactForm.addEventListener('submit', handleFormSubmit);
    // }
    
    // if (elements.closeModal) {
    //     elements.closeModal.addEventListener('click', hideModal);
    // }
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target === elements.modal) {
            hideModal();
        }
    });
    
    // Log initialization
    console.log('Amadeus Bot Site initialized');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}