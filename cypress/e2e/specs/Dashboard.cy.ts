/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Dashboard E2E Tests', () => {
  beforeEach(() => {
    // Interceptar todas las llamadas que hace el Dashboard al montarse
    const ahora = new Date();
    const mesActual = ahora.getMonth() + 1;
    const anioActual = ahora.getFullYear();
    const primerDia = new Date(anioActual, mesActual - 1, 1).toISOString().split('T')[0];
    const ultimoDia = new Date(anioActual, mesActual, 0).toISOString().split('T')[0];
    
    const mesAnterior = new Date(anioActual, ahora.getMonth() - 1, 1);
    const mesAnteriorStr = `${mesAnterior.getFullYear()}-${String(mesAnterior.getMonth() + 1).padStart(2, '0')}`;
    const mesActualStr = `${anioActual}-${String(mesActual).padStart(2, '0')}`;

    // Interceptar transacciones del mes actual
    cy.intercept('GET', `**/rest/v1/transactions**?*transaction_date=gte.${primerDia}*transaction_date=lte.${ultimoDia}*`, {
      statusCode: 200,
      body: []
    }).as('getTransactionsCurrentMonth');

    // Interceptar todas las llamadas a transacciones (fallback)
    cy.intercept('GET', '**/rest/v1/transactions**', {
      statusCode: 200,
      body: []
    }).as('getTransactions');

    // Interceptar categorías
    cy.intercept('GET', '**/rest/v1/categories**', {
      statusCode: 200,
      body: []
    }).as('getCategories');

    // Interceptar RPC para gastos mensuales
    cy.intercept('POST', '**/rest/v1/rpc/get_monthly_expenses_by_category**', {
      statusCode: 200,
      body: []
    }).as('getMonthlyExpenses');

    // Interceptar comparación de meses (dos llamadas para mes1 y mes2)
    cy.intercept('GET', `**/rest/v1/transactions**?*type=eq.gasto*`, {
      statusCode: 200,
      body: []
    }).as('getComparisonTransactions');

    // Realizar login y visitar el dashboard
    cy.loginAndVisit('/dashboard');
  });

  describe('Estructura y elementos básicos', () => {
    it('Debe cargar la página del dashboard correctamente', () => {
      cy.url().should('include', '/dashboard');
      cy.get('.dashboard-container').should('exist');
      cy.contains('Panel de Control').should('be.visible');
      cy.contains('Resumen de tus finanzas').should('be.visible');
    });

    it('Debe mostrar el encabezado del dashboard', () => {
      cy.get('.dashboard-header').should('exist');
      cy.get('.dashboard-title').should('contain', 'Panel de Control');
      cy.get('.dashboard-subtitle').should('contain', 'Resumen de tus finanzas');
    });
  });

  describe('Estado de carga', () => {
    it('Debe mostrar estado de carga inicialmente', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        delay: 1000,
        statusCode: 200,
        body: []
      }).as('getTransactionsDelayed');

      cy.visit('/dashboard');
      cy.contains('Cargando datos...').should('be.visible');
      cy.get('.spinner').should('exist');
      cy.wait('@getTransactionsDelayed');
    });

    it('Debe ocultar el estado de carga después de cargar', () => {
      cy.wait('@getTransactions');
      cy.contains('Cargando datos...').should('not.exist');
      cy.get('.dashboard-content').should('exist');
    });
  });

  describe('Tarjetas de estadísticas', () => {
    it('Debe mostrar las 4 tarjetas de estadísticas', () => {
      cy.wait('@getTransactions');
      cy.get('.stats-grid').should('exist');
      cy.get('.stat-card').should('have.length', 4);
    });

    it('Debe mostrar la tarjeta de Ingresos Totales', () => {
      cy.wait('@getTransactions');
      cy.contains('Ingresos Totales').should('be.visible');
      cy.get('.stat-card.income').should('exist');
      cy.get('.stat-card.income .stat-icon').should('exist');
      cy.get('.stat-card.income .stat-value').should('exist');
      cy.get('.stat-card.income .stat-count').should('exist');
    });

    it('Debe mostrar la tarjeta de Gastos Totales', () => {
      cy.wait('@getTransactions');
      cy.contains('Gastos Totales').should('be.visible');
      cy.get('.stat-card.expense').should('exist');
      cy.get('.stat-card.expense .stat-icon').should('exist');
    });

    it('Debe mostrar la tarjeta de Balance Total', () => {
      cy.wait('@getTransactions');
      cy.contains('Balance Total').should('be.visible');
      cy.get('.stat-card.balance').should('exist');
      cy.get('.stat-card.balance .stat-icon').should('exist');
    });

    it('Debe mostrar la tarjeta de Total Transacciones', () => {
      cy.wait('@getTransactions');
      cy.contains('Total Transacciones').should('be.visible');
      cy.get('.stat-card.transactions').should('exist');
      cy.get('.stat-card.transactions .stat-icon').should('exist');
    });

    it('Debe mostrar valores correctos cuando no hay transacciones', () => {
      cy.wait('@getTransactions');
      cy.get('.stat-card.income .stat-value').should('contain', '$0.00');
      cy.get('.stat-card.expense .stat-value').should('contain', '$0.00');
      cy.get('.stat-card.balance .stat-value').should('contain', '$0.00');
      cy.get('.stat-card.transactions .stat-value').should('contain', '0');
    });

    it('Debe mostrar valores correctos cuando hay transacciones', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: [
          {
            id: '1',
            user_id: 'user-123',
            category_id: 'cat-1',
            type: 'ingreso',
            amount: 1000,
            description: 'Salario',
            transaction_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categories: {
              id: 'cat-1',
              name: 'Salario',
              type: 'ingreso',
              color: '#4A90E2',
              icon: 'material-symbols:work'
            }
          },
          {
            id: '2',
            user_id: 'user-123',
            category_id: 'cat-2',
            type: 'gasto',
            amount: 200,
            description: 'Comida',
            transaction_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categories: {
              id: 'cat-2',
              name: 'Comida',
              type: 'gasto',
              color: '#e74c3c',
              icon: 'material-symbols:restaurant'
            }
          }
        ]
      }).as('getTransactionsWithData');

      cy.visit('/dashboard');
      cy.wait('@getTransactionsWithData');
      
      cy.get('.stat-card.income .stat-value').should('contain', '$1000.00');
      cy.get('.stat-card.expense .stat-value').should('contain', '$200.00');
      cy.get('.stat-card.balance .stat-value').should('contain', '$800.00');
      cy.get('.stat-card.transactions .stat-value').should('contain', '2');
    });

    it('Debe mostrar balance negativo cuando los gastos superan los ingresos', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: [
          {
            id: '1',
            type: 'ingreso',
            amount: 500,
            categories: { name: 'Salario' }
          },
          {
            id: '2',
            type: 'gasto',
            amount: 800,
            categories: { name: 'Comida' }
          }
        ]
      }).as('getTransactionsNegative');

      cy.visit('/dashboard');
      cy.wait('@getTransactionsNegative');
      cy.get('.stat-card.balance.negative').should('exist');
      cy.get('.stat-card.balance .stat-count').should('contain', 'Negativo');
    });
  });

  describe('Sección de Acciones Rápidas', () => {
    it('Debe mostrar la sección de acciones rápidas', () => {
      cy.wait('@getTransactions');
      cy.contains('Acciones Rápidas').should('be.visible');
      cy.get('.quick-actions').should('exist');
      cy.get('.actions-title').should('exist');
      cy.get('.actions-grid').should('exist');
    });

    it('Debe mostrar el botón de Nueva Transacción', () => {
      cy.wait('@getTransactions');
      cy.contains('button', 'Nueva Transacción').should('be.visible');
      cy.get('.action-btn.primary').should('exist');
    });

    it('Debe mostrar el botón de Ver Transacciones', () => {
      cy.wait('@getTransactions');
      cy.contains('Ver Transacciones').should('be.visible');
      cy.get('.action-btn.secondary').should('exist');
    });

    it('Debe navegar a transacciones al hacer clic en "Ver Transacciones"', () => {
      cy.wait('@getTransactions');
      cy.get('.action-btn.secondary').click();
      cy.url().should('include', '/transactions');
    });
  });

  describe('Modal de Nueva Transacción', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/rest/v1/categories**', {
        statusCode: 200,
        body: [
          {
            id: 'cat-1',
            user_id: 'user-123',
            name: 'Salario',
            type: 'ingreso',
            color: '#4A90E2',
            icon: 'material-symbols:work',
            is_system: false
          }
        ]
      }).as('getCategories');
    });

    it('Debe abrir el modal al hacer clic en Nueva Transacción', () => {
      cy.wait('@getTransactions');
      cy.get('.action-btn.primary').click();
      cy.get('.modal-overlay').should('be.visible');
      cy.get('.modal-content-form').should('be.visible');
      cy.contains('Nueva Transacción').should('be.visible');
    });

    it('Debe cerrar el modal al hacer clic en el botón de cerrar', () => {
      cy.wait('@getTransactions');
      cy.get('.action-btn.primary').click();
      cy.get('.modal-close-btn').click();
      cy.get('.modal-overlay').should('not.exist');
    });

    it('Debe cerrar el modal al hacer clic fuera de él', () => {
      cy.wait('@getTransactions');
      cy.get('.action-btn.primary').click();
      cy.get('.modal-overlay').click('topLeft');
      cy.get('.modal-overlay').should('not.exist');
    });
  });

  describe('Gráfico de Gastos/Ingresos por Categoría', () => {
    it('Debe mostrar la sección del gráfico', () => {
      cy.wait('@getTransactions');
      cy.get('.chart-card').should('exist');
      cy.get('.dashboard-card.chart-card').should('exist');
    });

    it('Debe mostrar el título del gráfico', () => {
      cy.wait('@getTransactions');
      cy.contains('Gastos por Categoría').should('be.visible');
    });

    it('Debe mostrar el toggle para cambiar entre gastos e ingresos', () => {
      cy.wait('@getTransactions');
      cy.get('.chart-toggle').should('exist');
      cy.get('.toggle-btn').should('have.length', 2);
      cy.get('.toggle-gastos').should('exist');
      cy.get('.toggle-ingresos').should('exist');
    });

    it('Debe tener el botón de gastos activo por defecto', () => {
      cy.wait('@getTransactions');
      cy.get('.toggle-gastos').should('have.class', 'active');
      cy.get('.toggle-ingresos').should('not.have.class', 'active');
    });

    it('Debe cambiar a ingresos al hacer clic en el toggle', () => {
      cy.wait('@getTransactions');
      cy.get('.toggle-ingresos').click();
      cy.get('.toggle-ingresos').should('have.class', 'active');
      cy.get('.toggle-gastos').should('not.have.class', 'active');
      cy.contains('Ingresos por Categoría').should('be.visible');
    });

    it('Debe mostrar mensaje cuando no hay gastos', () => {
      cy.wait('@getTransactions');
      cy.contains('No hay gastos registrados este mes').should('be.visible');
      cy.get('.empty-chart').should('exist');
    });

    it('Debe mostrar mensaje cuando no hay ingresos', () => {
      cy.wait('@getTransactions');
      cy.get('.toggle-ingresos').click();
      cy.contains('No hay ingresos registrados este mes').should('be.visible');
    });

    it('Debe mostrar el gráfico de pastel cuando hay datos', () => {
      cy.intercept('POST', '**/rest/v1/rpc/get_monthly_expenses_by_category**', {
        statusCode: 200,
        body: [
          {
            category_id: 'cat-1',
            category_name: 'Comida',
            category_color: '#e74c3c',
            category_icon: 'material-symbols:restaurant',
            total_amount: 500,
            transaction_count: 5
          }
        ]
      }).as('getExpensesWithData');

      cy.visit('/dashboard');
      cy.wait('@getExpensesWithData');
      cy.get('.pie-chart').should('exist');
      cy.get('.chart-container').should('exist');
      cy.get('.chart-wrapper-grid').should('exist');
    });

    it('Debe mostrar la leyenda de categorías cuando hay datos', () => {
      cy.intercept('POST', '**/rest/v1/rpc/get_monthly_expenses_by_category**', {
        statusCode: 200,
        body: [
          {
            category_id: 'cat-1',
            category_name: 'Comida',
            category_color: '#e74c3c',
            category_icon: 'material-symbols:restaurant',
            total_amount: 500,
            transaction_count: 5
          }
        ]
      }).as('getExpensesWithData');

      cy.visit('/dashboard');
      cy.wait('@getExpensesWithData');
      cy.get('.categories-legend').should('exist');
      cy.get('.legend-header').should('exist');
      cy.get('.legend-item').should('exist');
    });
  });

  describe('Transacciones Recientes', () => {
    it('Debe mostrar la sección de transacciones recientes', () => {
      cy.wait('@getTransactions');
      cy.contains('Transacciones Recientes').should('be.visible');
      cy.get('.recent-card').should('exist');
      cy.get('.dashboard-card.recent-card').should('exist');
    });

    it('Debe mostrar el enlace "Ver todas"', () => {
      cy.wait('@getTransactions');
      cy.contains('Ver todas').should('be.visible');
      cy.get('.view-all-link').should('have.attr', 'href', '/transactions');
    });

    it('Debe mostrar mensaje cuando no hay transacciones', () => {
      cy.wait('@getTransactions');
      cy.contains('No hay transacciones recientes').should('be.visible');
      cy.get('.empty-transactions').should('exist');
    });

    it('Debe navegar a transacciones al hacer clic en "Ver todas"', () => {
      cy.wait('@getTransactions');
      cy.get('.view-all-link').click();
      cy.url().should('include', '/transactions');
    });

    it('Debe mostrar transacciones cuando hay datos', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: [
          {
            id: '1',
            user_id: 'user-123',
            category_id: 'cat-1',
            type: 'ingreso',
            amount: 1000,
            description: 'Salario',
            transaction_date: new Date().toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            categories: {
              id: 'cat-1',
              name: 'Salario',
              type: 'ingreso',
              color: '#4A90E2',
              icon: 'material-symbols:work'
            }
          }
        ]
      }).as('getTransactionsWithData');

      cy.visit('/dashboard');
      cy.wait('@getTransactionsWithData');
      cy.get('.transactions-list-compact').should('exist');
      cy.get('.transaction-item-compact').should('exist');
      cy.contains('Salario').should('be.visible');
    });

    it('Debe mostrar máximo 5 transacciones recientes', () => {
      const transacciones = Array.from({ length: 7 }, (_, i) => ({
        id: `${i + 1}`,
        user_id: 'user-123',
        category_id: 'cat-1',
        type: 'ingreso',
        amount: 100,
        transaction_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        categories: { name: `Categoria ${i + 1}` }
      }));

      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: transacciones
      }).as('getManyTransactions');

      cy.visit('/dashboard');
      cy.wait('@getManyTransactions');
      cy.get('.transaction-item-compact').should('have.length.at.most', 5);
    });
  });

  describe('Comparación Mensual de Gastos', () => {
    it('Debe mostrar la sección de comparación mensual', () => {
      cy.wait('@getTransactions');
      cy.contains('Comparación Mensual de Gastos').should('be.visible');
      cy.get('.comparison-card').should('exist');
    });

    it('Debe mostrar los selectores de mes', () => {
      cy.wait('@getTransactions');
      cy.get('.month-selectors').should('exist');
      cy.get('.month-selector').should('have.length', 2);
      cy.get('#mes1-select').should('exist');
      cy.get('#mes2-select').should('exist');
    });

    it('Debe mostrar las etiquetas de los selectores', () => {
      cy.wait('@getTransactions');
      cy.contains('label', 'Mes 1').should('be.visible');
      cy.contains('label', 'Mes 2').should('be.visible');
      cy.get('.selector-label').should('have.length', 2);
    });

    it('Debe mostrar el icono de comparación', () => {
      cy.wait('@getTransactions');
      cy.get('.compare-icon').should('exist');
    });

    it('Debe mostrar mensaje cuando no hay datos para comparar', () => {
      cy.wait('@getTransactions');
      cy.contains('No hay datos para comparar').should('be.visible');
      cy.get('.empty-comparison').should('exist');
    });

    it('Debe mostrar el gráfico de barras cuando hay datos', () => {
      cy.intercept('GET', '**/rest/v1/transactions**?*type=eq.gasto*', {
        statusCode: 200,
        body: [
          {
            id: '1',
            type: 'gasto',
            amount: 100,
            categories: { name: 'Comida' }
          }
        ]
      }).as('getComparisonData');

      cy.wait('@getTransactions');
      cy.wait('@getComparisonData');
      cy.get('.bar-chart-container').should('exist');
      cy.get('.bars-grid').should('exist');
    });

    it('Debe mostrar el resumen de comparación cuando hay datos', () => {
      cy.intercept('GET', '**/rest/v1/transactions**?*type=eq.gasto*', {
        statusCode: 200,
        body: [
          {
            id: '1',
            type: 'gasto',
            amount: 100,
            categories: { name: 'Comida' }
          }
        ]
      }).as('getComparisonData');

      cy.wait('@getTransactions');
      cy.wait('@getComparisonData');
      cy.get('.comparison-summary').should('exist');
      cy.get('.summary-item').should('have.length.at.least', 3);
    });
  });

  describe('Diseño responsive', () => {
    it('Debe verse correctamente en dispositivos móviles', () => {
      cy.viewport('iphone-x');
      cy.wait('@getTransactions');
      cy.get('.dashboard-container').should('be.visible');
      cy.get('.stats-grid').should('exist');
    });

    it('Debe adaptar el grid de estadísticas en móvil', () => {
      cy.viewport('iphone-x');
      cy.wait('@getTransactions');
      cy.get('.stats-grid').should('exist');
      cy.get('.stat-card').should('have.length', 4);
    });

    it('Debe verse correctamente en tablets', () => {
      cy.viewport('ipad-2');
      cy.wait('@getTransactions');
      cy.get('.dashboard-container').should('be.visible');
    });

    it('Debe adaptar el grid de dashboard en móvil', () => {
      cy.viewport('iphone-x');
      cy.wait('@getTransactions');
      cy.get('.dashboard-grid').should('exist');
    });
  });

  describe('Accesibilidad', () => {
    it('Debe tener estructura semántica correcta', () => {
      cy.wait('@getTransactions');
      cy.get('.dashboard-container').should('exist');
      cy.get('.dashboard-header').should('exist');
    });

    it('Debe tener atributos aria-label en las secciones', () => {
      cy.wait('@getTransactions');
      cy.get('[aria-label="Resumen financiero"]').should('exist');
      cy.get('[aria-label="Acciones rápidas"]').should('exist');
      cy.get('[aria-label="Análisis de gastos"]').should('exist');
      cy.get('[aria-label="Comparación mensual de gastos"]').should('exist');
    });

    it('Los títulos deben tener jerarquía correcta', () => {
      cy.wait('@getTransactions');
      cy.get('.dashboard-title').should('exist');
      cy.get('.card-title').should('exist');
    });

    it('Debe tener atributos aria-label en los botones', () => {
      cy.wait('@getTransactions');
      cy.get('[aria-label="Agregar nueva transacción"]').should('exist');
      cy.get('[aria-label="Ver todas las transacciones"]').should('exist');
      cy.get('[aria-label="Ver gastos"]').should('exist');
      cy.get('[aria-label="Ver ingresos"]').should('exist');
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
      }).as('getTransactionsError');

      cy.visit('/dashboard');
      cy.wait('@getTransactionsError');
      cy.get('.dashboard-container').should('exist');
    });

    it('Debe actualizar los datos después de agregar una transacción', () => {
      cy.intercept('POST', '**/rest/v1/transactions**', {
        statusCode: 201,
        body: [{
          id: 'new-1',
          type: 'ingreso',
          amount: 500,
          categories: { name: 'Nuevo' }
        }]
      }).as('createTransaction');

      cy.intercept('GET', '**/rest/v1/categories**', {
        statusCode: 200,
        body: []
      }).as('getCategories');

      cy.wait('@getTransactions');
      cy.get('.action-btn.primary').click();
      cy.wait('@getCategories');
      // El formulario debería estar visible
      cy.get('.modal-content-form').should('be.visible');
    });
  });
});
