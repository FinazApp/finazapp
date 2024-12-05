describe('Registrar usuario', () => {
    it('Visitar la página de registro', () => {
        cy.visit('/register');
        cy.contains('Registro', { timeout: 60000 }).should('be.visible');
    });

    it('Ingresar datos de registro', () => {
        cy.get('input[name="nombre"]').type('Prueba');
        cy.get('input[name="correoElectronico"]').type('prueba@finazapp.com');
        cy.get('input[name="passwordHash"]').type('prueba123');
    });

    it('Enviar datos de registro', () => {
        cy.contains('Registrarme').click();
        cy.contains('Usuario registrado exitosamente', { timeout: 60000 }).should('be.visible');
        cy.url().should('include', '/login');
    });
})