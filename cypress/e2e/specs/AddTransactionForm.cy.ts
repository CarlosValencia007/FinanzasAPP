/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('AddTransactionForm E2E Tests', () => {
  beforeEach(() => {
    // Realizar login y visitar la página de transacciones
    cy.loginAndVisit('/transactions');
  });

  describe('Elementos del formulario', () => {
    it('Debe mostrar el título del formulario', () => {
      cy.contains('Nueva Transacción').should('be.visible');
      cy.get('.form-title').should('exist');
    });

    it('Debe mostrar el subtítulo del formulario', () => {
      cy.contains('Registra tus ingresos y gastos').should('be.visible');
      cy.get('.form-subtitle').should('exist');
    });

    it('Debe mostrar el campo de tipo de transacción', () => {
      cy.get('#type').should('exist');
      cy.get('label[for="type"]').should('contain', 'Tipo');
    });

    it('Debe mostrar el campo de monto', () => {
      cy.get('#amount').should('exist');
      cy.get('label[for="amount"]').should('contain', 'Monto');
    });

    it('Debe mostrar el campo de categoría', () => {
      cy.get('#category').should('exist');
      cy.get('label[for="category"]').should('contain', 'Categoría');
    });

    it('Debe mostrar los botones de acción', () => {
      cy.get('button[type="submit"]').should('exist');
      cy.get('button[type="button"]').should('contain', 'Cancelar');
    });
  });

  describe('Opciones del campo tipo', () => {
    it('Debe tener opción para seleccionar tipo', () => {
      cy.get('#type').should('exist');
      cy.get('#type option').should('have.length.at.least', 2);
    });

    it('Debe tener opción de ingreso', () => {
      cy.get('#type').select('ingreso');
      cy.get('#type').should('have.value', 'ingreso');
    });

    it('Debe tener opción de egreso', () => {
      cy.get('#type').select('egreso');
      cy.get('#type').should('have.value', 'egreso');
    });
  });

  describe('Validación del formulario', () => {
    it('Debe requerir el campo de tipo', () => {
      cy.get('#type').should('have.attr', 'required');
    });

    it('Debe requerir el campo de monto', () => {
      cy.get('#amount').should('have.attr', 'required');
    });

    it('Debe requerir el campo de categoría', () => {
      cy.get('#category').should('have.attr', 'required');
    });

    it('El campo de monto debe aceptar solo números', () => {
      cy.get('#amount').should('have.attr', 'type', 'number');
    });

    it('El campo de monto debe tener step de 0.01', () => {
      cy.get('#amount').should('have.attr', 'step', '0.01');
    });

    it('El campo de monto debe tener mínimo de 0', () => {
      cy.get('#amount').should('have.attr', 'min', '0');
    });
  });

  describe('Interacción con el formulario', () => {
    it('Debe permitir seleccionar tipo de transacción', () => {
      cy.get('#type').select('ingreso');
      cy.get('#type').should('have.value', 'ingreso');
    });

    it('Debe permitir escribir el monto', () => {
      cy.get('#amount').type('100.50');
      cy.get('#amount').should('have.value', '100.50');
    });

    it('Debe permitir escribir la categoría', () => {
      cy.get('#category').type('Salario');
      cy.get('#category').should('have.value', 'Salario');
    });

    it('Debe limpiar los campos al hacer clic en Cancelar', () => {
      cy.get('#type').select('ingreso');
      cy.get('#amount').type('100');
      cy.get('#category').type('Salario');
      
      cy.get('button[type="button"]').contains('Cancelar').click();
      
      cy.get('#type').should('have.value', '');
      cy.get('#amount').should('have.value', '');
      cy.get('#category').should('have.value', '');
    });
  });

  describe('Envío del formulario', () => {
    it('Debe mostrar estado de carga al enviar', () => {
      cy.get('#type').select('ingreso');
      cy.get('#amount').type('100');
      cy.get('#category').type('Salario');
      
      // Interceptar la petición
      cy.intercept('POST', '**/transactions**', {
        delay: 1000,
        statusCode: 201,
        body: {}
      }).as('createTransaction');
      
      cy.get('button[type="submit"]').click();
      
      // Verificar que aparece el texto de carga
      cy.contains('Guardando...', { timeout: 2000 }).should('be.visible');
    });

    it('Debe deshabilitar el botón durante el envío', () => {
      cy.get('#type').select('ingreso');
      cy.get('#amount').type('100');
      cy.get('#category').type('Salario');
      
      cy.intercept('POST', '**/transactions**', {
        delay: 1000,
        statusCode: 201,
        body: {}
      });
      
      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('Debe mostrar mensaje de éxito después de enviar', () => {
      cy.get('#type').select('ingreso');
      cy.get('#amount').type('100');
      cy.get('#category').type('Salario');
      
      cy.intercept('POST', '**/transactions**', {
        statusCode: 201,
        body: {
          id: '123',
          type: 'ingreso',
          amount: 100,
          category: 'Salario'
        }
      }).as('createTransaction');
      
      cy.get('button[type="submit"]').click();
      cy.wait('@createTransaction');
      
      cy.contains('Transacción agregada exitosamente', { timeout: 3000 }).should('be.visible');
    });

    it('Debe mostrar mensaje de error si falla el envío', () => {
      cy.get('#type').select('ingreso');
      cy.get('#amount').type('100');
      cy.get('#category').type('Salario');
      
      cy.intercept('POST', '**/transactions**', {
        statusCode: 400,
        body: { error: 'Error al crear transacción' }
      }).as('createTransactionError');
      
      cy.get('button[type="submit"]').click();
      cy.wait('@createTransactionError');
      
      cy.get('.error-message', { timeout: 3000 }).should('be.visible');
    });
  });

  describe('Validación de campos vacíos', () => {
    it('Debe mostrar error si se envía el formulario vacío', () => {
      cy.get('button[type="submit"]').click();
      
      // Verificar que los campos requeridos están marcados
      cy.get('#type').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe validar que el tipo esté seleccionado', () => {
      cy.get('#amount').type('100');
      cy.get('#category').type('Salario');
      cy.get('button[type="submit"]').click();
      
      cy.get('#type').then(($input) => {
        const input = $input[0] as HTMLSelectElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe validar que el monto esté ingresado', () => {
      cy.get('#type').select('ingreso');
      cy.get('#category').type('Salario');
      cy.get('button[type="submit"]').click();
      
      cy.get('#amount').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe validar que la categoría esté ingresada', () => {
      cy.get('#type').select('ingreso');
      cy.get('#amount').type('100');
      cy.get('button[type="submit"]').click();
      
      cy.get('#category').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });
  });

  describe('Placeholders', () => {
    it('El campo de monto debe tener placeholder', () => {
      cy.get('#amount').should('have.attr', 'placeholder', '0.00');
    });

    it('El campo de categoría debe tener placeholder', () => {
      cy.get('#category').should('have.attr', 'placeholder');
      cy.get('#category').should('have.attr', 'placeholder', 'Ej: Salario, Comida, Transporte');
    });
  });

  describe('Estilos y diseño', () => {
    it('Debe tener las clases CSS correctas', () => {
      cy.get('.transaction-form').should('exist');
      cy.get('.form-header').should('exist');
      cy.get('.form-grid').should('exist');
      cy.get('.form-actions').should('exist');
    });

    it('Debe tener iconos en los labels', () => {
      cy.get('.label-icon').should('exist');
    });
  });

  describe('Diseño responsive', () => {
    it('Debe verse correctamente en dispositivos móviles', () => {
      cy.viewport('iphone-x');
      cy.get('.transaction-form').should('be.visible');
    });

    it('Debe verse correctamente en tablets', () => {
      cy.viewport('ipad-2');
      cy.get('.transaction-form').should('be.visible');
    });

    it('Debe verse correctamente en desktop', () => {
      cy.viewport(1920, 1080);
      cy.get('.transaction-form').should('be.visible');
    });
  });

  describe('Accesibilidad', () => {
    it('Los campos deben tener labels asociados', () => {
      cy.get('label[for="type"]').should('exist');
      cy.get('label[for="amount"]').should('exist');
      cy.get('label[for="category"]').should('exist');
    });

    it('Los campos deben tener atributos required', () => {
      cy.get('#type').should('have.attr', 'required');
      cy.get('#amount').should('have.attr', 'required');
      cy.get('#category').should('have.attr', 'required');
    });
  });

  describe('Flujo completo', () => {
    it('Debe completar el flujo de agregar una transacción de ingreso', () => {
      cy.get('#type').select('ingreso');
      cy.get('#amount').type('500');
      cy.get('#category').type('Salario');
      
      cy.intercept('POST', '**/transactions**', {
        statusCode: 201,
        body: {
          id: '123',
          type: 'ingreso',
          amount: 500,
          category: 'Salario'
        }
      }).as('createTransaction');
      
      cy.get('button[type="submit"]').click();
      cy.wait('@createTransaction');
      
      cy.contains('Transacción agregada exitosamente', { timeout: 3000 }).should('be.visible');
    });

    it('Debe completar el flujo de agregar una transacción de egreso', () => {
      cy.get('#type').select('egreso');
      cy.get('#amount').type('50');
      cy.get('#category').type('Comida');
      
      cy.intercept('POST', '**/transactions**', {
        statusCode: 201,
        body: {
          id: '124',
          type: 'egreso',
          amount: 50,
          category: 'Comida'
        }
      }).as('createTransaction');
      
      cy.get('button[type="submit"]').click();
      cy.wait('@createTransaction');
      
      cy.contains('Transacción agregada exitosamente', { timeout: 3000 }).should('be.visible');
    });
  });
});

