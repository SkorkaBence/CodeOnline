function $(e : string) : HTMLElement {
    const d = document.querySelector(e);
    if (!d) {
        throw new Error("Invalid selector");
    }
    return (d as HTMLElement);
}
