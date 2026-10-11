import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(({ mode }) => {
    // 加载环境变量
    const env = loadEnv(mode, process.cwd())

    return {
        plugins: [
            vue(),
            // 使用逗号分隔，正确闭合括号
            AutoImport({
                resolvers: [ElementPlusResolver()]
            }),
            Components({
                resolvers: [ElementPlusResolver()]
            }),
        ],
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: `@use "@/styles/variable" as *;`,
                },
            },
        },

        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },

        build: {
            rollupOptions: {
                output: {
                    manualChunks(id) {
                        if (!id.includes('node_modules')) return
                        // Element Plus 单独分包（体积较大）
                        if (id.includes('element-plus') && !id.includes('@element-plus/icons-vue')) {
                            return 'element-plus'
                        }
                        if (id.includes('@element-plus/icons-vue')) {
                            return 'element-icons'
                        }
                        // Vue 生态
                        if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
                            return 'vue-vendor'
                        }
                        if (id.includes('axios')) {
                            return 'axios'
                        }
                        // 其余第三方包
                        return 'vendor'
                    },
                    chunkFileNames: 'assets/js/[name]-[hash].js',
                    entryFileNames: 'assets/js/[name]-[hash].js',
                    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
                },
            },
        },

        // 添加服务器配置（包括代理）
        server: {
            // port: 8081,
            proxy: {
                '/api': {
                    target: env.VITE_SERVE, // 指向.env.development中的后端地址
                    changeOrigin: true,     // 允许跨域
                    rewrite: (path) => path.replace(/^\/api/, ''), // 去掉/api前缀
                },
                '/ws': {
                    target: env.VITE_SERVE, // WebSocket代理
                    changeOrigin: true,     // 允许跨域
                    ws: true, // 启用WebSocket代理
                    rewrite: (path) => path.replace(/^\/ws/, ''), // 去掉/ws前缀
                }
            }
        }
    }
})