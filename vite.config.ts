// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: true,      // network par access ke liye
//     port: 5173,       // optional
//     proxy: {
//       '/api': {       // frontend requests /api se start honi chahiye
//         target: 'http://localhost:5000', // backend
//         changeOrigin: true,
//         secure: false,
//       }
//     }
//   },
// })





import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    fs: {
      allow: ['.'] // allow entire project folder (careful!)
    }
  }
});
