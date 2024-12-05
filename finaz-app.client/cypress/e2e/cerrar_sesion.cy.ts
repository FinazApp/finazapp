describe('Cerrar sesión', () => {
    it('Visitar pagina principal', () => {
        cy.visit('https://localhost:5173/');
        cy.contains('Inicio', { timeout: 6000 }).should('be.visible');
    });

    it('Cerrar sesión', () => {
        cy.get('button[aria-haspopup="menu"]').click();
        cy.contains('Cerrar').click();
    });

    it('Verificar sesión', () => {
        cy.contains('cerrada', { timeout: 6000 }).should('be.visible');
        cy.url().should('include', '/login');
    });
})