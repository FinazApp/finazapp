describe('Editar gastos', () => {
    it('Ir a vista de gastos', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/bills"]').click();
    });

    it('Editar gasto', () => {
        cy.get('tbody tr').first().find('button').click();
        cy.contains("Editar").click();
        cy.get('input[name="nombre"]').clear();
        cy.get('input[name="nombre"]').type('Prueba prueba');
        cy.get('input[name="monto"]').clear();
        cy.get('input[name="monto"]').type('45');
        cy.contains('Guardar cambios').click();
    });

    it('Verificar gasto editado', () => {
        cy.get('b').contains('Prueba prueba').should('be.visible');
        cy.get('td').contains('45.00').should('be.visible');
    })
})