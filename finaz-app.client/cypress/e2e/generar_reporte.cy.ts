/*
const path = require('path');
const fs = require('fs');

describe('Generar informe o reporte', () => {
    const carpetaDescargas: string = Cypress.config('downloadsFolder');

    beforeEach(() => {
        cy.visit('https://localhost:5173/');
        cy.contains('Inicio', { timeout: 6000 }).should('be.visible');
    });

    it('Generar y verificar el reporte descargado', () => {
        const archivosAntes: string[] = fs.readdirSync(carpetaDescargas);
        const archivosParaEliminar: string[] = archivosAntes.filter(archivo => archivo.startsWith('reporte'));

        archivosParaEliminar.forEach(archivo => fs.unlinkSync(path.join(carpetaDescargas, archivo)));

        cy.get('button').contains('Descargar reporte').click();

        cy.wait(10000);

        const archivosDespues: string[] = fs.readdirSync(carpetaDescargas);
        const archivoDescargado: string | undefined = archivosDespues.find(archivo => archivo.startsWith('reporte'));

        expect(archivoDescargado).to.exist;
    });
});
*/