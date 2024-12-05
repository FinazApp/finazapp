describe('Iniciar sesión', () => {
    it('Visitar la página de inicio de sesión', () => {
        cy.visit('/login');
        cy.contains('Eres nuevo', { timeout: 60000 }).should('be.visible');
    });

    it('Ingresar datos de inicio de sesión', () => {
        cy.get('input[name="correoElectronico"]').type('prueba@finazapp.com');
        cy.get('input[name="passwordHash"]').type('prueba123');
    });

    it('Enviar datos de sesión', () => {
        cy.contains('Ingresar').click();
        cy.contains('Inicio', { timeout: 60000 }).should('be.visible');
    })
})