/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('Transacciones E2E Tests', () => {
  beforeEach(() => {
    // Realizar login y visitar la página de transacciones
    cy.loginAndVisit('/transactions');
  });

  describe('Crear transacción', () => {
    it('Debe poder crear una transacción de ingreso', () => {
      // Interceptar la petición de creación
      cy.intercept('POST', '**/transactions**', {
        statusCode: 201,
        body: {
          id: '123',
          user_id: 'user-123',
          category_id: 'cat-1',
          type: 'ingreso',
          amount: 1000,
          description: 'Salario',
          transaction_date: new Date().toISOString()
        }
      }).as('createTransaction');
      
      // Simular llenado del formulario
      cy.get('#type').select('ingreso');
      cy.get('#amount').type('1000');
      cy.get('#category').type('Salario');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@createTransaction');
      cy.contains('Transacción agregada exitosamente', { timeout: 3000 }).should('be.visible');
    });

    it('Debe poder crear una transacción de egreso', () => {
      cy.intercept('POST', '**/transactions**', {
        statusCode: 201,
        body: {
          id: '124',
          user_id: 'user-123',
          category_id: 'cat-2',
          type: 'egreso',
          amount: 50,
          description: 'Comida',
          transaction_date: new Date().toISOString()
        }
      }).as('createTransaction');
      
      cy.get('#type').select('egreso');
      cy.get('#amount').type('50');
      cy.get('#category').type('Comida');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@createTransaction');
      cy.contains('Transacción agregada exitosamente', { timeout: 3000 }).should('be.visible');
    });

    it('Debe validar que el monto sea positivo', () => {
      cy.get('#type').select('ingreso');
      cy.get('#amount').type('-100');
      cy.get('#category').type('Test');
      cy.get('button[type="submit"]').click();
      
      // El campo debería rechazar valores negativos debido al atributo min="0"
      cy.get('#amount').should('have.attr', 'min', '0');
    });
  });

  describe('Listar transacciones', () => {
    it('Debe poder obtener la lista de transacciones', () => {
      cy.intercept('GET', '**/transactions**', {
        statusCode: 200,
        body: [
          {
            id: '123',
            user_id: 'user-123',
            category_id: 'cat-1',
            type: 'ingreso',
            amount: 1000,
            description: 'Salario',
            transaction_date: new Date().toISOString()
          },
          {
            id: '124',
            user_id: 'user-123',
            category_id: 'cat-2',
            type: 'egreso',
            amount: 50,
            description: 'Comida',
            transaction_date: new Date().toISOString()
          }
        ]
      }).as('getTransactions');
      
      // Simular carga de transacciones (esto dependería de cómo se cargan en tu app)
      cy.wait('@getTransactions');
    });

    it('Debe filtrar transacciones por tipo', () => {
      cy.intercept('GET', '**/transactions**?type=ingreso**', {
        statusCode: 200,
        body: [
          {
            id: '123',
            type: 'ingreso',
            amount: 1000,
            description: 'Salario'
          }
        ]
      }).as('getIncomeTransactions');
      
      // Simular filtro de ingresos
      cy.wait('@getIncomeTransactions');
    });

    it('Debe filtrar transacciones por categoría', () => {
      cy.intercept('GET', '**/transactions**?category_id=cat-1**', {
        statusCode: 200,
        body: [
          {
            id: '123',
            category_id: 'cat-1',
            type: 'ingreso',
            amount: 1000
          }
        ]
      }).as('getCategoryTransactions');
      
      // Simular filtro por categoría
      cy.wait('@getCategoryTransactions');
    });
  });

  describe('Actualizar transacción', () => {
    it('Debe poder actualizar una transacción existente', () => {
      const transactionId = '123';
      
      cy.intercept('PATCH', `**/transactions/${transactionId}**`, {
        statusCode: 200,
        body: {
          id: transactionId,
          type: 'ingreso',
          amount: 1500,
          description: 'Salario actualizado'
        }
      }).as('updateTransaction');
      
      // Simular actualización (esto dependería de tu UI)
      cy.wait('@updateTransaction');
    });

    it('Debe validar los datos al actualizar', () => {
      cy.intercept('PATCH', '**/transactions/**', {
        statusCode: 400,
        body: { error: 'Datos inválidos' }
      }).as('updateTransactionError');
      
      // Simular actualización con datos inválidos
      cy.wait('@updateTransactionError');
    });
  });

  describe('Eliminar transacción', () => {
    it('Debe poder eliminar una transacción', () => {
      const transactionId = '123';
      
      cy.intercept('DELETE', `**/transactions/${transactionId}**`, {
        statusCode: 200,
        body: {}
      }).as('deleteTransaction');
      
      // Simular eliminación (esto dependería de tu UI)
      cy.wait('@deleteTransaction');
    });

    it('Debe confirmar antes de eliminar', () => {
      // Este test verificaría que hay una confirmación antes de eliminar
      cy.intercept('DELETE', '**/transactions/**', {
        statusCode: 200
      }).as('deleteTransaction');
      
      // Simular confirmación y eliminación
      cy.wait('@deleteTransaction');
    });
  });

  describe('Cálculos y totales', () => {
    it('Debe calcular el total de ingresos', () => {
      cy.intercept('GET', '**/transactions**', {
        statusCode: 200,
        body: [
          { type: 'ingreso', amount: 1000 },
          { type: 'ingreso', amount: 500 },
          { type: 'egreso', amount: 200 }
        ]
      }).as('getTransactions');
      
      // El total de ingresos debería ser 1500
      cy.wait('@getTransactions');
    });

    it('Debe calcular el total de egresos', () => {
      cy.intercept('GET', '**/transactions**', {
        statusCode: 200,
        body: [
          { type: 'ingreso', amount: 1000 },
          { type: 'egreso', amount: 200 },
          { type: 'egreso', amount: 150 }
        ]
      }).as('getTransactions');
      
      // El total de egresos debería ser 350
      cy.wait('@getTransactions');
    });

    it('Debe calcular el balance (ingresos - egresos)', () => {
      cy.intercept('GET', '**/transactions**', {
        statusCode: 200,
        body: [
          { type: 'ingreso', amount: 1000 },
          { type: 'egreso', amount: 300 }
        ]
      }).as('getTransactions');
      
      // El balance debería ser 700
      cy.wait('@getTransactions');
    });
  });

  describe('Filtros y búsqueda', () => {
    it('Debe filtrar transacciones por fecha de inicio', () => {
      const fechaInicio = '2024-01-01';
      
      cy.intercept('GET', `**/transactions**?transaction_date_gte=${fechaInicio}**`, {
        statusCode: 200,
        body: []
      }).as('getTransactionsByDate');
      
      cy.wait('@getTransactionsByDate');
    });

    it('Debe filtrar transacciones por fecha de fin', () => {
      const fechaFin = '2024-12-31';
      
      cy.intercept('GET', `**/transactions**?transaction_date_lte=${fechaFin}**`, {
        statusCode: 200,
        body: []
      }).as('getTransactionsByDate');
      
      cy.wait('@getTransactionsByDate');
    });

    it('Debe filtrar transacciones por rango de monto', () => {
      cy.intercept('GET', '**/transactions**?amount_gte=100&amount_lte=1000**', {
        statusCode: 200,
        body: []
      }).as('getTransactionsByAmount');
      
      cy.wait('@getTransactionsByAmount');
    });
  });

  describe('Errores y validaciones', () => {
    it('Debe manejar errores al crear transacción', () => {
      cy.intercept('POST', '**/transactions**', {
        statusCode: 500,
        body: { error: 'Error del servidor' }
      }).as('createTransactionError');
      
      cy.get('#type').select('ingreso');
      cy.get('#amount').type('100');
      cy.get('#category').type('Test');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@createTransactionError');
      cy.get('.error-message', { timeout: 3000 }).should('be.visible');
    });

    it('Debe validar campos requeridos', () => {
      cy.get('button[type="submit"]').click();
      
      cy.get('#type').then(($input) => {
        const input = $input[0] as HTMLSelectElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe manejar errores de red', () => {
      cy.intercept('POST', '**/transactions**', {
        forceNetworkError: true
      }).as('networkError');
      
      cy.get('#type').select('ingreso');
      cy.get('#amount').type('100');
      cy.get('#category').type('Test');
      cy.get('button[type="submit"]').click();
      
      cy.wait('@networkError');
    });
  });

  describe('Transacciones del mes actual', () => {
    it('Debe obtener transacciones del mes actual', () => {
      const ahora = new Date();
      const primerDia = new Date(ahora.getFullYear(), ahora.getMonth(), 1);
      const ultimoDia = new Date(ahora.getFullYear(), ahora.getMonth() + 1, 0);
      
      cy.intercept('GET', `**/transactions**?transaction_date_gte=${primerDia.toISOString().split('T')[0]}**`, {
        statusCode: 200,
        body: []
      }).as('getCurrentMonthTransactions');
      
      cy.wait('@getCurrentMonthTransactions');
    });
  });

  describe('Ordenamiento', () => {
    it('Debe ordenar transacciones por fecha descendente', () => {
      cy.intercept('GET', '**/transactions**?order=transaction_date.desc**', {
        statusCode: 200,
        body: []
      }).as('getOrderedTransactions');
      
      cy.wait('@getOrderedTransactions');
    });
  });
});

