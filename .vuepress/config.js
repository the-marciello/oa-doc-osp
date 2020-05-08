module.exports = {
    title: 'OA Docs',
    description: '',
    themeConfig: {
        nav: [
            { text: 'OA', link: 'https://offlineagency.it' },
            { text: 'Github', link: 'https://github.com/offline-agency' },
        ],
        sidebar: 'auto',
        footer: 'auto'
        },
    locales:{
        '/': {
            lang: 'English',
            title: 'OA-DOC',
            description: ''
        },
        '/it/': {
            lang: 'Italian',
            title: 'OA-DOC',
            description: ''
        }
    },
    plugins: [
        [
            'vuepress-plugin-clean-urls',
            {
                normalSuffix: '/',
                indexSuffix: '/',
                notFoundPath: '/404.html',
            },
        ],
    ],
    };