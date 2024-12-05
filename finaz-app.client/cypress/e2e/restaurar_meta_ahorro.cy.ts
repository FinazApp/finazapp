describe('Restaurar metas de ahorro', () => {
    it('Ir a vista de metas de ahorro', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/savings"]').click();
    });

    it('Restaurar meta de ahorro', () => {
        cy.get('tbody tr').first().find('button').click();
        cy.contains('Restaurar').click();
        cy.contains('Restaurando').should('be.visible');
        cy.get('button').contains('Confirmar').click();
    });

    it('Verificar meta de ahorro restaurada', () => {
        cy.contains('Activo').should('be.visible');
    });
})