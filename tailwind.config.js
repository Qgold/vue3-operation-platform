/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{vue,js,ts,jsx,tsx}",  // 添加 Vue 文件路径
    ],
    theme: {
      extend: {
        // '100':'25rem',
      },
    },
    plugins: [],
    darkMode: 'media'
}
