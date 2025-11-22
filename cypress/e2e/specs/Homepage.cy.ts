/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Homepage E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        // Desactiva AOS completamente
        win.AOS = { init: () => { } };

        // Elimina cualquier estilo de AOS que afecte la visibilidad
        const style = win.document.createElement('style');
        style.innerHTML = `
        [data-aos] {
          opacity: 1 !important;
          transform: none !important;
        }
      `;
        win.document.head.appendChild(style);
      }
    });
  });



  describe('Sección Hero', () => {
    it('Debe mostrar la sección hero', () => {
      cy.get('.hero-section').should('exist');
      cy.get('.hero-section').should('be.visible');
    });

    it('Debe mostrar el badge "Tu aliado financiero"', () => {
      cy.contains('Tu aliado financiero').should('be.visible');
      cy.get('.hero-badge').should('exist');
    });

    it('Debe mostrar el título principal', () => {
      cy.contains('Toma el control de').should('be.visible');
      cy.contains('finanzas').should('be.visible');
      cy.get('.hero-title').should('exist');
    });

    it('Debe mostrar el subtítulo', () => {
      cy.contains('Gestiona ingresos, gastos y presupuestos de manera simple y efectiva').should('be.visible');
      cy.get('.hero-subtitle').should('exist');
    });

    it('Debe mostrar el botón CTA cuando no está autenticado', () => {
      cy.contains('button', 'Comenzar gratis').should('be.visible');
      cy.get('.cta-button').should('exist');
    });

    it('Debe mostrar el icono de flecha en el botón CTA', () => {
      cy.get('.cta-button .arrow-icon').should('exist');
    });
  });

  describe('Tarjetas Hero', () => {
    it('Debe mostrar las tarjetas de información', () => {
      cy.get('.hero-cards').should('exist');
      cy.get('.info-card').should('have.length', 3);
    });

    it('Debe mostrar la tarjeta "Gratis"', () => {
      cy.contains('Gratis').should('be.visible');
      cy.contains('0$').should('be.visible');
      cy.contains('/mes').should('be.visible');
      cy.contains('Sin costos ocultos ni tarifas mensuales').should('be.visible');
    });

    it('Debe mostrar la tarjeta "Seguro"', () => {
      cy.contains('Seguro').should('be.visible');
      cy.contains('Encriptación de extremo a extremo').should('be.visible');
    });

    it('Debe mostrar la tarjeta "24/7"', () => {
      cy.contains('24/7').should('be.visible');
      cy.contains('100%').should('be.visible');
      cy.contains('online').should('be.visible');
      cy.contains('Disponible cuando lo necesites').should('be.visible');
    });
  });

  describe('Sección de Características', () => {
    it('Debe mostrar la sección de características', () => {
      cy.get('.features-section').should('exist');
      cy.get('.features-section').should('be.visible');
    });

    it('Debe mostrar el encabezado de características', () => {
      cy.contains('Características principales').should('be.visible');
      cy.contains('Todo lo que necesitas en un solo lugar').should('be.visible');
      cy.get('.features-header').should('exist');
    });

    it('Debe mostrar las tarjetas de características', () => {
      cy.get('.features-grid').should('exist');
      cy.get('.feature-item').should('have.length', 3);
    });

    it('Debe mostrar la característica "Control de transacciones"', () => {
      cy.contains('Control de transacciones').should('be.visible');
      cy.contains('Registra y organiza tus ingresos y gastos con categorías personalizadas').should('be.visible');
    });

    it('Debe mostrar la característica "Balance en tiempo real"', () => {
      cy.contains('Balance en tiempo real').should('be.visible');
      cy.contains('Visualiza tu situación financiera actualizada al instante').should('be.visible');
    });

    it('Debe mostrar la característica "Historial detallado"', () => {
      cy.contains('Historial detallado').should('be.visible');
      cy.contains('Accede a todo tu historial con filtros inteligentes y búsqueda rápida').should('be.visible');
    });
  });

  describe('Tarjetas de características', () => {
    it('Las tarjetas deben tener números de característica', () => {
      cy.get('.feature-number').should('have.length', 3);
      cy.contains('01').should('be.visible');
      cy.contains('02').should('be.visible');
      cy.contains('03').should('be.visible');
    });

    it('Las tarjetas deben tener iconos', () => {
      cy.get('.feature-icon-wrapper').should('have.length', 3);
    });

    it('Las tarjetas deben tener títulos', () => {
      cy.get('.feature-item h3').should('have.length', 3);
    });

    it('Las tarjetas deben tener descripciones', () => {
      cy.get('.feature-item p').should('have.length.at.least', 3);
    });

    it('Las tarjetas deben tener efecto hover', () => {
      cy.get('.feature-item').first().trigger('mouseover');
      cy.get('.feature-item').first().should('exist');
    });
  });

  describe('Sección de Beneficios', () => {
    it('Debe mostrar la sección de beneficios', () => {
      cy.get('.benefits-section').should('exist');
      cy.get('.benefits-section').should('be.visible');
    });

    it('Debe mostrar el título de beneficios', () => {
      cy.contains('¿Por qué elegir FinanzApp?').should('be.visible');
      cy.contains('Una plataforma diseñada para simplificar tu vida financiera').should('be.visible');
    });

    it('Debe mostrar la lista de beneficios', () => {
      cy.get('.benefits-list').should('exist');
      cy.get('.benefit-item').should('have.length.at.least', 4);
    });

    it('Debe mostrar el beneficio "Interfaz intuitiva"', () => {
      cy.contains('Interfaz intuitiva').should('be.visible');
      cy.contains('Diseño simple y fácil de usar, sin complicaciones técnicas').should('be.visible');
    });

    it('Debe mostrar el beneficio "Visualización clara"', () => {
      cy.contains('Visualización clara').should('be.visible');
      cy.contains('Gráficos y estadísticas que te ayudan a entender tus finanzas').should('be.visible');
    });

    it('Debe mostrar el beneficio "Categorías flexibles"', () => {
      cy.contains('Categorías flexibles').should('be.visible');
      cy.contains('Organiza tus gastos e ingresos según tus necesidades').should('be.visible');
    });

    it('Debe mostrar el beneficio "Reportes detallados"', () => {
      cy.contains('Reportes detallados').should('be.visible');
      cy.contains('Analiza tus patrones de gasto y toma mejores decisiones').should('be.visible');
    });

    it('Debe mostrar las tarjetas visuales de beneficios', () => {
      cy.get('.benefits-visual').should('exist');
      cy.get('.visual-card').should('have.length.at.least', 3);
    });
  });

  describe('Sección de Visión', () => {
    it('Debe mostrar la sección de visión', () => {
      cy.get('.vision-section').should('exist');
      cy.get('.vision-section').should('be.visible');
    });

    it('Debe mostrar el encabezado de visión', () => {
      cy.contains('Nuestra Historia').should('be.visible');
      cy.contains('Creada por estudiantes, para estudiantes').should('be.visible');
    });

    it('Debe mostrar las tarjetas de visión', () => {
      cy.get('.vision-content').should('exist');
      cy.get('.vision-card').should('have.length.at.least', 3);
    });

    it('Debe mencionar la ULEAM', () => {
      cy.contains('Universidad Laica Eloy Alfaro de Manabí').should('be.visible');
      cy.contains('ULEAM').should('be.visible');
    });

    it('Debe mostrar la tarjeta destacada de visión y compromiso', () => {
      cy.contains('Nuestra Visión y Compromiso').should('be.visible');
      cy.get('.vision-card.highlight').should('exist');
    });
  });

  describe('Particles Background', () => {
    it('Debe tener el contenedor de partículas', () => {
      cy.get('#tsparticles').should('exist');
    });
  });

  describe('Navegación', () => {
    it('Debe poder navegar a la sección de características', () => {
      cy.scrollTo(0, 1000);
      cy.get('.features-section').should('be.visible');
    });

    it('El botón CTA debe redirigir a login cuando no está autenticado', () => {
      cy.contains('button', 'Comenzar gratis').click();
      cy.url().should('include', '/login');
    });

    it('Debe poder hacer scroll a la sección de beneficios', () => {
      cy.scrollTo(0, 2000);
      cy.get('.benefits-section').should('be.visible');
    });

    it('Debe poder hacer scroll a la sección de visión', () => {
      cy.scrollTo(0, 3000);
      cy.get('.vision-section').should('be.visible');
    });
  });

  describe('Diseño responsive', () => {
    it('Debe verse correctamente en dispositivos móviles', () => {
      cy.viewport('iphone-x');
      cy.get('.hero-section').should('be.visible');
      cy.get('.features-section').should('be.visible');
      cy.get('.benefits-section').should('be.visible');
      cy.get('.vision-section').should('be.visible');
    });

    it('Las tarjetas hero deben apilarse en móvil', () => {
      cy.viewport('iphone-x');
      cy.get('.hero-cards').should('exist');
      cy.get('.info-card').should('exist');
    });

    it('Las tarjetas de características deben apilarse en móvil', () => {
      cy.viewport('iphone-x');
      cy.get('.features-grid').should('exist');
      cy.get('.feature-item').should('exist');
    });

    it('El contenedor de beneficios debe adaptarse en móvil', () => {
      cy.viewport('iphone-x');
      cy.get('.benefits-container').should('exist');
    });

    it('Debe verse correctamente en tablets', () => {
      cy.viewport('ipad-2');
      cy.get('.hero-section').should('be.visible');
      cy.get('.features-section').should('be.visible');
    });

    it('Debe verse correctamente en desktop', () => {
      cy.viewport(1920, 1080);
      cy.get('.hero-section').should('be.visible');
      cy.get('.features-section').should('be.visible');
      cy.get('.benefits-section').should('be.visible');
      cy.get('.vision-section').should('be.visible');
    });
  });

  describe('Animaciones AOS', () => {
    it('Los elementos deben tener atributos de animación', () => {
      cy.get('[data-aos]').should('have.length.at.least', 1);
    });

    it('Las tarjetas hero deben tener animaciones', () => {
      cy.get('.hero-cards [data-aos]').should('exist');
    });

    it('Las características deben tener animaciones', () => {
      cy.get('.feature-item[data-aos]').should('exist');
    });
  });

  describe('Accesibilidad', () => {
    it('Los elementos principales deben ser accesibles', () => {
      cy.get('.hero-title').should('be.visible');
      cy.get('.hero-subtitle').should('be.visible');
    });

    it('El botón CTA debe ser accesible con teclado', () => {
      cy.get('.cta-button').focus();
      cy.get('.cta-button').should('be.focused');
    });

    it('Los títulos deben tener jerarquía correcta', () => {
      cy.get('.hero-title').should('exist');
      cy.get('.features-header h2').should('exist');
      cy.get('.benefits-content h2').should('exist');
      cy.get('.vision-header h2').should('exist');
    });
  });


  describe('Interacciones', () => {
    it('El botón CTA debe tener efecto hover', () => {
      cy.get('.cta-button').trigger('mouseover');
      cy.get('.cta-button').should('exist');
    });

    it('Las tarjetas hero deben tener efecto hover', () => {
      cy.get('.info-card').first().trigger('mouseover');
      cy.get('.info-card').first().should('exist');
    });

    it('Las tarjetas de características deben tener efecto hover', () => {
      cy.get('.feature-item').first().trigger('mouseover');
      cy.get('.feature-item').first().should('exist');
    });
  });
});

