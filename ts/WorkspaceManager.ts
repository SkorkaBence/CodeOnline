class WorkspaceManager {

    private LoadingBox : HTMLElement;
    private MainArea : HTMLElement;

    private csfkey : string|null = null;
    private selectedWorkstation : string|null = null;
    private workstation : ContainerData|null = null;
    private files : string[] = [];

    public constructor() {
        this.LoadingBox = $("#loadbox");
        this.MainArea = $("main");
        this.HideLoading();

        this.csfkey = localStorage.getItem("csfkey");

        this.ShowWorkspaceSelection();
    }

    private ShowLoading() : void {
        this.LoadingBox.style.display = '';
    }

    private HideLoading() : void {
        this.LoadingBox.style.display = 'none';
    }

    private ShowMainArea() : void {
        this.MainArea.style.display = '';
    }

    private HideMainArea() : void {
        this.MainArea.style.display = 'none';
    }

    private async ShowApiKeyInput() : Promise<void> {
        const __this = this;

        const dialogcnt = document.createElement("div");
        dialogcnt.innerHTML = await HtmlLoader.Load("dialog/apikey");

        const keyinput = (dialogcnt.querySelector("#csf_api_key") as HTMLInputElement);
        keyinput.value = this.csfkey ? this.csfkey : "";

        Dialog.Show({
            title: "CSF Key",
            content: dialogcnt,
            buttons: [
                {
                    text: "Save",
                    primmary: true,
                    close: false,
                    callback: async function(dlg : DialogItem) {
                        __this.csfkey = keyinput.value;
                        localStorage.setItem("csfkey", __this.csfkey);
                        dlg.Close();
                        await __this.ShowWorkspaceSelection();
                    }
                }
            ]
        });
    }

    private async ShowWorkspaceSelection() : Promise<void> {
        const __this = this;

        this.HideMainArea();

        if (!this.csfkey) {
            await this.ShowApiKeyInput();
            return;
        }

        const cntlistrequest = await CSF.buildApiRequest("container", {
            key: this.csfkey
        });

        if (!cntlistrequest.ok) {
            await this.ShowApiKeyInput();
            return;
        }

        const cntlist : ContainerListing[] = await cntlistrequest.json();
        const dialogcnt = document.createElement("div");
        dialogcnt.innerHTML = await HtmlLoader.Load("dialog/workstation");
        const selector = (dialogcnt.querySelector("#workstation_select") as HTMLSelectElement);

        cntlist.forEach(function(listing) {
            const option = document.createElement("option");
            option.value = listing.id;
            option.innerText = listing.name;
            selector.appendChild(option);
        });

        Dialog.Show({
            title: "Select workstation",
            content: dialogcnt,
            buttons: [
                {
                    text: "Select",
                    close: true,
                    primmary: true,
                    callback: async function() {
                        const selected = selector.value;
                        if (selected == 'new') {
                            await __this.ShowNewWorkstationDialog();
                        } else {
                            await __this.SelectWorkstation(selected);
                        }
                    }
                }
            ]
        });
    }

    private async ShowNewWorkstationDialog() : Promise<void> {
        const __this = this;

        const dialogcnt = document.createElement("div");

        Dialog.Show({
            title: "New workstation",
            content: dialogcnt,
            buttons: [
                {
                    text: "Cancel",
                    close: true,
                    primmary: false,
                    callback: async function() {
                        await __this.ShowWorkspaceSelection();
                    }
                }, {
                    text: "Create",
                    close: true,
                    primmary: true,
                    callback: async function() {
                        
                    }
                }
            ]
        });
    }

    private async UpdateWorkstation() : Promise<void> {
        if (!this.selectedWorkstation || !this.workstation || !this.csfkey) {
            return;
        }

        if (this.workstation.configuration.parent_image != "5b836691-ef50-498f-ba9b-ab9788f9ebfb") {
            const requester = await CSF.buildApiRequest("container/" + this.selectedWorkstation, {
                key: this.csfkey,
                method: "PATCH",
                content: {
                    name: this.workstation.configuration.name != "<< Name >>" ? this.workstation.configuration.name : "Unnamed workstation",
                    parent_image: "5b836691-ef50-498f-ba9b-ab9788f9ebfb",
                    run: {
                        timeout: false,
                        watermark: false
                    }
                }
            });
    
            if (!requester.ok) {
                throw new Error("Update failed");
            }
        }
    }

    private async SelectWorkstation(id : string) : Promise<void> {
        const __this = this;
        this.selectedWorkstation = id;

        this.ShowLoading();

        const datarequester = await CSF.buildApiRequest("container/" + this.selectedWorkstation, {
            key: (this.csfkey as string)
        });
        this.workstation = await datarequester.json();

        await this.UpdateWorkstation();
        await this.ReloadFiles();

        this.ShowMainArea();
        this.HideLoading();
    }

    private async ReloadFiles() : Promise<void> {
        const filerequester = await CSF.buildApiRequest("container/" + this.selectedWorkstation + "/files", {
            key: (this.csfkey as string)
        });
        this.files = await filerequester.json();
    }

}
