var bemNaming = require('bem-naming'),
    stringifyObj = require('stringify-object');

var expandBemjson = function(str, opts) {
    opts || (opts = {});

    var naming = bemNaming(opts.naming),
        tree = str.split('>').reverse();

    function isShortcut(item) {
        return (item[0] === naming.elemDelim[0]) || (item[0] === naming.modDelim[0]);
    }

    function getParent(idx) {
        var parent;

        while(idx < tree.length) {
            idx++;
            parent = tree[idx].trim();

            if (!isShortcut(parent)) {
                return naming.parse(parent).block;
            }
        }
    }

    function expandEntities(content, item, idx) {
        // E.g. 'b1 + b1'
        if (item.indexOf('+') < 0) return expandEntity(content, item, idx);

        return item.split('+').map(function(item) {
            item = item.trim();
            return expandEntity(content, item, idx);
        });
    }

    function expandEntity(content, item, idx) {
        // expand mods and elems shotcuts by context (e.g. __e1 -> parent__e1)
        if (isShortcut(item)) {
            item = getParent(idx) + item;
        }

        var entity = naming.parse(item);

        if (entity.modName) {
            var modFieldName = entity.elem ? 'elemMods' : 'mods';

            entity[modFieldName] = {};
            entity[modFieldName][entity.modName] = entity.modVal;
            delete entity.modName;
            delete entity.modVal;
        }

        entity.content = content;

        return entity;
    }

    return tree.reduce(function(content, item, idx) {
        item = item.trim();

        // E.g. 'b1 * 2'
        var mult = /([\w\d-]+)(?:\s)?\*(?:\s)?(\d)/.exec(item);
        if (!mult) return expandEntities(content, item, idx);

        var result = [],
            item = mult[1],
            times = +mult[2];

        for (var i = 0; i < times; i++) {
            result.push(expandEntities(content, item, idx));
        }

        return result;
    }, {});
}

expandBemjson.stringify = function(str, opts) {
    opts || (opts = {});
    opts.indent || (opts.indent = '    ');

    return stringifyObj(expandBemjson(str, opts), opts);
}

module.exports = expandBemjson;
