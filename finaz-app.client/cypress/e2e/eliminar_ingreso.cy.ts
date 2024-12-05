describe('Eliminar ingresos', () => {
    it('Ir a vista de ingresos', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/incomes"]').click();
    });

    it('Eliminar ingresos', () => {
        cy.get('tbody tr').first().find('button').click();
        cy.contains('Eliminar').click();
        cy.contains('Eliminando').should('be.visible');
        cy.get('button').contains('Confirmar').click();
    });

    it('Verificar ingresos eliminados', () => {
        cy.contains('Eliminado').should('be.visible');
    });
})