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
            title: 'Offline Agency Docs',
            description: ''
        },
        '/it/': {
            lang: 'Italian',
            title: 'Offline Agency Docs',
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
        [
            'vuepress-plugin-container',
            {
                type: 'right',
                defaultTitle: '',
            },
        ],
        [
            'vuepress-plugin-container',
            {
                type: 'theorem',
                before: info => `<div class="theorem"><p class="title">${info}</p>`,
                after: '</div>',
            },
        ],
        // this is how VuePress Default Theme use this plugin
        [
            'vuepress-plugin-container',
            {
                type: 'tip',
                defaultTitle: {
                    '/': 'TIP',
                    '/zh/': '提示',
                },
            },
        ],
        [
            '@vuepress/google-analytics',
            {
                'ga': '' // UA-00000000-0
            }
        ],
        ['@vuepress/last-updated']
    ],
    };
