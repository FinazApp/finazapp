describe('Registrar metas de ahorro', () => {
    it('Ir a vista de metas de ahorro', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/savings"]').click();
    });

    it('Crear meta de ahorro', () => {
        cy.get('button').contains('Agregar meta de ahorro').click();
        cy.get('input[name="nombre"]').type('Prueba');
        cy.get('input[name="montoObjetivo"]').clear();
        cy.get('input[name="montoObjetivo"]').type('20000');
        cy.get('input[name="fechaMeta"]').type('2025-05-10');
        cy.get('form > .MuiButton-root').click();
    });

    it('Verificar meta de ahorro', () => {
        cy.contains('Meta de ahorro agregada correctamente', { timeout: 6000 }).should('be.visible');
        cy.get('b').contains('Prueba').should('be.visible');
        cy.get('td').contains('20,000.00').should('be.visible');
    });

    /*
    it('Agregar abono al ahorro', () => {
        cy.get('tbody tr').first().find('button').click();
        cy.contains("Agregar fondo").click();
        cy.contains("Agregar fondo").should('be.visible');
        cy.get('input[name="nuevoFondo"]').clear();
        cy.get('input[name="nuevoFondo"]').type('5');
        cy.get('form > .MuiButton-root').click();
    })
    */
})