let body = document.body;
let Color = {
  "BORDER": "rgba(216, 125, 125, 0.5)",
  "WRAPPER": "rgba(184, 241, 222, 1)"
};

class ElementUI {
  protected _tag: string
  protected _id: string
  protected _root: any

  constructor (tag: string, id: string, root: any) {
    this._tag = tag
    this._id = id
    this._root = root
  }

  protected create(): any {
    let element = document.createElement(this._tag);
    element.id = this._id;
    return element;
  }

  add(): void {
    this._root.appendChild(this.create())
  }

  remove(): void {
    document.querySelector('#' + this._id).remove();
  }

  check(): boolean {
    if (document.querySelector('#' + this._id)) {
      return true;
    }
    return false;
  }

  get(): any {
    return document.querySelector('#' + this._id);
  }
};

class blockElementUI extends ElementUI {
  position: string
  positionTop: string
  positionLft: string
  width: string
  height: string
  bgColor: string

  constructor (tag: string, id: string, root: any, bPos: string, bPosTop: number, bPosLft: number, bBg: string, bWidth: number, bHeight?: any) {
    super(tag, id, root)
    this.position = bPos
    this.positionTop = bPosTop + 'px'
    this.positionLft = bPosLft + 'px'
    this.bgColor = bBg
    this.width = bWidth + 'px'
    if (typeof(bHeight) === 'number' && bHeight === 100) {
      this.height = bHeight + '%'
    } else if (typeof(bHeight === 'number' && bHeight !== 100)) {
      this.height = bHeight + 'px'
    } else {
      this.height = 'auto';
    }
  }

  protected create(): any {
    let element = document.createElement(this._tag);
    element.id = this._id;
    element.style.position = this.position;
    element.style.top = this.positionTop;
    element.style.left = this.positionLft;
    element.style.width = this.width;
    element.style.height = this.height;
    element.style.backgroundColor = this.bgColor;
    return element;
  }
}

class articleElementUI extends ElementUI {
  content: string

  constructor (tag: string, id: string, root: any, aContent: string) {
    super(tag, id, root);
    this.content = aContent
  }

  protected create(): any {
    let element = document.createElement(this._tag);
    element.innerText = this.content;
    return element;
  }
}

let getPosition = function (event: any): any {
  return {
    "x": event.clientX,
    "y": event.clientY
  };
}

let getInfo = function (target: any): any {
  return {
    "name": target.tagName,
    "class": target.className,
    "children": target.children.length
  };
}

let initMode = function (): void {
  let clickHandler = function (e): void {
    e.preventDefault();
    let position = getPosition(e);
    wrapper.positionTop = position.y + 'px';
    wrapper.positionLft = position.x + 'px';
    let info = getInfo(e.target);
    if (wrapper.check()) {
      wrapper.remove();
      wrapper.add();
    } else {
      wrapper.add();
    }
    let title = new articleElementUI('h3', 'cmanager-info-title', wrapper.get(), 'TAG: ' + info.name);
    title.add();
    let desc = new articleElementUI('p', 'cmanager-info-classes', wrapper.get(), 'CLASSES: ' + info.class);
    desc.add();
    let child = new articleElementUI('p', 'cmanager-info-childrens', wrapper.get(), 'CHILDRENS: ' + info.children);
    child.add();
  };

  let border = new blockElementUI('div', 'cmanager-border-block', body, 'fixed', 0, 0, Color.BORDER, 20, 100);
  let wrapper = new blockElementUI('div', 'cmanager-wrapper-block', body, 'absolute', 0, 0, Color.WRAPPER, 300);

  if (!border.check()) {
    border.add();
    body.onclick = clickHandler;
  } else {
    border.remove();
    wrapper.remove();
    body.onclick = null;
  }
};

initMode();
