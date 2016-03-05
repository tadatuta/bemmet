var EOL = require('os').EOL,
    assert = require('assert'),
    inspect = require('util').inspect,
    bemmet = require('..');

var tests = [
    {
        abbreviation: 'b1>__e1*2>b3_theme_islands+_state_active',
        reference: {
            block: 'b1',
            content: [
                {
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
        abbreviation: 'b1>__e1{some content}*2',
        reference: {
            block: 'b1',
            content: [
                {
                    elem: 'e1',
                    content: 'some content'
                },
                {
                    elem: 'e1',
                    content: 'some content'
                }
            ]
        }
    },
    {
        abbreviation: 'parent>__e1{content of b1}+__e2{some other content}',
        reference: {
            block: 'parent',
            content: [
                {
                    elem: 'e1',
                    content: 'content of b1'
                },
                {
                    elem: 'e2',
                    content: 'some other content'
                }
            ]
        }
    },
    {
        abbreviation: 'parent>__e1{content of b1}+__e2{some other content}*2',
        reference: {
            block: 'parent',
            content: [
                {
                    elem: 'e1',
                    content: 'content of b1'
                },
                {
                    elem: 'e2',
                    content: 'some other content'
                },
                {
                    elem: 'e2',
                    content: 'some other content'
                }
            ]
        }
    },
    {
        abbreviation: 'b1{some text}*2',
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
        abbreviation: 'b1>__e1*2>b3--islands+--active',
        naming: { elem: '__', mod: '--' },
        reference: {
            block: 'b1',
            content: [
                {
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
        abbreviation: 'b1+b2*2',
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
        abbreviation: '(b1+b2)*2',
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
        abbreviation: 'b1>__e1',
        stringify: true,
        reference: [
            "{",
            "    block: 'b1',",
            "    content: {",
            "        elem: 'e1',",
            "        content: {}",
            "    }",
            "}"
        ].join(EOL)
    },
    {
        abbreviation: 'b1__e1+__e1',
        parentBlock: 'b2',
        reference: [
            {
                block: 'b1',
                elem: 'e1',
                content: {}
            },
            {
                block: 'b2',
                elem: 'e1',
                content: {}
            }
        ]
    },
    {
        abbreviation: '__e1',
        stringify: true,
        parentBlock: 'b1',
        reference: [
            "{",
            "    block: 'b1',",
            "    elem: 'e1',",
            "    content: {}",
            "}"
        ].join(EOL)
    },
    {
        abbreviation: 'b1+b2>b3__e1',
        reference: [
            {
                block: 'b1',
                content: {}
            },
            {
                block: 'b2',
                content: {
                    block: 'b3',
                    elem: 'e1',
                    content: {}
                }
            }
        ]
    },
    {
        abbreviation: '__e1+b2__e2>__e3',
        parentBlock: 'b1',
        reference: [
            {
                block: 'b1',
                elem: 'e1',
                content: {}
            },
            {
                block: 'b2',
                elem: 'e2',
                content: {
                    elem: 'e3',
                    content: {}
                }
            }
        ]
    },
    {
        abbreviation: '__e1+b2__e2+b3_m1>__e3',
        parentBlock: 'b1',
        reference: [
            {
                block: 'b1',
                elem: 'e1',
                content: {}
            },
            {
                block: 'b2',
                elem: 'e2',
                content: {}
            },
            {
                block: 'b3',
                mods: { m1: true },
                content: {
                    elem: 'e3',
                    content: {}
                }
            }
        ]
    },
    {
        abbreviation: 'b1__e1_m1_v1',
        reference: {
            block: 'b1',
            elem: 'e1',
            elemMods: {
                m1: 'v1'
            },
            content: {}
        }
    },
    {
        abbreviation: '__e1',
        reference: {
            elem: 'e1',
            content: {}
        }
    },
    {
        abbreviation: '_m1',
        reference: {
            mods: { m1: true },
            content: {}
        }
    },
    {
        abbreviation: '_m1>__e1',
        reference: {
            mods: { m1: true },
            content: {
                elem: 'e1',
                content: {}
            }
        }
    },
    {
        abbreviation: 'so_me_unparseable_stri_ng',
        reference: 'so_me_unparseable_stri_ng'
    }
];

tests.forEach(function(test, idx) {
    var result = test.stringify ?
            bemmet.stringify(test.abbreviation, test.parentBlock, { naming: test.naming }) :
            bemmet(test.abbreviation, test.parentBlock, { naming: test.naming });

    try {
        assert.deepEqual(result, test.reference, 'Test #' + idx + ' failed');
    } catch(err) {
        console.log('abbreviation', test.abbreviation);
        console.log('result', result);
        console.log('expected', test.reference);
        throw new Error(err);
    }
});
