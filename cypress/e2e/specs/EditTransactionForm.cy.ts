/// <reference types="cypress" />
/// <reference path="../../support/index.d.ts" />

describe('EditTransactionForm E2E Tests', () => {
  const mockTransaction = {
    id: '123',
    tipo: 'ingreso',
    monto: 100.50,
    categoria: { nombre: 'Salario', color: '#27ae60' },
    descripcion: 'Pago mensual',
    fecha_transaccion: '2024-01-15'
  };

  beforeEach(() => {
    // Realizar login y visitar la página de transacciones
    cy.loginAndVisit('/transactions');

    // Interceptar peticiones de actualización
    cy.intercept('PUT', '**/rest/v1/transactions**', {
      statusCode: 200,
      body: { success: true }
    }).as('updateTransaction');
  });

  describe('Elementos del formulario', () => {
    it('Debe mostrar el campo de tipo de transacción', () => {
      cy.get('#edit-type').should('exist');
      cy.get('label[for="edit-type"]').should('contain', 'Tipo');
    });

    it('Debe mostrar el campo de monto', () => {
      cy.get('#edit-amount').should('exist');
      cy.get('label[for="edit-amount"]').should('contain', 'Monto');
    });

    it('Debe mostrar el campo de categoría', () => {
      cy.get('#edit-category').should('exist');
      cy.get('label[for="edit-category"]').should('contain', 'Categoría');
    });

    it('Debe mostrar el campo de descripción', () => {
      cy.get('#edit-description').should('exist');
      cy.get('label[for="edit-description"]').should('contain', 'Descripción');
    });

    it('Debe mostrar el campo de fecha', () => {
      cy.get('#edit-date').should('exist');
      cy.get('label[for="edit-date"]').should('contain', 'Fecha');
    });

    it('Debe mostrar los botones de acción', () => {
      cy.get('button[type="submit"]').should('exist');
      cy.get('button[type="button"]').contains('Cancelar').should('exist');
    });
  });

  describe('Opciones del campo tipo', () => {
    it('Debe tener opción para seleccionar tipo', () => {
      cy.get('#edit-type').should('exist');
      cy.get('#edit-type option').should('have.length.at.least', 2);
    });

    it('Debe tener opción de ingreso', () => {
      cy.get('#edit-type').select('ingreso');
      cy.get('#edit-type').should('have.value', 'ingreso');
    });

    it('Debe tener opción de egreso', () => {
      cy.get('#edit-type').select('egreso');
      cy.get('#edit-type').should('have.value', 'egreso');
    });
  });

  describe('Validación del formulario', () => {
    it('Debe requerir el campo de tipo', () => {
      cy.get('#edit-type').should('have.attr', 'required');
    });

    it('Debe requerir el campo de monto', () => {
      cy.get('#edit-amount').should('have.attr', 'required');
    });

    it('Debe requerir el campo de categoría', () => {
      cy.get('#edit-category').should('have.attr', 'required');
    });

    it('Debe requerir el campo de fecha', () => {
      cy.get('#edit-date').should('have.attr', 'required');
    });

    it('El campo de monto debe aceptar solo números', () => {
      cy.get('#edit-amount').should('have.attr', 'type', 'number');
    });

    it('El campo de monto debe tener step de 0.01', () => {
      cy.get('#edit-amount').should('have.attr', 'step', '0.01');
    });

    it('El campo de monto debe tener mínimo de 0.01', () => {
      cy.get('#edit-amount').should('have.attr', 'min', '0.01');
    });

    it('El campo de fecha no debe permitir fechas futuras', () => {
      const today = new Date().toISOString().split('T')[0];
      cy.get('#edit-date').should('have.attr', 'max', today);
    });
  });

  describe('Interacción con el formulario', () => {
    it('Debe permitir seleccionar tipo de transacción', () => {
      cy.get('#edit-type').select('ingreso');
      cy.get('#edit-type').should('have.value', 'ingreso');
    });

    it('Debe permitir escribir el monto', () => {
      cy.get('#edit-amount').clear().type('150.75');
      cy.get('#edit-amount').should('have.value', '150.75');
    });

    it('Debe permitir escribir la categoría', () => {
      cy.get('#edit-category').clear().type('Freelance');
      cy.get('#edit-category').should('have.value', 'Freelance');
    });

    it('Debe permitir escribir la descripción', () => {
      cy.get('#edit-description').clear().type('Nueva descripción');
      cy.get('#edit-description').should('have.value', 'Nueva descripción');
    });

    it('Debe permitir seleccionar la fecha', () => {
      const fecha = '2024-01-20';
      cy.get('#edit-date').clear().type(fecha);
      cy.get('#edit-date').should('have.value', fecha);
    });

    it('Debe cancelar la edición al hacer clic en Cancelar', () => {
      cy.get('#edit-amount').clear().type('200');
      cy.get('button[type="button"]').contains('Cancelar').click();
    });
  });

  describe('Sugerencias de categoría', () => {
    it('Debe tener datalist con sugerencias de categoría', () => {
      cy.get('#edit-category-suggestions').should('exist');
    });

    it('Debe mostrar sugerencias al escribir', () => {
      cy.get('#edit-category').clear().type('Sal');
      // Verificar que el datalist existe
      cy.get('#edit-category-suggestions').should('exist');
    });
  });

  describe('Envío del formulario', () => {
    it('Debe mostrar estado de carga al enviar', () => {
      cy.get('#edit-type').select('ingreso');
      cy.get('#edit-amount').clear().type('100');
      cy.get('#edit-category').clear().type('Salario');
      cy.get('#edit-date').clear().type('2024-01-15');

      cy.intercept('PUT', '**/rest/v1/transactions**', {
        delay: 1000,
        statusCode: 200,
        body: {}
      }).as('updateTransaction');

      cy.get('button[type="submit"]').click();

      cy.contains('Guardando...', { timeout: 2000 }).should('be.visible');
    });

    it('Debe deshabilitar el botón durante el envío', () => {
      cy.get('#edit-type').select('ingreso');
      cy.get('#edit-amount').clear().type('100');
      cy.get('#edit-category').clear().type('Salario');
      cy.get('#edit-date').clear().type('2024-01-15');

      cy.intercept('PUT', '**/rest/v1/transactions**', {
        delay: 1000,
        statusCode: 200,
        body: {}
      });

      cy.get('button[type="submit"]').click();
      cy.get('button[type="submit"]').should('be.disabled');
    });

    it('Debe mostrar mensaje de éxito después de actualizar', () => {
      cy.get('#edit-type').select('ingreso');
      cy.get('#edit-amount').clear().type('100');
      cy.get('#edit-category').clear().type('Salario');
      cy.get('#edit-date').clear().type('2024-01-15');

      cy.intercept('PUT', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: {
          id: '123',
          type: 'ingreso',
          amount: 100,
          category: 'Salario'
        }
      }).as('updateTransaction');

      cy.get('button[type="submit"]').click();
      cy.wait('@updateTransaction');

      cy.contains('Transacción actualizada exitosamente', { timeout: 3000 }).should('be.visible');
    });

    it('Debe mostrar mensaje de error si falla la actualización', () => {
      cy.get('#edit-type').select('ingreso');
      cy.get('#edit-amount').clear().type('100');
      cy.get('#edit-category').clear().type('Salario');
      cy.get('#edit-date').clear().type('2024-01-15');

      cy.intercept('PUT', '**/rest/v1/transactions**', {
        statusCode: 400,
        body: { error: 'Error al actualizar transacción' }
      }).as('updateTransactionError');

      cy.get('button[type="submit"]').click();
      cy.wait('@updateTransactionError');

      cy.get('.error-message', { timeout: 3000 }).should('be.visible');
    });
  });

  describe('Validación de campos vacíos', () => {
    it('Debe mostrar error si se envía el formulario vacío', () => {
      cy.get('#edit-type').select('');
      cy.get('#edit-amount').clear();
      cy.get('#edit-category').clear();
      cy.get('#edit-date').clear();

      cy.get('button[type="submit"]').click();

      cy.get('#edit-type').then(($input) => {
        const input = $input[0] as HTMLSelectElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe validar que el tipo esté seleccionado', () => {
      cy.get('#edit-amount').clear().type('100');
      cy.get('#edit-category').clear().type('Salario');
      cy.get('#edit-date').clear().type('2024-01-15');
      cy.get('#edit-type').select('');

      cy.get('button[type="submit"]').click();

      cy.get('#edit-type').then(($input) => {
        const input = $input[0] as HTMLSelectElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe validar que el monto esté ingresado', () => {
      cy.get('#edit-type').select('ingreso');
      cy.get('#edit-amount').clear();
      cy.get('#edit-category').clear().type('Salario');
      cy.get('#edit-date').clear().type('2024-01-15');

      cy.get('button[type="submit"]').click();

      cy.get('#edit-amount').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe validar que la categoría esté ingresada', () => {
      cy.get('#edit-type').select('ingreso');
      cy.get('#edit-amount').clear().type('100');
      cy.get('#edit-category').clear();
      cy.get('#edit-date').clear().type('2024-01-15');

      cy.get('button[type="submit"]').click();

      cy.get('#edit-category').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe validar que la fecha esté ingresada', () => {
      cy.get('#edit-type').select('ingreso');
      cy.get('#edit-amount').clear().type('100');
      cy.get('#edit-category').clear().type('Salario');
      cy.get('#edit-date').clear();

      cy.get('button[type="submit"]').click();

      cy.get('#edit-date').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });
  });

  describe('Placeholders', () => {
    it('El campo de monto debe tener placeholder', () => {
      cy.get('#edit-amount').should('have.attr', 'placeholder', '0.00');
    });

    it('El campo de categoría debe tener placeholder', () => {
      cy.get('#edit-category').should('have.attr', 'placeholder');
      cy.get('#edit-category').should('have.attr', 'placeholder', 'Ej: Salario, Comida, Transporte');
    });

    it('El campo de descripción debe tener placeholder', () => {
      cy.get('#edit-description').should('have.attr', 'placeholder');
    });
  });

  describe('Estilos y diseño', () => {
    it('Debe tener las clases CSS correctas', () => {
      cy.get('.transaction-form').should('exist');
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
      cy.get('label[for="edit-type"]').should('exist');
      cy.get('label[for="edit-amount"]').should('exist');
      cy.get('label[for="edit-category"]').should('exist');
      cy.get('label[for="edit-description"]').should('exist');
      cy.get('label[for="edit-date"]').should('exist');
    });

    it('Los campos deben tener atributos required', () => {
      cy.get('#edit-type').should('have.attr', 'required');
      cy.get('#edit-amount').should('have.attr', 'required');
      cy.get('#edit-category').should('have.attr', 'required');
      cy.get('#edit-date').should('have.attr', 'required');
    });
  });

  describe('Validación de monto', () => {
    it('Debe rechazar montos negativos', () => {
      cy.get('#edit-amount').clear().type('-10');
      cy.get('#edit-amount').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });

    it('Debe aceptar montos con decimales', () => {
      cy.get('#edit-amount').clear().type('100.50');
      cy.get('#edit-amount').should('have.value', '100.50');
    });

    it('Debe rechazar montos menores a 0.01', () => {
      cy.get('#edit-amount').clear().type('0.005');
      cy.get('#edit-amount').then(($input) => {
        const input = $input[0] as HTMLInputElement;
        expect(input.validity.valid).to.be.false;
      });
    });
  });

  describe('Flujo completo', () => {
    it('Debe completar el flujo de editar una transacción de ingreso', () => {
      cy.get('#edit-type').select('ingreso');
      cy.get('#edit-amount').clear().type('500');
      cy.get('#edit-category').clear().type('Salario');
      cy.get('#edit-description').clear().type('Pago mensual actualizado');
      cy.get('#edit-date').clear().type('2024-01-15');

      cy.intercept('PUT', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: {
          id: '123',
          type: 'ingreso',
          amount: 500,
          category: 'Salario'
        }
      }).as('updateTransaction');

      cy.get('button[type="submit"]').click();
      cy.wait('@updateTransaction');

      cy.contains('Transacción actualizada exitosamente', { timeout: 3000 }).should('be.visible');
    });

    it('Debe completar el flujo de editar una transacción de egreso', () => {
      cy.get('#edit-type').select('egreso');
      cy.get('#edit-amount').clear().type('50');
      cy.get('#edit-category').clear().type('Comida');
      cy.get('#edit-description').clear().type('Almuerzo');
      cy.get('#edit-date').clear().type('2024-01-15');

      cy.intercept('PUT', '**/rest/v1/transactions**', {
        statusCode: 200,
        body: {
          id: '124',
          type: 'egreso',
          amount: 50,
          category: 'Comida'
        }
      }).as('updateTransaction');

      cy.get('button[type="submit"]').click();
      cy.wait('@updateTransaction');

      cy.contains('Transacción actualizada exitosamente', { timeout: 3000 }).should('be.visible');
    });
  });
});

