
//定义窗口相关：关闭，最大化，最小化，拖拉调整窗口大小，移动窗口
import { postMessage, IPostCallBack } from "./postMessage"
interface IWndRectInfo {
  x: number,
  y: number,
  width: number,
  height: number
}

interface IWndMouseDownInfo extends IWndRectInfo {
  direction: number;
  start_x: number,
  start_y: number
}

interface ISizeWndInfo {
  enable: boolean,
  size: number
}

enum EWndMouseState {
  NoState,
  DragResize,
  MoveWindow
}

//拖拉调整窗口尺寸
class WndDragResize {
  private mouseState: EWndMouseState = EWndMouseState.NoState;
  private static instance: WndDragResize;
  private isListening = false;
  private startWndInfo: IWndMouseDownInfo = { x: 0, y: 0, width: 0, height: 0, direction: 0, start_x: 0, start_y: 0 };
  private curSorState: Array<string> = ["auto", "w-resize", "e-resize", "n-resize", "nw-resize", "ne-resize", "s-resize", "sw-resize", "se-resize"];
  private resizeInfo: ISizeWndInfo = { enable: false, size: 3 };
  private moveInfo: ISizeWndInfo = { enable: false, size: 600 };
  //检测是否是边框
  private checkBord(x: number, y: number) {
    const docWidth = window.outerWidth;
    const docHeight = window.outerHeight;

    if (x < this.resizeInfo.size && y < this.resizeInfo.size) {
      //左上
      return 4;
    } else if (x > docWidth - this.resizeInfo.size && y < this.resizeInfo.size) {
      //右上
      return 5;
    } else if (x > docWidth - this.resizeInfo.size && y > docHeight - this.resizeInfo.size) {
      //右下
      return 8;
    } else if (x < this.resizeInfo.size && y > docHeight - this.resizeInfo.size) {
      //左下
      return 7;
    } else if (x < this.resizeInfo.size) {
      //左
      return 1;
    } else if (y < this.resizeInfo.size) {
      //上
      return 3;
    } else if (x > docWidth - this.resizeInfo.size) {
      //右
      return 2;
    } else if (y > docHeight - this.resizeInfo.size) {
      //下
      return 6;
    } else {
      return 0;
    }
  }

  //计算窗口新的尺寸与位置
  private dragResizeNewWndPos(screenX: number, screeny: number): IWndRectInfo {
    const tempRect: IWndRectInfo = { x: this.startWndInfo.x, y: this.startWndInfo.y, width: this.startWndInfo.width, height: this.startWndInfo.height };
    let xcj = (screenX - this.startWndInfo.start_x);
    let ycj = (screeny - this.startWndInfo.start_y);
    if (this.startWndInfo.direction == 1) {
      tempRect.x += xcj;
      tempRect.width -= xcj;
    } else if (this.startWndInfo.direction == 2) {
      tempRect.width += xcj;

    } else if (this.startWndInfo.direction == 3) {
      tempRect.y += ycj;
      tempRect.height -= ycj;

    } else if (this.startWndInfo.direction == 4) {
      tempRect.x += xcj;
      tempRect.y += ycj;
      tempRect.width -= xcj;
      tempRect.height -= ycj;

    } else if (this.startWndInfo.direction == 5) {
      tempRect.y += ycj;
      tempRect.width += xcj;
      tempRect.height -= ycj;

    } else if (this.startWndInfo.direction == 6) {

      tempRect.height += ycj;

    } else if (this.startWndInfo.direction == 7) {
      tempRect.x += xcj;
      tempRect.width -= xcj;
      tempRect.height += ycj;

    } else if (this.startWndInfo.direction == 8) {
      tempRect.width += xcj;
      tempRect.height += ycj;
    }

    return tempRect;
  }

  private moveWindowNewPos(screenX: number, screeny: number): IWndRectInfo {
    const tempRect: IWndRectInfo = { x: this.startWndInfo.x, y: this.startWndInfo.y, width: this.startWndInfo.width, height: this.startWndInfo.height };
    let xcj = (screenX - this.startWndInfo.start_x);
    let ycj = (screeny - this.startWndInfo.start_y);

    tempRect.x += xcj;
    tempRect.y += ycj;
    return tempRect;
  }

  //鼠标按下
  private mousedown = (event: MouseEvent) => {
    this.startWndInfo.direction = 0;
    this.mouseState = EWndMouseState.NoState;

    if (this.resizeInfo.enable) {
      this.startWndInfo.direction = this.checkBord(event.pageX, event.pageY);
      if (this.startWndInfo.direction != 0) {
        this.mouseState = EWndMouseState.DragResize;
        this.startWndInfo.start_x = event.screenX;
        this.startWndInfo.start_y = event.screenY;
        postMessage("sysfun", "GetWindowRect", (event: IPostCallBack) => {
          const { x, y, width, height } = event.data;
          this.startWndInfo.x = x;
          this.startWndInfo.y = y;
          this.startWndInfo.width = width;
          this.startWndInfo.height = height;
        });

        event.stopPropagation();
        // this.startWndInfo.x = window.screenLeft;
        // this.startWndInfo.y = window.screenTop;
        // this.startWndInfo.width = window.outerWidth;
        // this.startWndInfo.height = window.outerHeight;
        return;
      }
    }
  }

  //鼠标移动
  private mousemove = (event: MouseEvent) => {


    switch (this.mouseState) {
      case EWndMouseState.DragResize: {
        postMessage("sysfun", "SizeWnd", { ...this.dragResizeNewWndPos(event.screenX, event.screenY) });
        break;
      }
      case EWndMouseState.MoveWindow: {


        const wndrect = this.moveWindowNewPos(event.screenX, event.screenY);

        // console.log(wndrect);

        window.moveTo(wndrect.x, wndrect.y);
        postMessage("sysfun", "MoveWnd", { ...wndrect });

        break;
      } case EWndMouseState.NoState: {
        if (this.resizeInfo.enable) {
          const cursor = this.curSorState[this.checkBord(event.pageX, event.pageY)];
          if (document.body.style.cursor != cursor) {
            document.body.style.cursor = cursor;
            // console.log(document.body.style.cursor);

          }
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  //鼠标放开
  private mouseup = (event: MouseEvent) => {
    this.startWndInfo.direction = 0;
    this.mouseState = EWndMouseState.NoState;
    document.body.style.cursor = "auto";
  }

  constructor() {
    if (!this.isListening) {
      document.addEventListener('mousedown', this.mousedown);
      document.addEventListener('mousemove', this.mousemove);
      document.addEventListener('mouseup', this.mouseup);
    }
  }
  public static getInstance() {
    if (!WndDragResize.instance) {
      WndDragResize.instance = new WndDragResize;
    }
    return WndDragResize.instance;
  }

  public enbaleWndSize(isEnbale: boolean, bordWidth?: number) {
    this.resizeInfo.enable = isEnbale;
    if (bordWidth) {
      this.resizeInfo.size = bordWidth;
    }
  }

  private movemousedown = (event: MouseEvent) => {
    if (this.startWndInfo.direction == 0 && this.moveInfo.enable) {
      //检测是否开启了全局移动
      this.mouseState = EWndMouseState.MoveWindow;
      this.startWndInfo.start_x = event.screenX;
      this.startWndInfo.start_y = event.screenY;

      postMessage("sysfun", "GetWindowRect", (event: IPostCallBack) => {
        const { x, y, width, height } = event.data;
        this.startWndInfo.x = x;
        this.startWndInfo.y = y;
        this.startWndInfo.width = width;
        this.startWndInfo.height = height;
      });

      if (this.checkBord(event.pageX, event.pageY) == 0) {
        event.stopPropagation();
      }


      // this.startWndInfo.x = window.screenLeft;
      // this.startWndInfo.y = window.screenTop;
      // this.startWndInfo.width = window.outerWidth;
      // this.startWndInfo.height = window.outerHeight;


      //}
    }
  }

  public enbaleWndMove(id: string, isEnbale: boolean, bordWidth?: number) {
    const element = document.getElementById(id);
    if (element) {
      element.removeEventListener("mousedown", this.movemousedown);
      element.addEventListener("mousedown", this.movemousedown);
      this.moveInfo.enable = isEnbale;
      if (bordWidth) {
        this.moveInfo.size = bordWidth;
      }
    }


  }


}

//程序拖动

//开启拖拉调整尺寸
export function enbaleWndSize(isEnbale: boolean, bordWidth?: number) {
  WndDragResize.getInstance().enbaleWndSize(isEnbale, bordWidth);
}

export function enbaleWndMove(id: string, isEnbale: boolean, bordWidth?: number) {
  WndDragResize.getInstance().enbaleWndMove(id, isEnbale, bordWidth);
}
