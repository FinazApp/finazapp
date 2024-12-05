describe('Eliminar metas de ahorro', () => {
    it('Ir a vista de metas de ahorro', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/savings"]').click();
    });

    it('Eliminar meta de ahorro', () => {
        cy.get('tbody tr').first().find('button').click();
        cy.contains('Eliminar').click();
        cy.contains('Eliminando').should('be.visible');
        cy.get('.MuiDialogActions-root > .MuiButton-variantSolid').click();
    });

    it('Verificar meta de ahorro eliminada', () => {
        cy.contains('Eliminado').should('be.visible');
    });
})