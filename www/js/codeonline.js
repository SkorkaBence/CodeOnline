"use strict";
var CodeEditor = (function () {
    function CodeEditor() {
        this.ShareDialog = $("#sharedialog");
        this.ShareDialog.style.display = 'none';
        this.ExecuteLoader = $("#resploading");
        this.ExecuteLoader.style.display = 'none';
    }
    return CodeEditor;
}());
var editor;
window.addEventListener("load", function () {
    editor = new CodeEditor();
    $("#loadbox").style.display = 'none';
});
function $(e) {
    var d = document.querySelector(e);
    if (!d) {
        throw new Error("Invalid selector");
    }
    return d;
}
