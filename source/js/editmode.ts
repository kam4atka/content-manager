let wrapperSetting = {
  'WIDTH': 300,
  'HEIGHT': 145
};

class ElementUI {
  protected _tag: string
  protected _class: string
  protected _root: any

  constructor (tag: string, classes: string, root: any) {
    this._tag = tag
    this._class = classes
    this._root = root
  }

  protected create(): any {
    let element = document.createElement(this._tag);
    element.classList.add(this._class);
    return element;
  }

  add(): void {
    this._root.appendChild(this.create())
  }

  remove(): void {
    document.querySelector('.' + this._class).remove();
  }

  check(): boolean {
    if (document.querySelector('.' + this._class)) {
      return true;
    }
    return false;
  }

  get(): any {
    return document.querySelector('.' + this._class);
  }
};

class BlockElementUI extends ElementUI {
  position: string
  positionTop: string
  positionLft: string

  constructor (tag: string, classes: string, root: any, bPos?: string, bPosTop?: number, bPosLft?: number) {
    super(tag, classes, root)
    if (bPos) {
      this.position = bPos
      this.positionTop = bPosTop + 'px'
      this.positionLft = bPosLft + 'px'
    }
  }

  protected create(): any {
    let element = document.createElement(this._tag);
    element.classList.add(this._class);
    if (this.position) {
      element.style.position = this.position;
      element.style.top = this.positionTop;
      element.style.left = this.positionLft;
    }
    return element;
  }
}

class ArticleElementUI extends ElementUI {
  content: string

  constructor (tag: string, classes: string, root: any, aContent: string) {
    super(tag, classes, root)
    this.content = aContent
  }

  protected create(): any {
    let element = document.createElement(this._tag);
    element.classList.add(this._class);
    element.innerText = this.content;
    return element;
  }
};

class ButtonElementUI extends ElementUI {
  content: string
  type: string

  constructor (tag: string, classes: string, root: any, btnContent: string, btnType: string) {
    super(tag, classes, root)
    this.content = btnContent
    this.type = btnType
  }

  protected create(): any {
    let element = document.createElement(this._tag);
    element.classList.add(this._class);
    element.innerText = this.content;
    element.setAttribute('type', this.type);
    return element;
  }
}

let getPosition = function (event: any): any {
  console.log(event);
  let screenWidht = event.view.innerWidth;
  let screenHeight = event.view.innerHeight;
  let currentX = event.clientX;
  let currentY = event.clientY;
  if (currentX + wrapperSetting.WIDTH >= screenWidht) {
    currentX = currentX - wrapperSetting.WIDTH;
  }
  if (currentY + wrapperSetting.HEIGHT >= screenHeight) {
    currentY = currentY - wrapperSetting.HEIGHT;
  }
  return {
    "x": currentX,
    "y": currentY
  };
};

let getInfo = function (target: any): any {
  return {
    "name": target.tagName,
    "class": target.className,
    "children": target.children.length
  };
};

let addBorder = function (element: any): void {
  element.style.boxShadow = '0px 0px 10px 0px #ff5a5a';
};

let removeBorder = function (element: any): void {
  element.style.boxShadow = '';
};

// MAIN

let body = document.body;
let border = new BlockElementUI('div', 'cmanager-border', body, 'fixed', 0, 0);
let wrapper = new BlockElementUI('div', 'cmanager-wrapper', body, 'fixed', 0, 0);
let prevBlock = undefined;

let clickHandler = function (e): void {
  e.preventDefault();

  // Handlers

  let wrapperHandler = function (wEvt): void {
    wEvt.stopPropagation();
  };

  let doubleListClickHandler = function(): void {
    let root = e.target;
    let list = e.target.children;
    var fragment = document.createDocumentFragment();
    for (let i = 0; i < list.length; i++) {
      fragment.appendChild(list[i].cloneNode(true));
    }
    root.appendChild(fragment);
  };

  // Logic

  let position = getPosition(e);
  wrapper.positionTop = position.y + 'px';
  wrapper.positionLft = position.x + 'px';
  let info = getInfo(e.target);

  if (wrapper.check()) {
    wrapper.remove();
    wrapper.add();
    wrapper.get().onclick = wrapperHandler;
  } else {
    wrapper.add();
    wrapper.get().onclick = wrapperHandler;
  }

  if (prevBlock !== undefined) {
    removeBorder(prevBlock);
  }
  addBorder(e.target);
  prevBlock = e.target;

  let infoBlock = new BlockElementUI('div', 'cmanager-info', wrapper.get(), 'relative', 0, 0);
  infoBlock.add();

  let title = new ArticleElementUI('h3', 'cmanager-info__title', infoBlock.get(), 'TAG: ' + info.name);
  title.add();

  let desc = new ArticleElementUI('p', 'cmanager-info__classes', infoBlock.get(), 'CLASSES: ' + info.class);
  desc.add();

  let child = new ArticleElementUI('p', 'cmanager-info__childrens', infoBlock.get(), 'CHILDRENS: ' + info.children);
  child.add();

  if (info.children > 0) {
    let doubleBtn = new ButtonElementUI('button', 'cmanager-list__button', infoBlock.get(), '2xlist', 'button');
    doubleBtn.add();
    doubleBtn.get().onclick = doubleListClickHandler;
  }
};

let startMode = function (): void {
  border.add();
  body.onclick = clickHandler;
};

let stopMode = function (): void {
  if (border.check()) { border.remove() };
  if (wrapper.check()) { wrapper.remove() };
  body.onclick = null;
}

chrome.runtime.onMessage.addListener(
  function(request) {
    if (request.action === "start") {
      startMode();
    }
    if (request.action === "stop") {
      stopMode();
    }
  }
);
