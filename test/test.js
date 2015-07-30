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

    assert.deepEqual(result, test.reference, 'Test #' + idx + ' failed');
});
