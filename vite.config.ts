import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    host: "0.0.0.0",
	  port: 8080,
    /*
    proxy: {
      "/api": {
        target: "https://discord-unity-app.fly.dev",
        changeOrigin: true,
        secure: true,
        ws: true,
      },
    },
    */
    hmr: {
      clientPort: 443,
    }
  },
  //envDir: "../"
})

