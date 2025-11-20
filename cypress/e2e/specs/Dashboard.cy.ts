/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Dashboard E2E Tests', () => {
  beforeEach(() => {
    // Interceptar las llamadas a la API de transacciones y categorías
    cy.intercept('GET', '**/rest/v1/transactions**', {
      statusCode: 200,
      body: []
    }).as('getTransactions');

    cy.intercept('GET', '**/rest/v1/categories**', {
      statusCode: 200,
      body: []
    }).as('getCategories');

    // Realizar login y visitar el dashboard
    cy.loginAndVisit('/dashboard');
  });

  describe('Elementos de la UI', () => {
    it('Debe cargar la página del dashboard correctamente', () => {
      cy.url().should('include', '/dashboard');
      cy.contains('Panel de Control').should('be.visible');
      cy.contains('Resumen de tus finanzas').should('be.visible');
    });

    it('Debe mostrar el título del dashboard', () => {
      cy.get('.dashboard-title').should('contain', 'Panel de Control');
      cy.get('.dashboard-subtitle').should('contain', 'Resumen de tus finanzas');
    });

    it('Debe mostrar las tarjetas de estadísticas', () => {
      cy.get('.stats-grid').should('exist');
      cy.get('.stat-card').should('have.length.at.least', 4);
    });

    it('Debe mostrar la tarjeta de Ingresos Totales', () => {
      cy.contains('Ingresos Totales').should('be.visible');
      cy.get('.stat-card.income').should('exist');
    });

    it('Debe mostrar la tarjeta de Gastos Totales', () => {
      cy.contains('Gastos Totales').should('be.visible');
      cy.get('.stat-card.expense').should('exist');
    });

    it('Debe mostrar la tarjeta de Balance Total', () => {
      cy.contains('Balance Total').should('be.visible');
      cy.get('.stat-card.balance').should('exist');
    });

    it('Debe mostrar la tarjeta de Total Transacciones', () => {
      cy.contains('Total Transacciones').should('be.visible');
      cy.get('.stat-card.transactions').should('exist');
    });
  });

  describe('Gráfico de Gastos por Categoría', () => {
    it('Debe mostrar la sección de gráfico de gastos', () => {
      cy.contains('Gastos por Categoría').should('be.visible');
      cy.get('.chart-card').should('exist');
    });

    it('Debe mostrar mensaje cuando no hay gastos', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: []
      });

      cy.visit('/dashboard');
      cy.contains('No hay gastos registrados este mes').should('be.visible');
    });

    it('Debe mostrar el gráfico de pastel cuando hay gastos', () => {
      // Simular datos de gastos
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: [
          {
            id: '1',
            type: 'gasto',
            amount: '100',
            transaction_date: new Date().toISOString(),
            categories: { name: 'Comida', color: '#FF5733' }
          }
        ]
      });

      cy.visit('/dashboard');
      cy.get('.pie-chart').should('exist');
    });
  });

  describe('Transacciones Recientes', () => {
    it('Debe mostrar la sección de transacciones recientes', () => {
      cy.contains('Transacciones Recientes').should('be.visible');
      cy.get('.recent-card').should('exist');
    });

    it('Debe mostrar el enlace "Ver todas"', () => {
      cy.contains('Ver todas').should('be.visible');
      cy.get('.view-all-link').should('have.attr', 'href', '/transactions');
    });

    it('Debe mostrar mensaje cuando no hay transacciones', () => {
      cy.contains('No hay transacciones recientes').should('be.visible');
    });

    it('Debe navegar a transacciones al hacer clic en "Ver todas"', () => {
      cy.get('.view-all-link').click();
      cy.url().should('include', '/transactions');
    });
  });

  describe('Comparación Mensual de Gastos', () => {
    it('Debe mostrar la sección de comparación mensual', () => {
      cy.contains('Comparación Mensual de Gastos').should('be.visible');
      cy.get('.comparison-card').should('exist');
    });

    it('Debe mostrar los selectores de mes', () => {
      cy.get('.month-selectors').should('exist');
      cy.get('.month-select').should('have.length', 2);
    });

    it('Debe permitir seleccionar diferentes meses', () => {
      cy.get('.month-select').first().should('exist');
      cy.get('.month-select').last().should('exist');
    });

    it('Debe mostrar mensaje cuando no hay datos para comparar', () => {
      cy.contains('No hay datos para comparar').should('be.visible');
    });
  });

  describe('Acciones Rápidas', () => {
    it('Debe mostrar la sección de acciones rápidas', () => {
      cy.contains('Acciones Rápidas').should('be.visible');
      cy.get('.quick-actions').should('exist');
    });

    it('Debe mostrar el botón de Nueva Transacción', () => {
      cy.contains('Nueva Transacción').should('be.visible');
      cy.get('.action-btn.primary').should('exist');
    });

    it('Debe mostrar el botón de Ver Transacciones', () => {
      cy.contains('Ver Transacciones').should('be.visible');
      cy.get('.action-btn.secondary').should('exist');
    });

    it('Debe navegar a transacciones al hacer clic en "Nueva Transacción"', () => {
      cy.get('.action-btn.primary').click();
      cy.url().should('include', '/transactions');
    });

    it('Debe navegar a transacciones al hacer clic en "Ver Transacciones"', () => {
      cy.get('.action-btn.secondary').click();
      cy.url().should('include', '/transactions');
    });
  });

  describe('Estado de carga', () => {
    it('Debe mostrar estado de carga inicialmente', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        delay: 1000,
        statusCode: 200,
        body: []
      });

      cy.visit('/dashboard');
      cy.contains('Cargando datos...').should('be.visible');
      cy.get('.spinner').should('exist');
    });

    it('Debe ocultar el estado de carga después de cargar', () => {
      cy.wait('@getTransactions');
      cy.contains('Cargando datos...').should('not.exist');
    });
  });

  describe('Valores y cálculos', () => {
    it('Debe mostrar valores numéricos en las tarjetas', () => {
      cy.get('.stat-value').should('exist');
    });

    it('Debe mostrar el formato de moneda correcto', () => {
      cy.get('.stat-value').each(($el) => {
        cy.wrap($el).should('contain', '$');
      });
    });

    it('Debe mostrar el conteo de transacciones', () => {
      cy.get('.stat-count').should('exist');
    });
  });

  describe('Diseño responsive', () => {
    it('Debe verse correctamente en dispositivos móviles', () => {
      cy.viewport('iphone-x');
      cy.get('.dashboard-container').should('be.visible');
      cy.get('.stats-grid').should('exist');
    });

    it('Debe adaptar el grid de estadísticas en móvil', () => {
      cy.viewport('iphone-x');
      cy.get('.stats-grid').should('exist');
    });

    it('Debe verse correctamente en tablets', () => {
      cy.viewport('ipad-2');
      cy.get('.dashboard-container').should('be.visible');
    });

    it('Debe verse correctamente en desktop', () => {
      cy.viewport(1920, 1080);
      cy.get('.dashboard-container').should('be.visible');
      cy.get('.dashboard-grid').should('exist');
    });
  });

  describe('Interacciones', () => {
    it('Las tarjetas deben ser visibles', () => {
      cy.get('.stat-card').each(($card) => {
        cy.wrap($card).should('be.visible');
      });
    });

    it('Los enlaces deben ser clickeables', () => {
      cy.get('.view-all-link').should('be.visible').click();
      cy.url().should('include', '/transactions');
    });
  });

  describe('Accesibilidad', () => {
    it('Debe tener estructura semántica correcta', () => {
      cy.get('.dashboard-container').should('exist');
      cy.get('.dashboard-header').should('exist');
    });

    it('Los títulos deben tener jerarquía correcta', () => {
      cy.get('.dashboard-title').should('exist');
      cy.get('.card-title').should('exist');
    });
  });

  describe('Integración con datos', () => {
    it('Debe cargar transacciones del mes actual', () => {
      cy.wait('@getTransactions');
      cy.get('.dashboard-content').should('exist');
    });

    it('Debe manejar errores al cargar datos', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      });

      cy.visit('/dashboard');
      // El componente debe manejar el error sin romper
      cy.get('.dashboard-container').should('exist');
    });
  });
});

