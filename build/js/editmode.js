var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var infoBlockSetting = {
    WIDTH: 300,
    HEIGHT: 145,
    TARGET_BORDER: '0px 0px 10px 0px #ff5a5a'
};
var keyCode = {
    ESC: 27
};
var ElementUI = (function () {
    function ElementUI(tag, classes, id, root) {
        this._tag = tag;
        this._class = classes;
        this._id = id;
        this._root = root;
    }
    ElementUI.prototype.create = function () {
        var element = document.createElement(this._tag);
        element.classList.add(this._class);
        element.setAttribute('id', this._id);
        return element;
    };
    ElementUI.prototype.add = function () {
        this._root.appendChild(this.create());
    };
    ElementUI.prototype.remove = function () {
        document.querySelector('#' + this._id).remove();
    };
    ElementUI.prototype.check = function () {
        if (document.querySelector('#' + this._id)) {
            return true;
        }
        return false;
    };
    ElementUI.prototype.get = function () {
        return document.querySelector('#' + this._id);
    };
    ElementUI.prototype.getClass = function () {
        return this._class;
    };
    return ElementUI;
}());
;
var BlockElementUI = (function (_super) {
    __extends(BlockElementUI, _super);
    function BlockElementUI(tag, classes, id, root, bPos, bPosTop, bPosLft) {
        var _this = _super.call(this, tag, classes, id, root) || this;
        if (bPos) {
            _this.position = bPos;
            _this.positionTop = bPosTop + '%';
            _this.positionLft = bPosLft + 'px';
        }
        return _this;
    }
    BlockElementUI.prototype.create = function () {
        var element = document.createElement(this._tag);
        element.classList.add(this._class);
        element.setAttribute('id', this._id);
        if (this.position) {
            element.style.position = this.position;
            element.style.top = this.positionTop;
            element.style.left = this.positionLft;
        }
        return element;
    };
    return BlockElementUI;
}(ElementUI));
var ArticleElementUI = (function (_super) {
    __extends(ArticleElementUI, _super);
    function ArticleElementUI(tag, classes, id, root, aContent) {
        var _this = _super.call(this, tag, classes, id, root) || this;
        _this.content = aContent;
        return _this;
    }
    ArticleElementUI.prototype.create = function () {
        var element = document.createElement(this._tag);
        element.classList.add(this._class);
        element.setAttribute('id', this._id);
        element.innerText = this.content;
        return element;
    };
    return ArticleElementUI;
}(ElementUI));
;
var ButtonElementUI = (function (_super) {
    __extends(ButtonElementUI, _super);
    function ButtonElementUI(tag, classes, id, root, btnContent, btnType) {
        var _this = _super.call(this, tag, classes, id, root) || this;
        _this.content = btnContent;
        _this.type = btnType;
        return _this;
    }
    ButtonElementUI.prototype.create = function () {
        var element = document.createElement(this._tag);
        element.classList.add(this._class);
        element.setAttribute('id', this._id);
        element.innerText = this.content;
        element.setAttribute('type', this.type);
        return element;
    };
    return ButtonElementUI;
}(ElementUI));
var getPosition = function (event) {
    var screenWidht = event.view.innerWidth;
    var screenHeight = event.view.innerHeight;
    var currentX = event.clientX;
    var currentY = event.clientY;
    if (currentX + infoBlockSetting.WIDTH >= screenWidht) {
        currentX = currentX - infoBlockSetting.WIDTH;
    }
    if (currentY + infoBlockSetting.HEIGHT >= screenHeight) {
        currentY = currentY - infoBlockSetting.HEIGHT;
    }
    return {
        "x": currentX,
        "y": currentY
    };
};
var getInfo = function (target) {
    return {
        'name': target.tagName,
        'class': target.className,
        'children': target.children.length,
        'parentClass': target.parentNode.className
    };
};
var addBorder = function (element) {
    element.style.boxShadow = infoBlockSetting.TARGET_BORDER;
};
var removeBorder = function (element) {
    element.style.boxShadow = '';
};
var doubleAllHandler = function (xAllEvt) {
    xAllEvt.preventDefault();
    var ignoreElements = ["SCRIPT", "PICTURE", "SOURCE", "IMG", "SVG", "USE", "PATH", "LEGEND"];
    var brElement = 'BR';
    var doubleContent = function (content) {
        return content + ' ' + content;
    };
    var checkContent = function (parent) {
        var controlsBlockClass = controlsBlock.getClass();
        if (parent.className === controlsBlockClass || parent.parentNode.className === controlsBlockClass) {
            return;
        }
        if (parent.children.length === 0) {
            ignoreElements.forEach(function (item) {
                if (parent.nodeName === item) {
                    return;
                }
            });
            if (parent.innerHTML.length !== 0) {
                parent.innerHTML = doubleContent(parent.innerHTML);
            }
        }
        if (parent.children.length > 0) {
            if (parent.children[0].nodeName === brElement) {
                parent.innerHTML = doubleContent(parent.innerHTML);
            }
            for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
                var element = _a[_i];
                checkContent(element);
            }
        }
    };
    checkContent(body);
};
var longAllHandler = function (lgAllEvt) {
    lgAllEvt.preventDefault();
    var ignoreElements = ["SCRIPT", "PICTURE", "SOURCE", "IMG", "SVG", "USE", "PATH", "LEGEND"];
    var brElement = 'BR';
    var loremText = 'EyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökull';
    var checkContent = function (parent) {
        var controlsBlockClass = controlsBlock.getClass();
        if (parent.className === controlsBlockClass || parent.parentNode.className === controlsBlockClass) {
            return;
        }
        if (parent.children.length === 0) {
            ignoreElements.forEach(function (item) {
                if (parent.nodeName === item) {
                    return;
                }
            });
            if (parent.innerHTML.length !== 0) {
                parent.innerHTML = loremText;
            }
        }
        if (parent.children.length > 0) {
            if (parent.children[0].nodeName === brElement) {
                parent.innerHTML = loremText;
            }
            for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
                var element = _a[_i];
                checkContent(element);
            }
        }
    };
    checkContent(body);
};
var imgAllHandler = function (imAllEvt) {
    imAllEvt.preventDefault();
    var imgElement = 'IMG';
    var sourceElement = 'SOURCE';
    var emptyUrl = 'noimage.webp';
    var checkContent = function (parent) {
        var controlsBlockClass = controlsBlock.getClass();
        if (parent.className === controlsBlockClass || parent.parentNode.className === controlsBlockClass) {
            return;
        }
        if (parent.children.length === 0) {
            if (parent.nodeName === imgElement) {
                parent.setAttribute('data-src', emptyUrl);
                parent.setAttribute('src', emptyUrl);
                parent.setAttribute('srcset', emptyUrl);
            }
            if (parent.nodeName === sourceElement) {
                parent.setAttribute('srcset', emptyUrl);
            }
        }
        if (parent.children.length > 0) {
            for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
                var element = _a[_i];
                checkContent(element);
            }
        }
    };
    checkContent(body);
};
var bgAllHandler = function (bgAllEvt) {
    bgAllEvt.preventDefault();
    var emptyUrl = 'url("noimage.webp")';
    var checkContent = function (parent) {
        var controlsBlockClass = controlsBlock.getClass();
        if (parent.className === controlsBlockClass || parent.parentNode.className === controlsBlockClass) {
            return;
        }
        var computedStyle = getComputedStyle(parent);
        if (computedStyle.backgroundImage !== 'none') {
            parent.style.backgroundImage = emptyUrl;
        }
        if (parent.children.length > 0) {
            for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
                var element = _a[_i];
                checkContent(element);
            }
        }
    };
    checkContent(body);
};
var clickHandler = function (e) {
    e.preventDefault();
    var pressEscHandler = function (btnEvt) {
        if (btnEvt.keyCode === keyCode.ESC) {
            if (infoBlock.check()) {
                infoBlock.remove();
                removeBorder(actualElement);
                document.removeEventListener('keydown', pressEscHandler);
            }
        }
    };
    var infoBlockHandler = function (wEvt) {
        wEvt.stopPropagation();
    };
    var doubleBtnClickHandler = function () {
        var childrens = actualElement.children;
        var fragment = document.createDocumentFragment();
        for (var i = 0; i < childrens.length; i++) {
            fragment.appendChild(childrens[i].cloneNode(true));
        }
        actualElement.appendChild(fragment);
    };
    var parentBtnClickHandler = function () {
        var parent = actualElement.parentNode;
        var rootElement = "BODY";
        if (parent.tagName === rootElement) {
            removeBorder(actualElement);
            return;
        }
        if (infoBlock.check()) {
            infoBlock.remove();
            removeBorder(actualElement);
            document.removeEventListener('keydown', pressEscHandler);
        }
        infoBlockCreate(parent);
    };
    var addBtnClickHandler = function () {
        var parent = actualElement.parentNode;
        var newElement = actualElement.cloneNode(true);
        removeBorder(newElement);
        parent.appendChild(newElement);
    };
    var removeBtnClickHandler = function () {
        actualElement.remove();
        infoBlock.remove();
    };
    var infoBlockCreate = function (el) {
        var position = getPosition(e);
        infoBlock.positionTop = position.y + 'px';
        infoBlock.positionLft = position.x + 'px';
        var info = getInfo(el);
        var controlsBlockClass = controlsBlock.getClass();
        if (info.class === controlsBlockClass || info.parentClass === controlsBlockClass) {
            return;
        }
        if (infoBlock.check()) {
            infoBlock.remove();
            infoBlock.add();
            infoBlock.get().addEventListener('click', infoBlockHandler);
        }
        else {
            infoBlock.add();
            infoBlock.get().addEventListener('click', infoBlockHandler);
        }
        document.addEventListener('keydown', pressEscHandler);
        if (actualElement !== undefined) {
            removeBorder(actualElement);
        }
        addBorder(el);
        actualElement = el;
        var infoWrapper = new BlockElementUI('div', 'cmanager-info__wrapper', 'cmg-info-wrapper', infoBlock.get(), 'relative', 0, 0);
        infoWrapper.add();
        var title = new ArticleElementUI('h3', 'cmanager-info__title', 'cmg-info-title', infoWrapper.get(), 'TAG: ' + info.name);
        title.add();
        var desc = new ArticleElementUI('p', 'cmanager-info__classes', 'cmg-info-desc', infoWrapper.get(), 'CLASSES: ' + info.class);
        desc.add();
        var child = new ArticleElementUI('p', 'cmanager-info__childrens', 'cmg-info-count', infoWrapper.get(), 'CHILDRENS: ' + info.children);
        child.add();
        var parentBtn = new ButtonElementUI('button', 'cmanager-info__btn', 'cmg-info-btn-parent', infoWrapper.get(), 'На уровень выше', 'button');
        parentBtn.add();
        parentBtn.get().addEventListener('click', parentBtnClickHandler);
        if (info.children > 0) {
            var doubleBtn = new ButtonElementUI('button', 'cmanager-info__btn', 'cmg-info-btn-double', infoWrapper.get(), '2x', 'button');
            doubleBtn.add();
            doubleBtn.get().addEventListener('click', doubleBtnClickHandler);
        }
        var addBtn = new ButtonElementUI('button', 'cmanager-info__btn', 'cng-info-btn-add', infoWrapper.get(), '+1', 'button');
        addBtn.add();
        addBtn.get().addEventListener('click', addBtnClickHandler);
        var removeBtn = new ButtonElementUI('button', 'cmanager-info__btn', 'cng-info-btn-removw', infoWrapper.get(), '-1', 'button');
        removeBtn.add();
        removeBtn.get().addEventListener('click', removeBtnClickHandler);
    };
    infoBlockCreate(e.target);
};
var body = document.body;
var controlsBlock = new BlockElementUI('div', 'cmanager-controls', 'cmg-controls', body, 'fixed', 50, 0);
var infoBlock = new BlockElementUI('div', 'cmanager-info', 'cmg-info', body, 'fixed', 0, 0);
var actualElement = undefined;
var startMode = function () {
    if (!controlsBlock.check()) {
        controlsBlock.add();
        var doubleBtnAll = new ButtonElementUI('button', 'cmanager-controls__btn', 'cmg-btn-double', controlsBlock.get(), 'x2', 'button');
        doubleBtnAll.add();
        doubleBtnAll.get().addEventListener('click', doubleAllHandler);
        var longBtnAll = new ButtonElementUI('button', 'cmanager-controls__btn', 'cmg-btn-long', controlsBlock.get(), 'lg', 'button');
        longBtnAll.add();
        longBtnAll.get().addEventListener('click', longAllHandler);
        var imgBtnAll = new ButtonElementUI('button', 'cmanager-controls__btn', 'cmg-btn-img', controlsBlock.get(), 'im', 'button');
        imgBtnAll.add();
        imgBtnAll.get().addEventListener('click', imgAllHandler);
        var bgBtnAll = new ButtonElementUI('button', 'cmanager-controls__btn', 'cmg-btn-bg', controlsBlock.get(), 'bg', 'button');
        bgBtnAll.add();
        bgBtnAll.get().addEventListener('click', bgAllHandler);
        body.addEventListener('click', clickHandler);
    }
};
var stopMode = function () {
    if (controlsBlock.check()) {
        controlsBlock.remove();
    }
    ;
    if (infoBlock.check()) {
        infoBlock.remove();
        removeBorder(actualElement);
    }
    ;
    body.removeEventListener('click', clickHandler);
};
chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === "start") {
        startMode();
    }
    if (request.action === "stop") {
        stopMode();
    }
});
