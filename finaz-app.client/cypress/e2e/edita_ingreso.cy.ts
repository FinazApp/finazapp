describe('Editar ingresos', () => {
    it('Ir a vista de ingresos', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/incomes"]').click();
    });

    it('Editar ingreso', () => {
        cy.get('tbody tr').first().find('button').click();
        cy.contains("Editar").click();
        cy.get('input[name="nombre"]').clear();
        cy.get('input[name="nombre"]').type('Prueba prueba');
        cy.get('input[name="monto"]').clear();
        cy.get('input[name="monto"]').type('150');
        cy.contains('Guardar cambios').click();
    });

    it('Verificar ingreso editado', () => {
        cy.get('b').contains('Prueba prueba').should('be.visible');
        cy.get('td').contains('150.00').should('be.visible');
    })
})