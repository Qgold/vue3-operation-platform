import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer';

import viteCompression from 'vite-plugin-compression';
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    legacy({
      targets:['defaults','not IE 11']
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    visualizer({
      open: true,
      filename: 'dist/stats.html',
    }),
    viteCompression({
      algorithm: 'gzip', // 也可以是 'brotliCompress'
      ext: '.gz',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')  // 添加 @ 别名配置
    }
  },
  optimizeDeps: {
    exclude: ['@assemblyscript/loader']
  },
  assetsInclude: ['**/*.wasm'],
  publicDir: 'build',
  css: {
    preprocessorOptions: {
      less: {
        // Less 配置选项
        javascriptEnabled: true, // 启用 JavaScript 表达式
        // 如果需要全局变量，可以在这里添加
        additionalData: `
          @import "@/styles/variables.less";
        `
      }
    }
  },
  // build:{
  //   rollupOptions:{
  //     output:{
  //       experimentalMinChunkSize:20 * 1024,
  //       manualChunks(id){
  //         manualChunks:{
  //           vendor:['vue','vue-router','axios']
  //         }
  //       }
  //     }
  //   }
  // }
})
      