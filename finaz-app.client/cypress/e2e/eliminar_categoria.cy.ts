describe('Eliminar categorías', () => {
    it('Ir a vista de categorías', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/categories"]').click();
    });

    it('Eliminar categorías', () => {
        cy.get('tbody tr').first().find('button').click();
        cy.contains('Eliminar').click();
        cy.contains('Eliminando').should('be.visible');
        cy.get('button').contains('Confirmar').click();
    });

    it('Verificar categorías eliminadas', () => {
        cy.contains('Eliminado').should('be.visible');
    });
})