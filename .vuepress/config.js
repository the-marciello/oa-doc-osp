module.exports = {
    title: 'Documentation | OFFLINE Agency',
    description: 'Documentation for our comprehensive packages.',
    head:[
        ['link', { rel: 'icon', href: '/favicon.png' }]
    ],
    themeConfig: {
        logo: 'https://offlineagency.it/build/oa-assets/img/oa-eb.png',
        nav: [
            { text: 'OA', link: 'https://offlineagency.it' },
            { text: 'GitHub', link: 'https://github.com/offline-agency' },
        ],
        sidebar: 'auto',
        footer: 'auto'
        },
    locales:{
        '/': {
            lang: 'English',
            title: 'Documentation | OFFLINE Agency',
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
                'ga': 'UA-107667272-18'
            }
        ],
        ['@vuepress/last-updated'],
    ],

    extendMarkdown: md => {
        md.use(require('markdown-it-footnote'))
    }

};
