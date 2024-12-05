describe('Restaurar ingresos', () => {
    it('Ir a vista de ingresos', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/incomes"]').click();
    });

    it('Restaurar ingreso', () => {
        cy.get('tbody tr').first().find('button').click();
        cy.contains('Restaurar').click();
        cy.contains('Restaurando').should('be.visible');
        cy.get('button').contains('Confirmar').click();
    });

    it('Verificar ingreso restaurado', () => {
        cy.contains('Activo').should('be.visible');
    });
})