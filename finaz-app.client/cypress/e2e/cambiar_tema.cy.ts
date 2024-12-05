describe('Cambiar tema claro a oscuro', () => {
    it('Visitar página principal', () => {
        cy.visit('https://localhost:5173/');
        cy.contains('Inicio', { timeout: 6000 }).should('be.visible');
    });

    it('Cambiar tema y verificar cambio', () => {
        cy.get('html').should('have.attr', 'data-joy-color-scheme', 'light');

        cy.get('.Sidebar > :nth-child(2) > .MuiIconButton-variantOutlined').click();

        cy.get('html').should('have.attr', 'data-joy-color-scheme', 'dark');

        cy.wait(6000);

        cy.get('.Sidebar > :nth-child(2) > .MuiIconButton-variantOutlined').click();

        cy.get('html').should('have.attr', 'data-joy-color-scheme', 'light');
    });
});
