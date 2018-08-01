class CodeEditor {

    private ShareDialog : HTMLElement;
    private ExecuteLoader : HTMLElement;

    public constructor() {
        this.ShareDialog = $("#sharedialog");
        this.ShareDialog.style.display = 'none';
        this.ExecuteLoader = $("#resploading");
        this.ExecuteLoader.style.display = 'none';
    }

}
