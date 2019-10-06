module.exports = {
    title: 'OA Docs',
    description: '',
    themeConfig: {
        nav: [
            { text: 'OA', link: 'https://offlineagency.it' },
            { text: 'Github', link: 'https://github.com/offline-agency' },
        ],
        sidebar: [
                {
                    title: 'Laravel',
                    children: [
                        '/laravel/laravel-mongo-auto-sync',
                        '/laravel/laravel-fatture-in-cloud'
                    ]
                },
                {
                    title: 'Other',
                    children: [
                        '/other/repo-name'
                    ]
                },
                'about-us'

            ],

        }

    };