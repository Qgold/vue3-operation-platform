export default {
  // 站点配置
  title: '我的个人网站',
  description: '使用 VitePress 搭建的个人网站',

  // 主题配置
  themeConfig: {
    locales: {
        '/': {
          label: '中文',
          lang: 'zh-CN'
        },
        '/en/': {
          label: 'English',
          lang: 'en-US',
          title: 'My Project'
        }
    },
    // 导航栏
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      { text: '关于', link: '/about' }
    ],

    // 侧边栏
    sidebar: {
      '/blog/': [
        {
          text: '博客文章',
          items: [
            { text: 'React相关', link: '/blog/article-1' },
            { text: 'Vue相关', link: '/blog/article-2' },
            { text: 'IDE相关', link: '/blog/ide' },
            { text: '其他', link: '/blog/other' }
          ]
        }
      ]
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-account' }
    ],

    // 页脚
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2025-present 张煜'
    }
  }
} 