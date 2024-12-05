describe('Visualizar información de perfil', () => {
    it('Visitar pagina principal', () => {
        cy.visit('https://localhost:5173/');
        cy.contains('Inicio', { timeout: 6000 }).should('be.visible');
    });

    it('Abrir perfil', () => {
        cy.get('button[aria-haspopup="menu"]').click();
        cy.contains('Perfil').click();
    });
})