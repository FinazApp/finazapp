describe('Restaurar gastos', () => {
    it('Ir a vista de gastos', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/bills"]').click();
    });

    it('Restaurar gasto', () => {
        cy.get('tbody tr').first().find('button').click();
        cy.contains('Restaurar').click();
        cy.contains('Restaurando').should('be.visible');
        cy.get('button').contains('Confirmar').click();
    });

    it('Verificar gasto restaurado', () => {
        cy.contains('Activo').should('be.visible');
    });
})