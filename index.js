var bemNaming = require('bem-naming'),
    stringifyObj = require('stringify-object'),
    parser = require('emmet/lib/parser/abbreviation');

function expandBemjson(abbreviation, parentBlock, opts) {
    if (typeof parentBlock === 'object') {
        opts = parentBlock;
        parentBlock = null;
    }

    opts || (opts = {});
    var naming = bemNaming(opts.naming);

    function isShortcut(item) {
        return (item[0] === naming.elemDelim[0]) || (item[0] === naming.modDelim[0]);
    }

    function getParent(tree) {
        var parent = tree.parent,
            name = parent.name();

        if (!parent || !name) return;

        return isShortcut(name) ? getParent(parent) : bemNaming.parse(name).block;
    }

    function walk(tree) {
        if (!tree.abbreviation) {
            var bemjson = tree.children.map(walk);
            if (!bemjson.length) return;
            return bemjson.length === 1 ? bemjson[0] : bemjson;
        }

        var item = tree.name(),
            parent = getParent(tree);

        if (isShortcut(item)) {
            item = (parent || parentBlock || 'parentBlockStubPlaceholder') + item;
        }

        var entity = naming.parse(item);
        if (!entity) return item;

        var content = (tree.content ? [tree.content] : [])
                .concat(tree.children.map(walk));

        if (entity.modName) {
            entity.block === 'parentBlockStubPlaceholder' && (entity.block === 'parent');

            var modFieldName = entity.elem ? 'elemMods' : 'mods';

            entity[modFieldName] = {};
            entity[modFieldName][entity.modName] = entity.modVal;
            delete entity.modName;
            delete entity.modVal;
        }

        // remove block field if it matches its parent block name
        if (naming.isElem(entity) && entity.block === parent || entity.block === 'parentBlockStubPlaceholder') {
            delete entity.block;
        }

        if (!content.length) {
            entity.content = {};
        } else {
            entity.content = content.length === 1 ? content[0] : content;
        }

        return entity;
    }

    var tree = parser.parse(abbreviation);

    return walk(tree);
};

module.exports = expandBemjson;
module.exports.stringify = function(abbreviation, parentBlock, opts) {
    if (typeof parentBlock === 'object') {
        opts = parentBlock;
        parentBlock = null;
    }

    opts || (opts = {});
    opts.indent || (opts.indent = '    ');

    var bemjson = expandBemjson(abbreviation, parentBlock, opts);

    return typeof bemjson === 'string' ? bemjson : stringifyObj(bemjson, opts);
};
