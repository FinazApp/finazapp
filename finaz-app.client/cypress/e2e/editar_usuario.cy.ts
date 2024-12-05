describe('Editar información de perfil', () => {
    it('Visitar pagina principal', () => {
        cy.visit('https://localhost:5173/');
        cy.contains('Inicio', { timeout: 6000 }).should('be.visible');
    });

    it('Abrir perfil', () => {
        cy.get('button[aria-haspopup="menu"]').click();
        cy.contains('Perfil').click();
    });

    it('Editar información de perfil', () => {
        const fotoPerfil = 'chill_guy.jpg';

        cy.contains('Editar', { timeout: 6000 }).should('be.visible');
        cy.get('input[name="nombre"]').clear();
        cy.get('input[name="nombre"]').type('Prueba prueba');
        cy.get('input[name="correoElectronico"]').clear();
        cy.get('input[name="correoElectronico"]').type('pruebaprueba@finazapp.com')
        cy.get('input[type="file"]').attachFile(fotoPerfil);
    })

    it('Verificar cambios', () => {
        cy.contains('Guardar cambios').click();
        cy.contains('Perfil de usuario actualizado correctamente', { timeout: 6000 }).should('be.visible');
    })
})