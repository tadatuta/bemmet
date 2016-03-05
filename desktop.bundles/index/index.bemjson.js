module.exports = {
    block : 'page',
    title : 'bemmet online',
    favicon : 'favicon.ico',
    head : [
        { elem : 'meta', attrs : { name : 'description', content : 'Demo project to show bemmet in action.' } },
        { elem : 'meta', attrs : { name : 'viewport', content : 'width=device-width, initial-scale=1' } },
        { elem : 'css', url : 'index.min.css' }
    ],
    scripts: [{ elem : 'js', url : 'index.min.js' }],
    mods : { theme : 'islands' },
    content : [
        {
            block : 'header',
            content : [
                'This is ',
                {
                    block : 'link',
                    mods : { theme: 'islands', size: 'm' },
                    url : 'https://github.com/tadatuta/bemmet',
                    content : 'bemmet'
                },
                ' demo. Just put in your shortcut and press &lt;tab&gt;.'
            ]
        },
        {
            block : 'main',
            content : {
                block : 'textarea',
                mods : { theme : 'islands', size : 'm', width : 'available' },
                val : 'nav_theme_islands>__item*3>link_theme_islands{some text}'
            }
        }
    ]
};
