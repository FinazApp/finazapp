describe('Restaurar categorías', () => {
    it('Ir a vista de categorías', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/categories"]').click();
    });

    it('Restaurar categorías', () => {
        cy.get('tbody tr').first().find('button').click();
        cy.contains('Restaurar').click();
        cy.contains('Restaurando').should('be.visible');
        cy.get('button').contains('Confirmar').click();
    });

    it('Verificar categorías restauradas', () => {
        cy.contains('Activo').should('be.visible');
    });
})