import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: 'https://localhost:5173',
        testIsolation: false,
        defaultCommandTimeout: 60000,
        setupNodeEvents(_on, _config) {
            
        },
    },
});
