import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    base: "bip47-verifier",
    plugins: [
        react(),
    ],
})
