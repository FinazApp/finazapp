describe('Registrar gasto', () => {
    it('Ir a vista de gastos', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/bills"]').click();
    });

    it('Crear gasto', () => {
        cy.get('button').contains('Agregar nuevo gasto').click();
        cy.get('input[name="nombre"]').type('Prueba');
        cy.get('input[name="monto"]').clear();
        cy.get('input[name="monto"]').type('50');
        cy.get('button[name="categoriaId"]').type('{downarrow}{enter}');
        cy.get('button').contains('Agregar gasto').click();
        cy.contains('Gasto agregado correctamente', { timeout: 100000 }).should('be.visible');
    });

    it('Verificar gasto', () => {
        cy.get('b').contains('Prueba').should('be.visible');
        cy.get('td').contains('50.00').should('be.visible');
    });
})