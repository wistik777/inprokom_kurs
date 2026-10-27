import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const apiTarget = env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:8000';

    return {
        plugins: [react(), tailwindcss()],
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: apiTarget,
                    changeOrigin: true,
                },
                '/storage': {
                    target: apiTarget,
                    changeOrigin: true,
                },
            },
        },
        build: {
            target: 'es2020',
            cssCodeSplit: true,
            sourcemap: false,
            chunkSizeWarningLimit: 900,
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (!id.includes('node_modules')) {
                            return undefined;
                        }
                        if (id.includes('react-dom') || id.includes('/react/') || id.includes('react-router')) {
                            return 'vendor-react';
                        }
                        return undefined;
                    },
                },
            },
        },
    };
});
