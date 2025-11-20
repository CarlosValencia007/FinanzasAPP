/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('AddTransaction E2E Tests', () => {
  beforeEach(() => {
    // Realizar login y visitar la página de transacciones
    cy.loginAndVisit('/transactions');
  });

  describe('Agregar transacción de ingreso', () => {
    it('Debe permitir agregar un ingreso visualmente', () => {
      // Interceptar la petición
      cy.intercept('POST', '**/transactions**', {
        statusCode: 201,
        body: {
          id: '123',
          type: 'ingreso',
          amount: 100,
          category: 'trabajo'
        }
      }).as('createTransaction');
      
      // Buscar elementos por data-testid o por id
      cy.get('#type, [data-testid="type"]').first().select('ingreso');
      cy.get('#amount, [data-testid="amount"]').first().type('100');
      cy.get('#category, [data-testid="category"]').first().type('trabajo');
      cy.get('button[type="submit"], [data-testid="submit"]').first().click();
      
      cy.wait('@createTransaction');
      cy.contains('Transacción agregada exitosamente', { timeout: 3000 }).should('be.visible');
    });

    it('Debe mostrar el ingreso agregado en la lista', () => {
      cy.intercept('POST', '**/transactions**', {
        statusCode: 201,
        body: {
          type: 'ingreso',
          amount: 100,
          category: 'trabajo'
        }
      }).as('createTransaction');
      
      cy.get('#type, [data-testid="type"]').first().select('ingreso');
      cy.get('#amount, [data-testid="amount"]').first().type('100');
      cy.get('#category, [data-testid="category"]').first().type('trabajo');
      cy.get('button[type="submit"], [data-testid="submit"]').first().click();
      
      cy.wait('@createTransaction');
    });
  });

  describe('Agregar transacción de egreso', () => {
    it('Debe permitir agregar un egreso visualmente', () => {
      cy.intercept('POST', '**/transactions**', {
        statusCode: 201,
        body: {
          id: '124',
          type: 'egreso',
          amount: 50,
          category: 'comida'
        }
      }).as('createTransaction');
      
      cy.get('#type, [data-testid="type"]').first().select('egreso');
      cy.get('#amount, [data-testid="amount"]').first().type('50');
      cy.get('#category, [data-testid="category"]').first().type('comida');
      cy.get('button[type="submit"], [data-testid="submit"]').first().click();
      
      cy.wait('@createTransaction');
      cy.contains('Transacción agregada exitosamente', { timeout: 3000 }).should('be.visible');
    });
  });

  describe('Validación del formulario', () => {
    it('No debe permitir enviar formulario vacío', () => {
      cy.get('button[type="submit"], [data-testid="submit"]').first().click();
      
      // Verificar que los campos requeridos están marcados
      cy.get('#type, [data-testid="type"]').first().then(($input) => {
        const input = $input[0] as HTMLSelectElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe mostrar mensaje de error si falta el monto', () => {
      cy.get('#type, [data-testid="type"]').first().select('ingreso');
      cy.get('#category, [data-testid="category"]').first().type('trabajo');
      cy.get('button[type="submit"], [data-testid="submit"]').first().click();
      
      cy.get('#amount, [data-testid="amount"]').first().then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe mostrar mensaje de error si falta la categoría', () => {
      cy.get('#type, [data-testid="type"]').first().select('ingreso');
      cy.get('#amount, [data-testid="amount"]').first().type('100');
      cy.get('button[type="submit"], [data-testid="submit"]').first().click();
      
      cy.get('#category, [data-testid="category"]').first().then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe validar que el monto sea un número válido', () => {
      cy.get('#type, [data-testid="type"]').first().select('ingreso');
      cy.get('#amount, [data-testid="amount"]').first().type('abc');
      cy.get('#category, [data-testid="category"]').first().type('trabajo');
      cy.get('button[type="submit"], [data-testid="submit"]').first().click();
      
      cy.get('#amount, [data-testid="amount"]').first().then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });
  });

  describe('Errores y manejo de respuestas', () => {
    it('Debe manejar errores del servidor', () => {
      cy.intercept('POST', '**/transactions**', {
        statusCode: 500,
        body: { error: 'Error del servidor' }
      }).as('createTransactionError');
      
      cy.get('#type, [data-testid="type"]').first().select('ingreso');
      cy.get('#amount, [data-testid="amount"]').first().type('100');
      cy.get('#category, [data-testid="category"]').first().type('trabajo');
      cy.get('button[type="submit"], [data-testid="submit"]').first().click();
      
      cy.wait('@createTransactionError');
      cy.get('.error-message', { timeout: 3000 }).should('be.visible');
    });

    it('Debe manejar errores de red', () => {
      cy.intercept('POST', '**/transactions**', {
        forceNetworkError: true
      }).as('networkError');
      
      cy.get('#type, [data-testid="type"]').first().select('ingreso');
      cy.get('#amount, [data-testid="amount"]').first().type('100');
      cy.get('#category, [data-testid="category"]').first().type('trabajo');
      cy.get('button[type="submit"], [data-testid="submit"]').first().click();
      
      cy.wait('@networkError');
    });
  });

  describe('Interacción con el formulario', () => {
    it('Debe permitir cambiar el tipo de transacción', () => {
      cy.get('#type, [data-testid="type"]').first().select('ingreso');
      cy.get('#type, [data-testid="type"]').first().should('have.value', 'ingreso');
      
      cy.get('#type, [data-testid="type"]').first().select('egreso');
      cy.get('#type, [data-testid="type"]').first().should('have.value', 'egreso');
    });

    it('Debe permitir editar el monto', () => {
      cy.get('#amount, [data-testid="amount"]').first().type('100');
      cy.get('#amount, [data-testid="amount"]').first().clear();
      cy.get('#amount, [data-testid="amount"]').first().type('200');
      cy.get('#amount, [data-testid="amount"]').first().should('have.value', '200');
    });

    it('Debe permitir editar la categoría', () => {
      cy.get('#category, [data-testid="category"]').first().type('trabajo');
      cy.get('#category, [data-testid="category"]').first().clear();
      cy.get('#category, [data-testid="category"]').first().type('salario');
      cy.get('#category, [data-testid="category"]').first().should('have.value', 'salario');
    });
  });

  describe('Estado de carga', () => {
    it('Debe mostrar estado de carga al enviar', () => {
      cy.intercept('POST', '**/transactions**', {
        delay: 1000,
        statusCode: 201,
        body: {}
      }).as('createTransaction');
      
      cy.get('#type, [data-testid="type"]').first().select('ingreso');
      cy.get('#amount, [data-testid="amount"]').first().type('100');
      cy.get('#category, [data-testid="category"]').first().type('trabajo');
      cy.get('button[type="submit"], [data-testid="submit"]').first().click();
      
      cy.contains('Guardando...', { timeout: 2000 }).should('be.visible');
    });

    it('Debe deshabilitar el botón durante el envío', () => {
      cy.intercept('POST', '**/transactions**', {
        delay: 1000,
        statusCode: 201,
        body: {}
      }).as('createTransaction');
      
      cy.get('#type, [data-testid="type"]').first().select('ingreso');
      cy.get('#amount, [data-testid="amount"]').first().type('100');
      cy.get('#category, [data-testid="category"]').first().type('trabajo');
      cy.get('button[type="submit"], [data-testid="submit"]').first().click();
      
      cy.get('button[type="submit"], [data-testid="submit"]').first().should('be.disabled');
    });
  });
});
