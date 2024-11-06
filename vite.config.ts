import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/weather': {
                target: 'https://api.openweathermap.org',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/weather/, ''),
            },
        },
    },
});
