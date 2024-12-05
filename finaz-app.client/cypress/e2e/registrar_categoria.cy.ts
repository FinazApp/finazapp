describe('Registrar categoría', () => {
    it('Ir a vista de categorías', () => {
        cy.visit('https://localhost:5173');
        cy.get('a[href="/categories"]').click();
    });

    it('Crear categoría', () => {
        cy.get('button').contains('Crear nueva').click();
        cy.get('input[name="nombre"]').type('Prueba');
        cy.get('textarea[name="descripcion"]').type('Esta es una prueba');
        cy.get('button.MuiButton-root:nth-child(3)').click();
        cy.contains('creada correctamente', { timeout: 6000 }).should('be.visible');
    });

    it('Verificar categoría', () => {
        cy.get('b').contains('Prueba').should('be.visible');
        cy.get('td').contains('Esta es una prueba').should('be.visible');
    });
})