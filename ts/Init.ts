let editor : CodeEditor|undefined;

window.addEventListener("load", function() {
    editor = new CodeEditor();
    $("#loadbox").style.display = 'none';
});
