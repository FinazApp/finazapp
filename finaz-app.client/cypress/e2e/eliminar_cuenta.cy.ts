describe('Eliminar cuenta', () => {
    it('Visitar pagina principal', () => {
        cy.visit('https://localhost:5173/');
        cy.contains('Inicio', { timeout: 6000 }).should('be.visible');
    });

    it('Eliminar cuenta', () => {
        cy.get('button[aria-haspopup="menu"]').click();
        cy.contains('Perfil').click();
    });

    it('Verificar botón de eliminar', () => {
        cy.contains('Editar', { timeout: 6000 }).should('be.visible');
        cy.get('button').contains('Eliminar cuenta').click();
    })

    it('Verificar cuenta eliminada', () => {
        cy.contains('eliminada', { timeout: 6000 }).should('be.visible');
        cy.url().should('include', '/login');
    });
})