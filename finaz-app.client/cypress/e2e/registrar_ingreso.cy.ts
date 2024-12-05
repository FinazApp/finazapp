describe('Registrar ingreso', () => {
    it('Ir a vista de ingresos', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/incomes"]').click();
    });

    it('Crear ingreso', () => {
        cy.get('button').contains('Agregar nuevo ingreso').click();
        cy.get('input[name="nombre"]').type('Prueba');
        cy.get('input[name="monto"]').clear();
        cy.get('input[name="monto"]').type('100');
        cy.get('button[name="categoriaId"]').type('{downarrow}{enter}');
        cy.get('button').contains('Agregar ingreso').click();
        cy.contains('Ingreso agregado correctamente', { timeout: 6000 }).should('be.visible');
    });

    it('Verificar ingreso', () => {
        cy.get('b').contains('Prueba').should('be.visible');
        cy.get('td').contains('100.00').should('be.visible');
    });
})