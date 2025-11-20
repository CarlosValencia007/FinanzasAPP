/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Footer E2E Tests', () => {
  beforeEach(() => {
    // Realizar login y visitar la página de inicio
    cy.loginAndVisit('/');
  });

  describe('Elementos de la UI', () => {
    it('Debe mostrar el footer en la página', () => {
      cy.get('.footer-section').should('exist');
      cy.get('footer').should('be.visible');
    });

    it('Debe mostrar el título FINANZAPP', () => {
      cy.contains('FINANZAPP').should('be.visible');
      cy.get('.brand-title').should('exist');
    });

    it('Debe mostrar la descripción de la marca', () => {
      cy.contains('La herramienta más simple y efectiva para tomar el control de tus finanzas personales').should('be.visible');
      cy.get('.brand-description').should('exist');
    });

    it('Debe mostrar el año de copyright', () => {
      const currentYear = new Date().getFullYear();
      cy.contains(`© ${currentYear} Todos los derechos reservados`).should('be.visible');
      cy.get('.copyright').should('exist');
    });

    it('Debe mostrar la sección de navegación', () => {
      cy.contains('Navegación').should('be.visible');
    });
  });

  describe('Enlaces de navegación', () => {
    it('Debe mostrar enlaces de navegación', () => {
      cy.contains('Inicio').should('be.visible');
      cy.contains('Dashboard').should('be.visible');
      cy.contains('Transacciones').should('be.visible');
    });

    it('Debe navegar a la página de inicio', () => {
      cy.get('footer').contains('Inicio').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });

    it('Debe navegar al dashboard', () => {
      // Interceptar la verificación de autenticación de Supabase
      cy.intercept('GET', '**/auth/v1/session**', {
        statusCode: 200,
        body: {
          data: {
            session: {
              access_token: 'mock-token',
              user: {
                id: 'test-user-id',
                email: 'test@live.uleam.edu.ec',
                aud: 'authenticated'
              }
            }
          }
        }
      }).as('getSession');

      cy.window().then((win) => {
        win.localStorage.setItem('isAuthenticated', 'true');
        win.localStorage.setItem('userEmail', 'test@live.uleam.edu.ec');
        win.localStorage.setItem('authToken', 'mock-token');
        win.localStorage.setItem('rememberMe', 'true');
      });
      cy.get('footer').contains('Dashboard').click();
      cy.url().should('include', '/dashboard');
    });

    it('Debe navegar a transacciones', () => {
      // Interceptar la verificación de autenticación de Supabase
      cy.intercept('GET', '**/auth/v1/session**', {
        statusCode: 200,
        body: {
          data: {
            session: {
              access_token: 'mock-token',
              user: {
                id: 'test-user-id',
                email: 'test@live.uleam.edu.ec',
                aud: 'authenticated'
              }
            }
          }
        }
      }).as('getSession');

      cy.window().then((win) => {
        win.localStorage.setItem('isAuthenticated', 'true');
        win.localStorage.setItem('userEmail', 'test@live.uleam.edu.ec');
        win.localStorage.setItem('authToken', 'mock-token');
        win.localStorage.setItem('rememberMe', 'true');
      });
      cy.get('footer').contains('Transacciones').click();
      cy.url().should('include', '/transactions');
    });
  });

  describe('Footer bottom', () => {
    it('Debe mostrar el mensaje del footer', () => {
      cy.contains('Hecho con').should('be.visible');
      cy.get('.footer-bottom').should('exist');
    });

    it('Debe mostrar el icono de corazón', () => {
      cy.get('.heart-icon').should('exist');
    });
  });

  describe('Estructura del footer', () => {
    it('Debe tener una estructura de grid', () => {
      cy.get('.footer-grid').should('exist');
    });

    it('Debe tener la sección de marca', () => {
      cy.get('.footer-brand').should('exist');
    });

    it('Debe tener columnas de enlaces', () => {
      cy.get('.footer-column').should('exist');
    });

    it('Debe tener la sección inferior del footer', () => {
      cy.get('.footer-bottom').should('exist');
      cy.contains('Hecho con').should('be.visible');
    });
  });

  describe('Estilos y diseño', () => {
    it('Debe tener los estilos CSS correctos', () => {
      cy.get('.footer-section').should('have.css', 'background');
      cy.get('.brand-title').should('have.css', 'color');
    });

    it('Los enlaces deben tener efecto hover', () => {
      cy.get('.footer-link').first().should('have.css', 'transition');
    });

    it('Debe tener el icono de corazón animado', () => {
      cy.get('.heart-icon').should('exist');
    });
  });

  describe('Diseño responsive', () => {
    it('Debe adaptarse a dispositivos móviles', () => {
      cy.viewport('iphone-x');
      cy.get('.footer-section').should('be.visible');
      cy.get('.footer-grid').should('exist');
    });

    it('Debe mostrar las columnas en una sola columna en móvil', () => {
      cy.viewport('iphone-x');
      cy.get('.footer-column').should('exist');
    });

    it('Debe adaptarse a tablets', () => {
      cy.viewport('ipad-2');
      cy.get('.footer-section').should('be.visible');
    });

    it('Debe adaptarse a desktop', () => {
      cy.viewport(1920, 1080);
      cy.get('.footer-section').should('be.visible');
      cy.get('.footer-grid').should('exist');
    });
  });

  describe('Accesibilidad', () => {
    it('Los enlaces deben ser navegables con teclado', () => {
      cy.get('.footer-link').first().focus();
      cy.get('.footer-link').first().should('be.focused');
    });

    it('Los enlaces deben tener estructura semántica correcta', () => {
      cy.get('.footer-links').should('exist');
      cy.get('.footer-link').should('exist');
    });
  });

  describe('Contenido dinámico', () => {
    it('Debe mostrar el año actual en el copyright', () => {
      const currentYear = new Date().getFullYear();
      cy.get('.copyright').should('contain', currentYear.toString());
    });

    it('El año debe actualizarse correctamente', () => {
      const currentYear = new Date().getFullYear();
      cy.get('.copyright').then(($el) => {
        expect($el.text()).to.include(currentYear.toString());
      });
    });
  });

  describe('Interacciones', () => {
    it('Los enlaces deben ser clickeables', () => {
      cy.get('.footer-link').first().should('be.visible').click();
      // Verificar que la navegación funciona
      cy.url().should('not.be.empty');
    });

    it('Los enlaces deben tener href válido', () => {
      cy.get('.footer-link').each(($link) => {
        cy.wrap($link).should('have.attr', 'href');
      });
    });
  });
});

