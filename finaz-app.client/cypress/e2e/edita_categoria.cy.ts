describe('Editar categorías', () => {
    it('Ir a vista de categorías', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/categories"]').click();
    });

    it('Editar categorías', () => {
        cy.get('tbody tr').first().find('button').click();
        cy.contains("Editar").click();
        cy.get('input[name="nombre"]').clear();
        cy.get('input[name="nombre"]').type('Prueba prueba');
        cy.get('textarea[name="descripcion"]').clear();
        cy.get('textarea[name="descripcion"]').type('Esta es una prueba de la prueba');
        cy.contains('Guardar cambios').click();
    });

    it('Verificar categorías editadas', () => {
        cy.get('b').contains('Prueba prueba').should('be.visible');
        cy.get('td').contains('Esta es una prueba de la prueba').should('be.visible');
    })
})