modules.define('main', ['i-bem__dom', 'keyboard__codes', 'textarea'],
    function(provide, BEMDOM, keyCodes, Textarea) {

provide(BEMDOM.decl(this.name, {
    onSetMod: {
        js: {
            inited: function() {
                this.onInit();
            }
        }
    },
    onInit: function() {
        var textarea = this.findBlockInside('textarea'),
            control = textarea.domElem[0],
            pos = textarea.getVal().length;

        control.setSelectionRange(pos, pos);
        textarea.setMod('focused');

        this.bindTo('keydown', function(e) {
            if (e.keyCode !== keyCodes.TAB) return;

            e.preventDefault();

            var val = textarea.getVal(),
                caret = {
                    start: control.selectionStart,
                    end: control.selectionEnd,
                },
                isSelection = caret.start !== caret.end,
                selection;

            if (isSelection) {
                selection = val.substr(caret.start, caret.end);
            } else {
                var textBeforeCaret = val.substr(0, caret.start),
                    textBeforeCaretNoSpaces = textBeforeCaret.replace(/\{(.*)\}/g, function(str) {
                        return str.replace(/\ /g, 'S'); // S is used as a space placeholder
                    }),
                    spaceNearCaretIdx = textBeforeCaretNoSpaces.lastIndexOf(' ');

                selection = spaceNearCaretIdx > -1 ? textBeforeCaret.substr(spaceNearCaretIdx) : textBeforeCaret;
            }

            textarea.setVal(val.replace(selection, bemmet.stringify(selection)));
        });
    }
}));

});
