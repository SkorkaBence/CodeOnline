interface DialogSettings {
    title : string;
    content : HTMLElement;
    buttons : DialogButton[];
}

interface DialogButton {
    primmary : boolean;
    text : string;
    callback? : DialogButtonCallback;
    close : boolean;
}

type DialogButtonCallback = (dialog : DialogItem) => void;

class DialogItem {

    private cover : HTMLElement;

    public constructor(c : HTMLElement) {
        this.cover = c;
    }

    public Close() : void {
        this.cover.remove();
    }

}

class Dialog {

    //private static OpenDialogs : 

    public static Show(settings : DialogSettings) : void {
        const __this = this;

        const cover = document.createElement("div");
        cover.className = 'dialog-cover';

        const dialog = document.createElement("div");
        dialog.className = 'dialog';

        const title = document.createElement("div");
        title.innerText = settings.title;
        title.className = 'title noselect';
        dialog.appendChild(title);

        const body = document.createElement("div");
        body.appendChild(settings.content);
        body.className = 'dialogbody';
        dialog.appendChild(body);

        const dialog_item = new DialogItem(cover);

        const footer = document.createElement("div");
        settings.buttons.forEach(function(buttondata) {
            const btn = document.createElement("button");
            btn.className = 'mtbutton';
            if (!buttondata.primmary) {
                btn.classList.add('secondary');
            }
            btn.innerText = buttondata.text;
            btn.addEventListener('click', function() {
                if (buttondata.callback) {
                    try {
                        buttondata.callback(dialog_item);
                    } catch (e) {
                        console.warn("Error in dialog callback:", e);
                    }
                }
                if (buttondata.close) {
                    cover.remove();
                }
            });
            btn.innerText = buttondata.text;
            footer.appendChild(btn);
        });
        footer.className = 'footer noselect';
        dialog.appendChild(footer);

        cover.appendChild(dialog);

        document.body.appendChild(cover);
    }

}