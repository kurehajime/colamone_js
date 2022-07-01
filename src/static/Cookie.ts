interface IStorage {
    getItem:(key:string)=>any
    setItem:(key:string,value:any)=>void
}

export default class Cookie{
    static storage:IStorage = Cookie.getCookie()
    static getCookie() :IStorage{
        let storage :any= null
        try {
            if (window == parent && ('localStorage' in window) && window.localStorage !== null) {
                storage = localStorage;
                storage.setItem('test', 0); // Safariのプライベートモードは、できないのにできるって言うからかまをかけてみる。
            }
        } catch (e) {
            storage = null;
        }
        if (storage === null) {
            // localStorageが使えない場合
            storage = {}; // ダミー
            storage.getItem = function () { return undefined; };
            storage.setItem = function () { return undefined; };

            if (navigator.cookieEnabled) {
                storage.hasItem = function (sKey: string) {
                    return (new RegExp('(?:^|;\\s*)' + escape(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie);
                };
                storage.getItem = function (sKey: string) {
                    if (!sKey || !(new RegExp('(?:^|;\\s*)' + escape(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=')).test(document.cookie)) { return null; }
                    return unescape(document.cookie.replace(new RegExp('(?:^|.*;\\s*)' + escape(sKey).replace(/[-.+*]/g, '\\$&') + '\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*'), '$1'));
                };
                storage.setItem = function (sKey: string, sValue: any) {
                    if (!sKey || /^(?:expires|max-age|path|domain|secure)$/i.test(sKey)) { return; }
                    document.cookie = escape(sKey) + '=' + escape(sValue);
                };
            }
        }
        return storage as IStorage;
    }
    static getItem(key:string):any{
        return this.storage.getItem(key)
    }
    static setItem(key:string,value:any):void{
        this.storage.setItem(key,value)
    }
}