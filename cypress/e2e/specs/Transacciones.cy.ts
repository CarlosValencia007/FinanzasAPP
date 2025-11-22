/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Transacciones E2E Tests', () => {
  beforeEach(() => {
    // Interceptar las llamadas a Supabase
    cy.intercept('GET', '**/rest/v1/transactions**', {
      statusCode: 200,
      body: []
    }).as('getTransactions');

    cy.intercept('GET', '**/rest/v1/categories**', {
      statusCode: 200,
      body: []
    }).as('getCategories');

    // Realizar login y visitar la página de transacciones
    cy.loginAndVisit('/transactions');
  });

  describe('Elementos de la UI', () => {
    it('Debe cargar la página de transacciones correctamente', () => {
      cy.url().should('include', '/transactions');
      cy.contains('Mis Transacciones').should('be.visible');
      cy.contains('Administra tus ingresos y gastos').should('be.visible');
    });

    it('Debe mostrar el botón de Nueva Transacción', () => {
      cy.contains('button', 'Nueva Transacción').should('be.visible');
    });

    it('Debe mostrar las tarjetas de resumen', () => {
      cy.get('.summary-cards').should('exist');
      cy.get('.summary-card').should('have.length', 3);
      cy.contains('Ingresos').should('be.visible');
      cy.contains('Gastos').should('be.visible');
      cy.contains('Balance').should('be.visible');
    });

    it('Debe mostrar la sección de filtros', () => {
      cy.get('.filters-section').should('exist');
      cy.get('#filter-type').should('exist');
      cy.get('#filter-category').should('exist');
      cy.get('#filter-date-start').should('exist');
      cy.get('#filter-date-end').should('exist');
      cy.contains('button', 'Limpiar').should('be.visible');
    });
  });

  describe('Crear transacción', () => {
    it('Debe abrir el modal al hacer clic en Nueva Transacción', () => {
      cy.contains('button', 'Nueva Transacción').click();
      cy.get('.modal-overlay').should('be.visible');
      cy.get('.modal-content-form').should('be.visible');
      cy.contains('Nueva Transacción').should('be.visible');
    });

    it('Debe poder crear una transacción de ingreso', () => {
      // Interceptar las llamadas a Supabase
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
            is_system: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      }).as('getCategories');

      cy.intercept('POST', '**/rest/v1/transactions**', {
        statusCode: 201,
        body: [{
          id: '123',
          user_id: 'user-123',
          category_id: 'cat-1',
          type: 'ingreso',
          amount: 1000,
          description: 'Salario mensual',
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
        }]
      }).as('createTransaction');

      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: [{
          id: '123',
          user_id: 'user-123',
          category_id: 'cat-1',
          type: 'ingreso',
          amount: 1000,
          description: 'Salario mensual',
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
        }]
      }).as('getTransactionsAfterCreate');

      cy.contains('button', 'Nueva Transacción').click();
      cy.wait('@getCategories');

      cy.get('#type').select('ingreso');
      cy.get('#amount').type('1000');
      cy.get('#category').should('not.be.disabled');
      cy.get('#category').select('cat-1');
      cy.get('button[type="submit"]').should('not.be.disabled').click();


      cy.wait('@createTransaction');
      cy.wait('@getTransactionsAfterCreate');
      cy.contains('Transacción agregada exitosamente', { timeout: 3000 }).should('be.visible');
    });

    it('Debe poder crear una transacción de gasto', () => {
      cy.intercept('GET', '**/rest/v1/categories**', {
        statusCode: 200,
        body: [
          {
            id: 'cat-2',
            user_id: 'user-123',
            name: 'Comida',
            type: 'gasto',
            color: '#e74c3c',
            icon: 'material-symbols:restaurant',
            is_system: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      }).as('getCategories');

      cy.intercept('POST', '**/rest/v1/transactions**', {
        statusCode: 201,
        body: [{
          id: '124',
          user_id: 'user-123',
          category_id: 'cat-2',
          type: 'gasto',
          amount: 50,
          description: 'Almuerzo',
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
        }]
      }).as('createTransaction');

      cy.contains('button', 'Nueva Transacción').click();
      cy.wait('@getCategories');

      cy.get('#type').select('gasto');
      cy.get('#amount').type('50');
      cy.get('#category').should('not.be.disabled');
      cy.get('#category').select('cat-2');
      cy.get('button[type="submit"]').should('not.be.disabled').click();

      cy.wait('@createTransaction');
      cy.contains('Transacción agregada exitosamente', { timeout: 3000 }).should('be.visible');
    });

    it('Debe validar que el monto sea positivo', () => {
      cy.contains('button', 'Nueva Transacción').click();

      cy.get('#type').select('ingreso');
      cy.get('#amount').type('-100');
      cy.get('#amount').should('have.attr', 'min', '0.01');
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('Debe validar campos requeridos', () => {
      cy.contains('button', 'Nueva Transacción').click();
      cy.get('button[type="submit"]').should('be.disabled');

      cy.get('#type').select('ingreso');
      cy.get('button[type="submit"]').should('be.disabled');

      cy.get('#amount').type('100');
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('Debe cerrar el modal al hacer clic en Cancelar', () => {
      cy.contains('button', 'Nueva Transacción').click();
      cy.get('.modal-overlay').should('be.visible');
      cy.contains('button', 'Cancelar').click();
      cy.get('.modal-overlay').should('not.exist');
    });

    it('Debe cerrar el modal al hacer clic fuera de él', () => {
      cy.contains('button', 'Nueva Transacción').click();
      cy.get('.modal-overlay').should('be.visible');
      cy.get('.modal-overlay').click('topLeft');
      cy.get('.modal-overlay').should('not.exist');
    });
  });

  describe('Listar transacciones', () => {
    it('Debe mostrar mensaje cuando no hay transacciones', () => {
      cy.wait('@getTransactions');
      cy.contains('No hay transacciones').should('be.visible');
      cy.contains('Agrega tu primera transacción para comenzar').should('be.visible');
    });

    it('Debe mostrar la lista de transacciones cuando hay datos', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: [
          {
            id: '123',
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
            id: '124',
            user_id: 'user-123',
            category_id: 'cat-2',
            type: 'gasto',
            amount: 50,
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

      cy.visit('/transactions');
      cy.wait('@getTransactionsWithData');
      cy.get('.transactions-list').should('exist');
      cy.get('.transaction-card').should('have.length', 2);
    });

    it('Debe mostrar los detalles de cada transacción', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: [{
          id: '123',
          user_id: 'user-123',
          category_id: 'cat-1',
          type: 'ingreso',
          amount: 1000,
          description: 'Salario mensual',
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
        }]
      }).as('getTransaction');

      cy.visit('/transactions');
      cy.wait('@getTransaction');
      cy.get('.transaction-card').should('exist');
      cy.contains('Salario').should('be.visible');
      cy.contains('$1000.00').should('be.visible');
      cy.contains('Salario mensual').should('be.visible');
    });
  });

  describe('Filtros', () => {
    it('Debe filtrar transacciones por tipo', () => {
      cy.intercept('GET', '**/rest/v1/transactions**?*type=eq.ingreso*', {
        statusCode: 200,
        body: [{
          id: '123',
          type: 'ingreso',
          amount: 1000,
          categories: { name: 'Salario' }
        }]
      }).as('getIncomeTransactions');

      cy.get('#filter-type').select('ingreso');
      cy.wait('@getIncomeTransactions');
    });

    it('Debe filtrar transacciones por categoría', () => {
      cy.intercept('GET', '**/rest/v1/categories**', {
        statusCode: 200,
        body: [{
          id: 'cat-1',
          name: 'Salario',
          type: 'ingreso'
        }]
      }).as('getCategories');

      cy.intercept('GET', '**/rest/v1/transactions**?*category_id=eq.cat-1*', {
        statusCode: 200,
        body: []
      }).as('getCategoryTransactions');

      cy.wait('@getCategories');
      cy.get('#filter-category').select('cat-1');
      cy.wait('@getCategoryTransactions');
    });

    it('Debe filtrar transacciones por fecha de inicio', () => {
      const fechaInicio = '2024-01-01';
      cy.intercept('GET', `**/rest/v1/transactions**transaction_date=gte.${fechaInicio}*`, {
        statusCode: 200,
        body: []
      }).as('getTransactionsByStartDate');
      
      cy.get('#filter-date-start').type(fechaInicio);
      cy.wait('@getTransactionsByStartDate');
    });

    it('Debe filtrar transacciones por fecha de fin', () => {
      const fechaFin = '2024-12-31';
      cy.intercept('GET', `**/rest/v1/transactions**transaction_date=lte.${fechaFin}**`, {
        statusCode: 200,
        body: []
      }).as('getTransactionsByEndDate');

      cy.get('#filter-date-end').type(fechaFin);
      cy.wait('@getTransactionsByEndDate');
    });

    it('Debe limpiar los filtros', () => {
      cy.get('#filter-type').select('ingreso');

      cy.contains('button', 'Limpiar').click();

      cy.get('#filter-type').should('have.value', 'todos');
      cy.get('#filter-category').should('have.value', '');
    });



  });

  describe('Editar transacción', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: [{
          id: '123',
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
        }]
      }).as('getTransaction');
    });

    it('Debe abrir el modal de edición al hacer clic en el botón de editar', () => {
      cy.wait('@getTransaction');
      cy.get('.transaction-card').first().within(() => {
        cy.get('.btn-edit').click();
      });
      cy.get('.modal-overlay').should('be.visible');
      cy.contains('Editar Transacción').should('be.visible');
    });

    it('Debe poder actualizar una transacción', () => {
      it('Debe poder actualizar una transacción', () => {

        // Intercept correcto para Supabase
        cy.intercept(
          'PATCH',
          '**/rest/v1/transactions?id=eq.123',
          {
            statusCode: 200,
            body: [{
              id: '123',
              tipo: 'ingreso',
              monto: 1500,
              descripcion: 'Salario actualizado',
              id_categoria: 'cat-salario',
              fecha_transaccion: '2025-01-01'
            }]
          }
        ).as('updateTransaction');

        // Espera a que carguen las transacciones iniciales
        cy.wait('@getTransaction');

        // Abrir modal de edición
        cy.get('.transaction-card').first().within(() => {
          cy.get('.btn-edit').click();
        });

        // Editar campos
        cy.get('#edit-amount').clear().type('1500');
        cy.get('#edit-description').clear().type('Salario actualizado');

        // Guardar cambios
        cy.get('button[type="submit"]').should('not.be.disabled').click();

        // Esperar al PATCH real
        cy.wait('@updateTransaction');
      });

    });

    it('Debe cerrar el modal de edición al cancelar', () => {
      cy.wait('@getTransaction');
      cy.get('.transaction-card').first().within(() => {
        cy.get('.btn-edit').click();
      });
      cy.get('.modal-overlay').should('be.visible');
      cy.contains('button', 'Cancelar').click();
      cy.get('.modal-overlay').should('not.exist');
    });
  });

  describe('Eliminar transacción', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: [{
          id: '123',
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
        }]
      }).as('getTransaction');
    });

    it('Debe mostrar el modal de confirmación al hacer clic en eliminar', () => {
      cy.wait('@getTransaction');
      cy.get('.transaction-card').first().within(() => {
        cy.get('.btn-delete').click();
      });
      cy.get('.modal-overlay').should('be.visible');
      cy.contains('¿Eliminar transacción?').should('be.visible');
      cy.contains('$1000').should('be.visible');
    });

    it('Debe cancelar la eliminación al hacer clic en Cancelar', () => {
      cy.wait('@getTransaction');
      cy.get('.transaction-card').first().within(() => {
        cy.get('.btn-delete').click();
      });
      cy.get('.modal-overlay').should('be.visible');
      cy.contains('button', 'Cancelar').click();
      cy.get('.modal-overlay').should('not.exist');
      cy.get('.transaction-card').should('exist');
    });
  });

  describe('Cálculos y totales', () => {
    it('Debe calcular el total de ingresos correctamente', () => {
      cy.intercept("GET", "**/rest/v1/transactions*", {
        statusCode: 200,
        body: [
          {
            id: "1",
            user_id: "fake-user",
            category_id: "cat1",
            type: "ingreso",
            amount: 1000,
            description: "Salario mensual",
            transaction_date: "2025-01-01",
            created_at: "2025-01-01T10:00:00Z",
            updated_at: "2025-01-01T10:00:00Z",
            categories: {
              id: "cat1",
              user_id: "fake-user",
              name: "Salario",
              type: "ingreso",
              color: "#4A90E2",
              icon: "material-symbols:work",
              is_system: false,
              created_at: "2025-01-01",
              updated_at: "2025-01-01"
            }
          },
      
          {
            id: "2",
            user_id: "fake-user",
            category_id: "cat2",
            type: "ingreso",
            amount: 500,
            description: "Freelance",
            transaction_date: "2025-01-02",
            created_at: "2025-01-02T10:00:00Z",
            updated_at: "2025-01-02T10:00:00Z",
            categories: {
              id: "cat2",
              user_id: "fake-user",
              name: "Freelance",
              type: "ingreso",
              color: "#2ecc71",
              icon: "material-symbols:computer",
              is_system: false,
              created_at: "2025-01-02",
              updated_at: "2025-01-02"
            }
          },
      
          {
            id: "3",
            user_id: "fake-user",
            category_id: "cat3",
            type: "gasto",
            amount: 200,
            description: "Comida",
            transaction_date: "2025-01-03",
            created_at: "2025-01-03T10:00:00Z",
            updated_at: "2025-01-03T10:00:00Z",
            categories: {
              id: "cat3",
              user_id: "fake-user",
              name: "Comida",
              type: "gasto",
              color: "#e74c3c",
              icon: "material-symbols:restaurant",
              is_system: false,
              created_at: "2025-01-03",
              updated_at: "2025-01-03"
            }
          }
        ]
      }).as("getTransactions");
      
      
      
      cy.visit('/transactions');
      cy.wait('@getTransactions');
      
      cy.get('.income-card').within(() => {
        cy.contains('$1500.00').should('be.visible');
        cy.contains('2 transacciones').should('be.visible');
      });
    });


    it('Debe calcular el total de gastos correctamente', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: [
          {
            id: '1',
            type: 'ingreso',
            amount: 1000,
            categories: { name: 'Salario' }
          },
          {
            id: '2',
            type: 'gasto',
            amount: 200,
            categories: { name: 'Comida' }
          },
          {
            id: '3',
            type: 'gasto',
            amount: 150,
            categories: { name: 'Transporte' }
          }
        ]
      }).as('getTransactions');

      cy.visit('/transactions');
      cy.wait('@getTransactions');
      cy.get('.expense-card').within(() => {
        cy.contains('$350.00').should('be.visible');
        cy.contains('2 transacciones').should('be.visible');
      });
    });

    it('Debe calcular el balance correctamente', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: [
          {
            id: '1',
            type: 'ingreso',
            amount: 1000,
            categories: { name: 'Salario' }
          },
          {
            id: '2',
            type: 'gasto',
            amount: 300,
            categories: { name: 'Comida' }
          }
        ]
      }).as('getTransactions');

      cy.visit('/transactions');
      cy.wait('@getTransactions');
      cy.get('.balance-card').within(() => {
        cy.contains('$700.00').should('be.visible');
        cy.contains('Positivo').should('be.visible');
      });
    });

    it('Debe mostrar balance negativo cuando los gastos superan los ingresos', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: [
          {
            id: '1',
            user_id: 'fake-user',
            category_id: 'cat1',
            type: 'ingreso',
            amount: 500,
            description: 'Salario',
            transaction_date: '2025-01-01',
            created_at: '2025-01-01T00:00:00Z',
            updated_at: '2025-01-01T00:00:00Z',
      
            categories: {
              id: 'cat1',
              user_id: 'fake-user',
              name: 'Salario',
              type: 'ingreso',
              color: '#4A90E2',
              icon: 'material-symbols:work',
              is_system: false,
              created_at: '2025-01-01T00:00:00Z',
              updated_at: '2025-01-01T00:00:00Z'
            }
          },
      
          {
            id: '2',
            user_id: 'fake-user',
            category_id: 'cat2',
            type: 'gasto',
            amount: 800,
            description: 'Comida',
            transaction_date: '2025-01-02',
            created_at: '2025-01-02T00:00:00Z',
            updated_at: '2025-01-02T00:00:00Z',
      
            categories: {
              id: 'cat2',
              user_id: 'fake-user',
              name: 'Comida',
              type: 'gasto',
              color: '#e74c3c',
              icon: 'material-symbols:restaurant',
              is_system: false,
              created_at: '2025-01-02T00:00:00Z',
              updated_at: '2025-01-02T00:00:00Z'
            }
          }
        ]
      }).as('getTransactions');
      
      
      cy.visit('/transactions');
      cy.wait('@getTransactions');
      cy.get('.balance-card.negative').should('exist');
      cy.get('.balance-card').within(() => {
        cy.contains('$-300.00').should('be.visible');
        cy.contains('Negativo').should('be.visible');
      });
    });
  });

  describe('Estado de carga y errores', () => {
    it('Debe mostrar estado de carga inicialmente', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        delay: 1000,
        statusCode: 200,
        body: []
      }).as('getTransactionsDelayed');

      cy.visit('/transactions');
      cy.contains('Cargando transacciones...').should('be.visible');
      cy.get('.spinner').should('exist');
      cy.wait('@getTransactionsDelayed');
    });

    it('Debe manejar errores al cargar transacciones', () => {
      cy.intercept('GET', '**/rest/v1/transactions**', {
        statusCode: 500,
        body: { error: 'Internal Server Error' }
      }).as('getTransactionsError');

      cy.visit('/transactions');
      cy.wait('@getTransactionsError');
      cy.get('.error-state').should('exist');
      cy.contains('button', 'Reintentar').should('be.visible');
    });
  });

  describe('Responsive', () => {
    it('Debe verse correctamente en dispositivos móviles', () => {
      cy.viewport('iphone-x');
      cy.get('.transactions-page').should('be.visible');
      cy.get('.summary-cards').should('exist');
      cy.contains('button', 'Nueva Transacción').should('be.visible');
    });

    it('Debe adaptar el grid de tarjetas en móvil', () => {
      cy.viewport('iphone-x');
      cy.get('.summary-cards').should('exist');
      cy.get('.filters-group').should('exist');
    });
  });
});
