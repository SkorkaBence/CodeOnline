declare let CSF: CSF_SDK;
declare class CSF_SDK {
    private cookie_prefix;
    private api_base_url;
    private auth_url;
    private redirect_uri;
    private message_origin;
    private token_cookie;
    private client_id;
    private access_token;
    private browser_key;
    private api_version;
    private sdk_version;
    private logged_in;
    private login_window;
    private login_window_timer;
    private login_callback;
    constructor();
    init(options: CSF_SDK_INIT): void;
    login(callback: CSF_SDK_LOGINCALLBACK, options: CSF_SDK_LOGINOPTIONS): void;
    private closeLoginWindow;
    private processLoginMessages;
    logout(): void;
    scanDom(): void;
    getLoginStatus(callback: CSF_SDK_LOGINCALLBACK): void;
    buildApiRequest(apiurl: string, options: CSF_SDK_APIOPTIONS): Promise<Response>;
    api(apiurl: string, options: CSF_SDK_APIOPTIONS): Promise<any>;
    private serializeQuery;
    private qs;
    private qsa;
    private setCookie;
    private getCookie;
}
interface CSF_SDK_INIT {
    client_id?: string;
    key?: string;
    token_cookie?: string;
    access_token?: string;
    csfxml?: boolean;
}
declare type CSF_SDK_LOGINCALLBACK = (status: CSF_SDK_LOGINSTATUS) => void;
interface CSF_SDK_LOGINSTATUS {
    status: boolean;
    accessToken?: string;
}
interface CSF_SDK_LOGINOPTIONS {
    client_id?: string;
    redirect_uri?: string;
    scope?: string[];
    method?: "any" | "google";
}
interface CSF_SDK_APIOPTIONS {
    method?: string;
    query?: {
        [id: string]: string;
    };
    content?: any;
    success?: CSF_SDK_APISUCCESS;
    error?: CSF_SDK_APIERROR;
    access_token?: string;
    key?: string;
}
declare type CSF_SDK_APISUCCESS = (data: any) => void;
declare type CSF_SDK_APIERROR = (data: any) => void;
