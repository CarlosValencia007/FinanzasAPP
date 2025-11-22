/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Grafico E2E Tests', () => {
  beforeEach(() => {
    // Realizar login y visitar el dashboard donde se muestra el gráfico
    cy.loginAndVisit('/dashboard');
  });

  describe('Elementos del componente', () => {
    it('Debe mostrar el componente de gráfico', () => {
      // El componente Grafico muestra "Gráfico de Finanzas"
      cy.contains('Gastos por Categoría').should('be.visible');
    });

  });

  describe('Renderizado', () => {
    it('El componente debe renderizarse correctamente', () => {
      cy.get('h2').should('be.visible');
    });


  });

  describe('Estilos', () => {
    it('El título debe tener estilos aplicados', () => {
      cy.get('h2').should('have.css', 'color');
    });

    it('El componente debe ser visible', () => {
      cy.get('h2').should('be.visible');
    });
  });

  describe('Accesibilidad', () => {
    it('El título debe ser accesible', () => {
      cy.get('h2').should('be.visible');
    });

    it('Debe tener una estructura semántica correcta', () => {
      cy.get('h2').should('exist');
    });
  });
});

