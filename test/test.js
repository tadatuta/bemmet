var EOL = require('os').EOL,
    assert = require('assert'),
    inspect = require('util').inspect,
    bemmet = require('..');

var tests = [
    {
        shortcut: 'b1>__e1*2>b3_theme_islands+_state_active',
        reference: {
            block: 'b1',
            content: [
                {
                    block: 'b1',
                    elem: 'e1',
                    content: [
                        {
                            block: 'b3',
                            mods: { theme: 'islands' },
                            content: {}
                        },
                        {
                            block: 'b1',
                            mods: { state: 'active' },
                            content: {}
                        }
                    ]
                },
                {
                    block: 'b1',
                    elem: 'e1',
                    content: [
                        {
                            block: 'b3',
                            mods: { theme: 'islands' },
                            content: {}
                        },
                        {
                            block: 'b1',
                            mods: { state: 'active' },
                            content: {}
                        }
                    ]
                }
            ]
        }
    },
    {
        shortcut: 'b1>__e1{some content}*2',
        reference: {
            block: 'b1',
            content: [
                {
                    block: 'b1',
                    elem: 'e1',
                    content: 'some content'
                },
                {
                    block: 'b1',
                    elem: 'e1',
                    content: 'some content'
                }
            ]
        }
    },
    {
        shortcut: 'parent > __e1{content of b1} + __e2{some other content}',
        reference: {
            block: 'parent',
            content: [
                {
                    block: 'parent',
                    elem: 'e1',
                    content: 'content of b1'
                },
                {
                    block: 'parent',
                    elem: 'e2',
                    content: 'some other content'
                }
            ]
        }
    },
    {
        shortcut: 'parent > __e1{content of b1} + __e2{some other content}*2',
        reference: {
            block: 'parent',
            content: [
                {
                    block: 'parent',
                    elem: 'e1',
                    content: 'content of b1'
                },
                {
                    block: 'parent',
                    elem: 'e2',
                    content: 'some other content'
                },
                {
                    block: 'parent',
                    elem: 'e2',
                    content: 'some other content'
                }
            ]
        }
    },
    {
        shortcut: 'b1{some text}*2',
        reference: [
            {
                block: 'b1',
                content: 'some text'
            },
            {
                block: 'b1',
                content: 'some text'
            }
        ]
    },
    {
        shortcut: 'b1>__e1*2>b3--islands+--active',
        naming: { elem: '__', mod: '--' },
        reference: {
            block: 'b1',
            content: [
                {
                    block: 'b1',
                    elem: 'e1',
                    content: [
                        {
                            block: 'b3',
                            mods: { islands: true },
                            content: {}
                        },
                        {
                            block: 'b1',
                            mods: { active: true },
                            content: {}
                        }
                    ]
                },
                {
                    block: 'b1',
                    elem: 'e1',
                    content: [
                        {
                            block: 'b3',
                            mods: { islands: true },
                            content: {}
                        },
                        {
                            block: 'b1',
                            mods: { active: true },
                            content: {}
                        }
                    ]
                }
            ]
        }
    },
    {
        shortcut: 'b1+b2*2',
        reference: [
            {
                block: 'b1',
                content: {}
            },
            {
                block: 'b2',
                content: {}
            },
            {
                block: 'b2',
                content: {}
            }
        ]
    },
    {
        shortcut: '(b1+b2)*2',
        reference: [
            {
                block: 'b1',
                content: {}
            },
            {
                block: 'b2',
                content: {}
            },
            {
                block: 'b1',
                content: {}
            },
            {
                block: 'b2',
                content: {}
            }
        ]
    },
    {
        shortcut: 'b1>__e1',
        stringify: true,
        reference: [
            "{",
            "    block: 'b1',",
            "    content: {",
            "        block: 'b1',",
            "        elem: 'e1',",
            "        content: {}",
            "    }",
            "}"
        ].join(EOL)
    }
];

tests.forEach(function(test, idx) {
    var result = test.stringify ?
            bemmet.stringify(test.shortcut, { naming: test.naming }) :
            bemmet(test.shortcut, { naming: test.naming });

    try {
        assert.deepEqual(result, test.reference, 'Test #' + idx + ' failed');
    } catch(err) {
        console.log('result', result);
        console.log('expected', test.reference);
        throw new Error(err);
    }
});
