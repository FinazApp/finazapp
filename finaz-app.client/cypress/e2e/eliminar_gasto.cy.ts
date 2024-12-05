describe('Eliminar gastos', () => {
    it('Ir a vista de gastos', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/bills"]').click();
    });

    it('Eliminar gasto', () => {
        cy.get('tbody tr').first().find('button').click();
        cy.contains('Eliminar').click();
        cy.contains('Eliminando').should('be.visible');
        cy.get('button').contains('Confirmar').click();
    });

    it('Verificar gasto eliminado', () => {
        cy.contains('Eliminado').should('be.visible');
    });
})