describe('Editar metas de ahorro', () => {
    it('Ir a vista de metas de ahorro', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/savings"]').click();
    });

    it('Editar meta de ahorro', () => {
        cy.get('tbody tr').first().find('button').click();
        cy.contains("Editar").click();

        cy.get('input[name="nombre"]').clear().type('Prueba prueba');
        cy.get('input[name="montoObjetivo"]').clear().type('30000');
        cy.get('input[name="fechaMeta"]').clear().type('2026-06-15');

        cy.get('form > .MuiButton-root').click();
    });

    it('Verificar meta de ahorro editada', () => {
        cy.get('b').contains('Prueba prueba').should('be.visible');
        cy.get('td').contains('30,000.00').should('be.visible');
        cy.get('td').contains('2026-06-15').should('be.visible');
    });
});
