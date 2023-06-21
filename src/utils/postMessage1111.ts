import { v4 as uuidv4 } from 'uuid'
interface IRecvData {
    id: string,
    data: any
}
interface ISendData extends IRecvData {
    url: string
}

interface ICallBack {
    strtime: number;
    timeout: number;
    func: Function;
}

class PostMsg {
    private requestId = "";
    private callbacks: Map<string, ICallBack> = new Map();
    private isListening = false;
    private static instance: PostMsg;
    private timeout: number = 3000;

    constructor() {
        //添加消息监听
        if (!this.isListening) {
            window.chrome.webview.addEventListener("message", (event: any) => {
                const recvData: IRecvData = event.data;
                const callback = this.callbacks.get(recvData.id);
                if (callback) {
                    callback.func(recvData.data);
                    this.callbacks.delete(recvData.id);
                }
            })
        }
        //添加定时器清理callback
        setInterval(() => {
            const now = Date.now();
            for (const [id, callback] of this.callbacks) {
                //如果等于-1则无限等待
                if (callback.strtime != -1 && now - callback.strtime > callback.timeout) {
                    console.log("准备清空");

                    this.callbacks.delete(id);
                    callback.func({ error: "timerout" });
                }
            }
        }, 1000);
    }

    public async postMessage(url: string, data: Record<string, any>, time?: number): Promise<any> {
        const id = uuidv4();
        const sendData: ISendData = {
            id,
            url,
            data
        };

        return new Promise((resolve) => {
            //如果时间没定义3秒内就删除,
            const tempCallBack: ICallBack = { strtime: Date.now(), timeout: time || this.timeout, func: resolve };
            this.callbacks.set(id, tempCallBack);

            window.chrome.webview.postMessage(sendData);
        });
    }

    public static getInstance(): PostMsg {
        if (!PostMsg.instance) {
            PostMsg.instance = new PostMsg;
        }
        return PostMsg.instance;
    }
}

export const postMessage = async (url: string, data?: Record<string, any>, time?: number): Promise<any> => {
    const postData = data !== undefined ? data : {};
    return PostMsg.getInstance().postMessage(url, postData, time);
};