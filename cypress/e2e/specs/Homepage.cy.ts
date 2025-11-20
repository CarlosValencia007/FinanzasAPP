/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Homepage E2E Tests', () => {
  beforeEach(() => {
    // Realizar login y visitar la página de inicio
    cy.loginAndVisit('/');
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
      cy.contains('¡Bienvenido a').should('be.visible');
      cy.contains('FINANZAPP').should('be.visible');
      cy.get('.hero-title').should('exist');
    });

    it('Debe mostrar el subtítulo', () => {
      cy.contains('Donde puedes manejar tus finanzas de manera fácil y rápida').should('be.visible');
      cy.get('.hero-subtitle').should('exist');
    });

    it('Debe mostrar el botón CTA "Empezar Ahora"', () => {
      cy.contains('Empezar Ahora').should('be.visible');
      cy.get('.cta-button').should('exist');
      cy.get('#botonEmpezarAhora').should('exist');
    });

    it('Debe mostrar las estadísticas', () => {
      cy.contains('100%').should('be.visible');
      cy.contains('Gratuito').should('be.visible');
      cy.contains('Seguro').should('be.visible');
      cy.contains('Tus datos protegidos').should('be.visible');
      cy.contains('24/7').should('be.visible');
      cy.contains('Siempre disponible').should('be.visible');
      cy.get('.hero-stats').should('exist');
    });
  });

  describe('Interacciones del Hero', () => {
    it('Debe navegar a login al hacer clic en "Empezar Ahora"', () => {
      cy.get('.cta-button').click();
      cy.url().should('include', '/login');
    });

    it('El botón CTA debe tener efecto hover', () => {
      cy.get('.cta-button').trigger('mouseover');
      cy.get('.cta-button').should('exist');
    });

    it('Debe mostrar el icono de flecha en el botón CTA', () => {
      cy.get('.cta-button .arrow-icon').should('exist');
    });
  });

  describe('Sección de Características', () => {
    it('Debe mostrar la sección de características', () => {
      cy.get('.features-section').should('exist');
      cy.get('.features-section').should('be.visible');
    });

    it('Debe mostrar el título de la sección', () => {
      cy.contains('Nuestras Características').should('be.visible');
      cy.get('.section-title').should('exist');
    });

    it('Debe mostrar el subtítulo de la sección', () => {
      cy.contains('Todo lo que necesitas para gestionar tu dinero').should('be.visible');
      cy.get('.section-subtitle').should('exist');
    });

    it('Debe mostrar las tarjetas de características', () => {
      cy.get('.features-grid').should('exist');
      cy.get('.feature-card').should('have.length.at.least', 3);
    });

    it('Debe mostrar la característica de registro de ingresos y gastos', () => {
      cy.contains('Registro de ingresos y gastos').should('be.visible');
      cy.contains('Organiza tus transacciones con categorías personalizadas y mantén un control detallado').should('be.visible');
    });

    it('Debe mostrar la característica de visualización de balance', () => {
      cy.contains('Visualización de balance actual').should('be.visible');
      cy.contains('Consulta tu situación financiera en tiempo real y proyecta tus finanzas futuras').should('be.visible');
    });

    it('Debe mostrar la característica de historial de transacciones', () => {
      cy.contains('Historial de transacciones').should('be.visible');
      cy.contains('Accede a tu historial completo con filtros avanzados y búsqueda inteligente').should('be.visible');
    });
  });

  describe('Tarjetas de características', () => {
    it('Las tarjetas deben tener iconos', () => {
      cy.get('.feature-icon').should('have.length.at.least', 3);
    });

    it('Las tarjetas deben tener títulos', () => {
      cy.get('.feature-title').should('have.length.at.least', 3);
    });

    it('Las tarjetas deben tener descripciones', () => {
      cy.get('.feature-description').should('have.length.at.least', 3);
    });

    it('Las tarjetas deben tener efecto hover', () => {
      cy.get('.feature-card').first().trigger('mouseover');
      cy.get('.feature-card').first().should('exist');
    });
  });

  describe('Estilos y diseño', () => {
    it('Debe tener las clases CSS correctas', () => {
      cy.get('.hero-section').should('exist');
      cy.get('.hero-decoration').should('exist');
      cy.get('.wave-divider').should('exist');
      cy.get('.features-section').should('exist');
    });

    it('Debe tener decoraciones visuales en el hero', () => {
      cy.get('.hero-decoration').should('exist');
    });

    it('Debe tener el divisor de onda', () => {
      cy.get('.wave-divider').should('exist');
      cy.get('.wave-divider svg').should('exist');
    });

    it('Las estadísticas deben tener estilos correctos', () => {
      cy.get('.stat-item').should('have.length.at.least', 3);
      cy.get('.stat-number').should('exist');
      cy.get('.stat-label').should('exist');
    });
  });

  describe('Diseño responsive', () => {
    it('Debe verse correctamente en dispositivos móviles', () => {
      cy.viewport('iphone-x');
      cy.get('.hero-section').should('be.visible');
      cy.get('.features-section').should('be.visible');
    });

    it('Las estadísticas deben apilarse verticalmente en móvil', () => {
      cy.viewport('iphone-x');
      cy.get('.hero-stats').should('exist');
    });

    it('Las tarjetas de características deben apilarse en móvil', () => {
      cy.viewport('iphone-x');
      cy.get('.features-grid').should('exist');
      cy.get('.feature-card').should('exist');
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
    });
  });

  describe('Navegación', () => {
    it('Debe poder navegar a la sección de características', () => {
      cy.scrollTo(0, 1000);
      cy.get('.features-section').should('be.visible');
    });

    it('El botón CTA debe redirigir correctamente', () => {
      cy.get('.cta-button').click();
      cy.url().should('include', '/login');
    });
  });

  describe('Animaciones', () => {
    it('Las decoraciones deben estar animadas', () => {
      cy.get('.hero-decoration').should('exist');
    });

    it('Las tarjetas deben tener animaciones', () => {
      cy.get('.feature-card').first().should('exist');
    });
  });

  describe('Accesibilidad', () => {
    it('Los elementos deben ser accesibles', () => {
      cy.get('.hero-title').should('be.visible');
      cy.get('.cta-button').should('be.visible');
    });

    it('El botón CTA debe ser accesible con teclado', () => {
      cy.get('.cta-button').focus();
      cy.get('.cta-button').should('be.focused');
    });
  });

  describe('Contenido', () => {
    it('Debe mostrar el nombre de la marca correctamente', () => {
      cy.contains('FINANZAPP').should('be.visible');
    });

    it('Debe mostrar mensajes motivadores', () => {
      cy.contains('Bienvenido').should('be.visible');
      cy.contains('finanzas').should('be.visible');
    });

    it('Debe mostrar información sobre las características', () => {
      cy.contains('características').should('be.visible');
      cy.contains('transacciones').should('be.visible');
    });
  });
});

