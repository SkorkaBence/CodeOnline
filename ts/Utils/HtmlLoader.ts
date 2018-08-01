class HtmlLoader {

    private static cache : {[id : string] : string} = {};

    public static async Load(id : string) : Promise<string> {
        if (typeof(this.cache[id]) == "string") {
            return this.cache[id];
        }

        const request = await fetch("html/" + id + ".html");
        const data = await request.text();

        this.cache[id] = data;

        return data;
    }

}