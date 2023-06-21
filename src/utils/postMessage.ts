import path from 'path'
import { v4 as uuidv4 } from 'uuid'
interface IRecvData {
    id: string,
    data: any
}
interface ISendData extends IRecvData {
    url: string
    path: string
}

export interface IPostCallBack extends IRecvData {
    pursue: boolean
}

class PostMsg {
    private requestId = "";
    private callbacks: Map<string, Function> = new Map();
    private isListening = false;
    private static instance: PostMsg;

    constructor() {
        //添加消息监听
        if (!this.isListening) {
            window.chrome.webview.addEventListener("message", (event: any) => {
                const recvData: IRecvData = event.data;
                const func = this.callbacks.get(recvData.id);
                if (func) {

                    const event: IPostCallBack = {
                        id: recvData.id,
                        data: recvData.data,
                        pursue: false,
                    };

                    func(event);

                    if (event.pursue === false) {
                        this.callbacks.delete(event.id);
                    }
                }
            })
        }
    }

    //发送消息
    public postMessage(url: string, path: string, data: Record<string, any>, func?: Function) {
        const id = uuidv4();
        const sendData: ISendData = {
            id,
            url,
            path,
            data
        };

        if (typeof func === "function") {
            this.callbacks.set(id, func);
        }
        window.chrome.webview.postMessage(sendData);
    }

    //取实例
    public static getInstance(): PostMsg {
        if (!PostMsg.instance) {
            PostMsg.instance = new PostMsg;
        }
        return PostMsg.instance;
    }
}

export const postMessage = (url: string, path: string, data?: Record<string, any> | Function, func?: Function) => {

    let _func: Function | undefined = func;

    let _data: Record<string, any> = {};

    if (typeof data === "object") {
        _data = data;
    }
    else if (typeof data === "function") {
        _func = data;
    }
    PostMsg.getInstance().postMessage(url, path, _data, _func);
};