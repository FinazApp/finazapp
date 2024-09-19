const { defineConfig } = require('cypress')

module.exports = defineConfig({
    e2e: {
        baseUrl: 'https://localhost:5174/',
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: false,
        chromeWebSecurity: false,
    },
    env: {
        apiUrl: 'https://localhost:7111'
    }
})