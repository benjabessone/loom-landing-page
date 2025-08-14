// Función de desplazamiento suave mejorada con mejor rendimiento
function smoothScroll(target, offset = 60) {
    const element = document.querySelector(target);
    if (!element) return;
    
    // Usar la API nativa si está disponible para mejor rendimiento
    if ('scrollBehavior' in document.documentElement.style) {
        const header = document.querySelector('header');
        const headerHeight = header ? header.offsetHeight : offset;
        const targetPosition = element.offsetTop - headerHeight;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        return;
    }
    
    // Fallback para navegadores más antiguos
    const header = document.querySelector('header');
    const headerHeight = header ? header.offsetHeight : offset;
    const targetPosition = element.offsetTop - headerHeight;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = Math.min(800, Math.abs(distance) * 0.5); // Duración adaptativa
    let start = null;

    function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const progress = Math.min(timeElapsed / duration, 1);
        
        const ease = easeInOutQuad(progress);
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    requestAnimationFrame(animation);
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar animaciones de scroll
    initScrollAnimations();
    
    // Mobile menu toggle optimizado
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        // Función para cerrar el menú
        const closeMobileMenu = () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        };
        
        // Toggle del menú
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isExpanded = navLinks.classList.contains('active');
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Cerrar menú al hacer clic fuera (con throttling)
        let clickTimeout;
        document.addEventListener('click', function(e) {
            if (clickTimeout) return;
            clickTimeout = setTimeout(() => {
                if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    closeMobileMenu();
                }
                clickTimeout = null;
            }, 10);
        });
        
        // Cerrar menú al hacer clic en un enlace (delegación de eventos)
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                closeMobileMenu();
            }
        });
        
        // Cerrar con tecla Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    // Asignar eventos a todos los enlaces de scroll suave
    document.querySelectorAll('.smooth-scroll').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            
            if (href.includes('#')) {
                const [page, anchor] = href.split('#');
                
                if (page && page !== window.location.pathname) {
                    // Si estamos en otra página, navegar a la página principal con el ancla
                    window.location.href = href;
                } else {
                    // Si estamos en la misma página, hacer scroll suave
                    smoothScroll('#' + anchor);
                }
            } else {
                // Enlaces normales
                window.location.href = href;
            }
        });
    });
    
    // Actualizar enlaces activos en la navegación
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                // Anclas locales - hacer scroll suave
                e.preventDefault();
                smoothScroll(href);
            } else if (href.includes('#')) {
                const [page, anchor] = href.split('#');
                if (page && page !== window.location.pathname) {
                    // Si estamos en otra página, navegar a la página principal con el ancla
                    window.location.href = href;
                }
            } else if (href.startsWith('/')) {
                // Enlaces que apuntan a otras páginas
                window.location.href = href;
            } else {
                // Anclas locales en la página actual
                smoothScroll(href);
            }
        });
    });
    
    // Intersection Observer optimizado para animaciones
    const observerOptions = {
        threshold: [0, 0.1, 0.5],
        rootMargin: '0px 0px -50px 0px'
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
                entry.target.classList.add('animate');
                // Dejar de observar una vez animado para mejorar rendimiento
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observar elementos para animación con requestIdleCallback si está disponible
    const observeElements = () => {
        const elementsToObserve = document.querySelectorAll('.feature-card, .step');
        elementsToObserve.forEach(el => {
            if (!el.classList.contains('animate')) {
                el.style.opacity = 0;
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                animationObserver.observe(el);
            }
        });
    };

    if (window.requestIdleCallback) {
        requestIdleCallback(observeElements);
    } else {
        setTimeout(observeElements, 100);
    }
    
    // Hover effects para métodos de contacto
    document.querySelectorAll('.contact-method').forEach(method => {
        method.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        method.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Modal de demostración
    const demoModal = document.getElementById('demoModal');
    const openDemoBtn = document.getElementById('openDemo');
    const closeDemoBtn = document.querySelector('.close-modal');
    
    if (openDemoBtn && demoModal) {
        openDemoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            demoModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevenir scroll del body
        });
    }
    
    if (closeDemoBtn && demoModal) {
        closeDemoBtn.addEventListener('click', function() {
            demoModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restaurar scroll
        });
    }
    
    // Cerrar modal al hacer clic fuera del contenido
    if (demoModal) {
        demoModal.addEventListener('click', function(e) {
            if (e.target === demoModal) {
                demoModal.style.display = 'none';
                document.body.style.overflow = 'auto'; // Restaurar scroll
            }
        });
    }
    
    // Manejar envío del formulario
    const demoForm = document.getElementById('demoForm');
    if (demoForm) {
        demoForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Recopilar datos del formulario
            const formData = new FormData(this);
            const data = {
                nombre: formData.get('nombre'),
                apellido: formData.get('apellido'),
                email: formData.get('email'),
                telefono: formData.get('telefono'),
                consulta: formData.get('consulta')
            };
            
            try {
                // Mostrar indicador de carga
                const submitBtn = e.target.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
                
                // Enviar datos al webhook
                const response = await fetch('http://localhost:5678/webhook/93ebd146-98bf-4a6a-918c-9a56215cde8a', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                
                if (response.ok) {
                    // Cambiar botón a "Enviado"
                    submitBtn.textContent = 'Enviado';
                    submitBtn.style.backgroundColor = '#28a745';
                    
                    // Mostrar notificación de éxito
                    showNotification(
                        '¡Gracias por tu consulta!', 
                        'Hemos recibido tu información y te hemos enviado un correo de confirmación. Nos pondremos en contacto contigo pronto.',
                        'success'
                    );
                } else {
                    throw new Error('Error en el servidor');
                }
                
            } catch (error) {
                console.error('Error:', error);
                
                // Mostrar notificación de error
                showNotification(
                    'Error al enviar', 
                    'Hubo un problema al enviar tu consulta. Por favor, intenta nuevamente o contáctanos directamente por WhatsApp.',
                    'error'
                );
                
                // Restaurar botón
                const submitBtn = e.target.querySelector('button[type="submit"]');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
            
            // Cerrar modal después de 2 segundos
            setTimeout(() => {
                if (demoModal) {
                    demoModal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            }, 2000);
        });
    }
    
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && demoModal && demoModal.style.display === 'block') {
            demoModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restaurar scroll
        }
    });
    
    // Chat widget removido
});

// Header scroll effect - removido para mantener el header consistente
// El header mantiene su apariencia fija sin cambios de color o tamaño

// ChatWidget removido - ya no se necesita más

// Función para mostrar notificaciones personalizadas
function showNotification(title, message, type = 'success') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-exclamation-circle"></i>'}
            </div>
            <div class="notification-text">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Estilos para la notificación
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, 
            ${type === 'success' ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)'}, 
            ${type === 'success' ? 'rgba(22, 163, 74, 0.95)' : 'rgba(220, 38, 38, 0.95)'}
        );
        color: white;
        border-radius: 16px;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4), 
                    0 0 0 1px rgba(255, 255, 255, 0.1);
        z-index: 10000;
        max-width: 500px;
        width: 90vw;
        animation: notificationSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        backdrop-filter: blur(10px);
    `;
    
    // Estilos para el contenido
    const style = document.createElement('style');
    style.textContent = `
        @keyframes notificationSlideIn {
            from {
                opacity: 0;
                transform: translate(-50%, -60%);
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
        }
        
        .notification-content {
             display: flex;
             align-items: flex-start;
             padding: 25px;
             gap: 18px;
         }
         
         .notification-icon {
             font-size: 28px;
             color: ${type === 'success' ? '#4ade80' : '#f87171'};
             margin-top: 2px;
             filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
         }
         
         .notification-text {
             flex: 1;
         }
         
         .notification-text h4 {
             margin: 0 0 10px 0;
             font-size: 20px;
             font-weight: 700;
             color: white;
             text-shadow: 0 1px 2px rgba(0,0,0,0.1);
         }
         
         .notification-text p {
             margin: 0;
             font-size: 15px;
             line-height: 1.6;
             color: rgba(255, 255, 255, 0.9);
             text-shadow: 0 1px 2px rgba(0,0,0,0.1);
         }
         
         .notification-close {
             background: rgba(255, 255, 255, 0.1);
             border: none;
             font-size: 16px;
             color: rgba(255, 255, 255, 0.8);
             cursor: pointer;
             padding: 0;
             width: 28px;
             height: 28px;
             display: flex;
             align-items: center;
             justify-content: center;
             border-radius: 50%;
             transition: all 0.3s ease;
             backdrop-filter: blur(10px);
         }
         
         .notification-close:hover {
             background: rgba(255, 255, 255, 0.2);
             color: white;
             transform: scale(1.1);
         }
    `;
    
    // Agregar estilos al head si no existen
    if (!document.querySelector('#notification-styles')) {
        style.id = 'notification-styles';
        document.head.appendChild(style);
    }
    
    // Agregar al body
    document.body.appendChild(notification);
    
    // No auto-remover, solo permitir cierre manual
}

// Función para inicializar animaciones de scroll
function initScrollAnimations() {
    // Crear observer para animaciones de entrada
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                entry.target.classList.remove('initial-hidden');
            }
        });
    }, observerOptions);
    
    // Aplicar animaciones iniciales a elementos específicos
    const animatedElements = [
        { selector: '.hero h1', animation: 'fade-in-up', delay: 'delay-1' },
        { selector: '.hero p', animation: 'fade-in-up', delay: 'delay-2' },
        { selector: '.cta-button', animation: 'bounce-in', delay: 'delay-3' },
        { selector: '.service-card', animation: 'fade-in-up', delay: '' },
        { selector: '.feature-item', animation: 'fade-in-left', delay: '' },
        { selector: '.process-step', animation: 'fade-in-right', delay: '' },
        { selector: '.testimonial', animation: 'fade-in-up', delay: '' },
        { selector: '.footer-logo', animation: 'float-animation', delay: '' }
    ];
    
    animatedElements.forEach((item, index) => {
        const elements = document.querySelectorAll(item.selector);
        elements.forEach((element, elementIndex) => {
            // Agregar clase inicial oculta
            element.classList.add('initial-hidden');
            
            // Agregar animación
            element.classList.add(item.animation);
            
            // Agregar delay si se especifica
            if (item.delay) {
                element.classList.add(item.delay);
            } else if (elements.length > 1) {
                // Agregar delay progresivo para múltiples elementos
                const delayClass = `delay-${Math.min(elementIndex + 1, 5)}`;
                element.classList.add(delayClass);
            }
            
            // Observar el elemento
            observer.observe(element);
        });
    });
    
    // Animaciones especiales para elementos específicos
    const logo = document.querySelector('.header-logo');
    if (logo) {
        logo.classList.add('pulse-animation');
    }
    
    // Animación de hover mejorada para botones
    const buttons = document.querySelectorAll('.btn, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animación de parallax suave para el hero
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
}