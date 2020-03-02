/**
 * Параметры блока INFOBLOCK
 * @type {object}
 */
let infoBlockSetting = {
  WIDTH: 300,
  HEIGHT: 145,
  TARGET_BORDER: '0px 0px 10px 0px #ff5a5a'
};

/**
 * Код клавиш для отслеживания события их нажатия.
 * @type {object}
 */
let keyCode = {
  ESC: 27
};

class ElementUI {
  protected _tag: string
  protected _class: string
  protected _id: string
  protected _root: any

  constructor (tag: string, classes: string, id: string, root: any) {
    this._tag = tag
    this._class = classes
    this._id = id
    this._root = root
  }

  protected create(): any {
    let element = document.createElement(this._tag);
    element.classList.add(this._class);
    element.setAttribute('id', this._id);
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

  getClass(): string {
    return this._class;
  }
};

class BlockElementUI extends ElementUI {
  position: string
  positionTop: string
  positionLft: string

  constructor (tag: string, classes: string, id: string, root: any, bPos?: string, bPosTop?: number, bPosLft?: number) {
    super(tag, classes, id, root)
    if (bPos) {
      this.position = bPos
      this.positionTop = bPosTop + '%'
      this.positionLft = bPosLft + 'px'
    }
  }

  protected create(): any {
    let element = document.createElement(this._tag);
    element.classList.add(this._class);
    element.setAttribute('id', this._id);
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

  constructor (tag: string, classes: string, id: string, root: any, aContent: string) {
    super(tag, classes, id, root)
    this.content = aContent
  }

  protected create(): any {
    let element = document.createElement(this._tag);
    element.classList.add(this._class);
    element.setAttribute('id', this._id);
    element.innerText = this.content;
    return element;
  }
};

class ButtonElementUI extends ElementUI {
  content: string
  type: string

  constructor (tag: string, classes: string, id: string, root: any, btnContent: string, btnType: string) {
    super(tag, classes, id, root)
    this.content = btnContent
    this.type = btnType
  }

  protected create(): any {
    let element = document.createElement(this._tag);
    element.classList.add(this._class);
    element.setAttribute('id', this._id);
    element.innerText = this.content;
    element.setAttribute('type', this.type);
    return element;
  }
}

// FUNCTIONS - start

/**
 * Расчитать координаты позиционирования блока INFOBLOCK.
 * @param event {event.object}
 * @return {number, number}
 */
let getPosition = function (event: any): any {
  /**
   * Размер ширины рабочей области окна браузера
   * @type {number}
   */
  let screenWidht = event.view.innerWidth;

  /**
   * Размер высоты рабочей области окна браузера
   * @type {number}
   */
  let screenHeight = event.view.innerHeight;

  /**
   * Координата курсора при возникновении события 'click'
   * по оси X
   * @type {number}
   */
  let currentX = event.clientX;

  /** Координата курсора при возникновении события 'click'
   * по оси Y
   * @type {number}
   */
  let currentY = event.clientY;

  /**
   * Если (позиция курсора по оси X + ширина блока INFOBLOCK)
   * >= ширины экрана, то для координата x берется
   * равная (координата X - ширина блока INFOBLOCK)
   */
  if (currentX + infoBlockSetting.WIDTH >= screenWidht) {
    currentX = currentX - infoBlockSetting.WIDTH;
  }

  /**
   * Если (позиция курсора по оси Y + высота блока INFOBLOCK)
   * >= высоты экрана, то для координата y берется
   * равная (координата Y - высота блока INFOBLOCK)
   */
  if (currentY + infoBlockSetting.HEIGHT >= screenHeight) {
    currentY = currentY - infoBlockSetting.HEIGHT;
  }

  return {
    "x": currentX,
    "y": currentY
  };
};

/**
 * Получить информации о переданном элементе (название тега,
 * имя класса(-ов) стилизации, количество элементов-потомков, имя
 * класса(-ов) элемента-родителя).
 * @param target
 * @return {string, string, number, string}
 */
let getInfo = function (target: any): any {
  return {
    'name': target.tagName,
    'class': target.className,
    'children': target.children.length,
    'parentClass': target.parentNode.className
  };
};

/**
 * Добавить рамку-обводку для указанного элемента.
 * @param element
 * @return void
 */
let addBorder = function (element: any): void {
  element.style.boxShadow = infoBlockSetting.TARGET_BORDER;
};

/**
 * Удалить рамку-обводку для указанного элемента.
 * @param element
 * @return void
 */
let removeBorder = function (element: any): void {
  element.style.boxShadow = '';
};

// FUNCTIONS - end

// HANDLERS - start

/**
 * Обработчик события для кнопки 'x2' блока CONTROLSBLOCK.
 * @param xAllEvt {event.object}
 * @return void
 */
let doubleAllHandler = function (xAllEvt): void {
  xAllEvt.preventDefault();

  /**
   * Массив имен тегов, которые следует исключить из работы функции.
   * @type {string[]}
   */
  let ignoreElements: string[] = ["SCRIPT", "PICTURE", "SOURCE", "IMG", "SVG", "USE", "PATH", "LEGEND"];

  let brElement: string = 'BR';

  /**
   * Вернуть удвоенный текстовый контент элемента, переданного в параметре функции
   * @param content {string}
   * @type {string}
   */
  let doubleContent = function (content): string {
    return content + ' ' + content;
  };

  /**
   * Перебрать дочерние элементы указанного блока. Заменить у элементов
   * имеющих текстовый тип, содержимое на результат работы функции doubleContent.
   * @param parent {object}
   * @return void
   */
  let checkContent = function (parent: any): void {
    /**
     * Название класса блока CONTROLSBLOCK
     * @type {string}
     */
    let controlsBlockClass: string = controlsBlock.getClass();

    /**
     * Если блок относиться к блоку CONTROLSBLOCK выйти из функции
     */
    if (parent.className === controlsBlockClass || parent.parentNode.className === controlsBlockClass) {
      return;
    }

    /**
     * Если количество элементов-детей равно '0' проверить
     * соответствует ли название элемента именам из списка исключений.
     * Если имя соответствует имени из списка ислючений - выйти из функции.
     * В обратном случае, если длина текста элемента не равна 0 - заменить
     * тестовое содержимое на результат работы функции doubleContent.
     */
    if (parent.children.length === 0) {
      ignoreElements.forEach((item) => {
        if (parent.nodeName === item) {
          return;
        }
      });
      if (parent.innerHTML.length !== 0) {
        parent.innerHTML = doubleContent(parent.innerHTML);
      }
    }

    /**
     * Если количество элементов-детей больше '0' проверить является ли
     * вложенный элемент элементом BR. В случае если это так, заменить
     * тестовое содержимое на результат работы функции doubleContent.
     * Запустить функцию рекурсивно, указав атрибутом функции элемент-потомок.
     */
    if (parent.children.length > 0) {
      if (parent.children[0].nodeName === brElement) {
        parent.innerHTML = doubleContent(parent.innerHTML);
      }
      for (let element of parent.children) {
        checkContent(element);
      }
    }
  };

  /**
   * Запустить функцию перебора элементов и замены текстового содержимого
   * для элемента BODY.
   */
  checkContent(body);
};

/**
 * Обработчик события для кнопки 'lg' блока CONTROLSBLOCK.
 * @param lgAllEvt {event.object}
 * @return void
 */
let longAllHandler = function (lgAllEvt): void {
  lgAllEvt.preventDefault();

  /**
   * Массив имен тегов, которые следует исключить из работы функции.
   * @type {string[]}
   */
  let ignoreElements: string[] = ["SCRIPT", "PICTURE", "SOURCE", "IMG", "SVG", "USE", "PATH", "LEGEND"];

  let brElement: string = 'BR';

  /**
   * Текст-заменитель - длинная строка.
   * @type {string}
   */
  let loremText: string = 'EyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökullEyjafjallajökull';

  /**
   * Перебрать дочерние элементы указанного блока. Заменить у элементов
   * имеющих текстовый тип, содержимое на текст-заменитель.
   * @param parent {object}
   * @return void
   */
  let checkContent = function (parent: any): void {
    /**
     * Название класса блока CONTROLSBLOCK
     * @type {string}
     */
    let controlsBlockClass: string = controlsBlock.getClass();

    /**
     * Если блок относиться к блоку CONTROLSBLOCK выйти из функции
     */
    if (parent.className === controlsBlockClass || parent.parentNode.className === controlsBlockClass) {
      return;
    }

    /**
     * Если количество элементов-потомков равно '0' проверить
     * соответствует ли название элемента именам из списка исключений.
     * Если имя соответствует имени из списка ислючений - выйти из функции.
     * В обратном случае, если длина текста элемента не равна 0 - заменить
     * тестовое содержимое на текст-заменитель.
     */
    if (parent.children.length === 0) {
      ignoreElements.forEach((item) => {
        if (parent.nodeName === item) {
          return;
        }
      });
      if (parent.innerHTML.length !== 0) {
        parent.innerHTML = loremText;
      }
    }

    /**
     * Если количество элементов-потмков больше '0' проверить является ли
     * вложенный элемент элементом BR. В случае если это так, заменить
     * тестовое содержимое на текст-заменитель.
     * Запустить функцию рекурсивно, указав атрибутом функции элемент-потомок.
     */
    if (parent.children.length > 0) {
      if (parent.children[0].nodeName === brElement) {
        parent.innerHTML = loremText;
      }
      for (let element of parent.children) {
        checkContent(element);
      }
    }
  };

  /**
   * Запустить функцию перебора элементов и замены текстового содержимого
   * для элемента BODY.
   */
  checkContent(body);
};

/**
 * Обработчик события для кнопки 'im' блока CONTROLSBLOCK.
 * @param imAllEvt {event.object}
 * @return void
 */
let imgAllHandler = function (imAllEvt): void {
  imAllEvt.preventDefault();

  let imgElement: string = 'IMG';
  let sourceElement: string = 'SOURCE';

  /**
   * Имя файла несуществующего изображения.
   * @type {string}
   */
  let emptyUrl: string = 'noimage.webp';

  /**
   * Перебрать дочерние элементы указанного блока. Заменить у элементов
   * <img> url изображения на несуществующий.
   * @param parent {object}
   * @return void
   */
  let checkContent = function (parent: any): void {
    /**
     * Название класса блока CONTROLSBLOCK
     * @type {string}
     */
    let controlsBlockClass: string = controlsBlock.getClass();

    /**
     * Если блок относиться к блоку CONTROLSBLOCK выйти из функции
     */
    if (parent.className === controlsBlockClass || parent.parentNode.className === controlsBlockClass) {
      return;
    }

    /**
     * Если количество элементов-потомокв равно '0' проверить
     * соответствует ли название элемента именам IMG или SOURCE.
     * В случае если условие выполняется, заменить аттрибуты соответствующие
     * адресу изображения на несуществующий.
     */
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

    /**
     * Если количество элементов-потомков больше '0' запустить функцию
     * рекурсивно, указав атрибутом функции элемент-потомок.
     */
    if (parent.children.length > 0) {
      for (let element of parent.children) {
        checkContent(element);
      }
    }
  }

  /**
   * Запустить функцию перебора элементов и замены url
   * изображения для элемента BODY.
   */
  checkContent(body);
};

/**
 * Обработчик события для кнопки 'bg' блока CONTROLSBLOCK.
 * @param bgAllEvt {event.object}
 * @return void
 */
let bgAllHandler = function (bgAllEvt): void {
  bgAllEvt.preventDefault();

  /**
   * Параметр атрибута 'background-image'. Ссылка на файл
   * которого не существует.
   * @type {string}
   */
  let emptyUrl: string = 'url("noimage.webp")';

  /**
   * Перебрать дочерние элементы указанного блока. Заменить у элементов,
   * имеющих CSS-свойство background-image, url фонового изображения
   * на несуществующий.
   * @param parent {object}
   * @return void
   */
  let checkContent = function (parent: any): void {

    /**
     * Название класса блока CONTROLSBLOCK
     * @type {string}
     */
    let controlsBlockClass: string = controlsBlock.getClass();

    /**
     * Если блок относиться к блоку CONTROLSBLOCK выйти из функции
     */
    if (parent.className === controlsBlockClass || parent.parentNode.className === controlsBlockClass) {
      return;
    }

    /**
     * Массив вычисленных значений стилизации элементов указанного блока.
     * @type {objects[]}
     */
    let computedStyle = getComputedStyle(parent);

    /**
     * Если значение свойства background-image блока не равно 'none'
     * заменить url свойства на несуществующий.
     */
    if (computedStyle.backgroundImage !== 'none') {
      parent.style.backgroundImage = emptyUrl;
    }

    /**
     * Если количество элементов-потомков больше '0' запустить функцию
     * рекурсивно, указав атрибутом функции элемент-потомок.
     */
    if (parent.children.length > 0) {
      for (let element of parent.children) {
        checkContent(element);
      }
    }
  }

  /**
   * Запустить функцию перебора элементов и удаления фонового изображения
   * для элемента BODY.
   */
  checkContent(body);
};

/**
 * Обработчик события 'click' на блоке BODY.
 * @param e {event.object}
 * @return void
 */
let clickHandler = function (e): void {
  e.preventDefault();

  /**
   * Обработчик события 'keydown' элемента document.
   * Закрыть блок INFOBLOCK если нажат ESC.
   * @param {event.object}
   * @return void
   */
  let pressEscHandler = function (btnEvt): void {
    /**
     * Если 'keydown.keyCode' = ESC, проверить наличие блока INFOBLOCK.
     */
    if (btnEvt.keyCode === keyCode.ESC) {
      /**
       * Если блок INFOBLOCK существует, удалить его, убрать
       * красную рамку-обводку с элемента и удалить событие
       * прослушивающее нажатие клавиш с элемента document.
       */
      if (infoBlock.check()) {
        infoBlock.remove();
        removeBorder(actualElement);
        document.removeEventListener('keydown', pressEscHandler);
      }
    }
  };

  /**
   * Обработчик события 'click' на элементе INFOBLOCK.
   * @param {event.object}
   * @return void
   */
  let infoBlockHandler = function (wEvt): void {
    wEvt.stopPropagation();
  };

  /**
   * Обработчик события 'click' для кнопки '2x' блока INFOBLOCK.
   * @param null
   * @return void
   */
  let doubleBtnClickHandler = function(): void {
    /**
     * Коллекция элементов-детей выбранного элемента.
     * @type {array}
     */
    let childrens = actualElement.children;

    /**
     * Ссылка на пустой объект DocumentFragment.
     * @type {object}
    */
    var fragment = document.createDocumentFragment();

    /**
     * Каждый элемент коллекции выбранного элемента,
     * клонировать и добавить к объекту DocumentFragment.
     */
    for (let i = 0; i < childrens.length; i++) {
      fragment.appendChild(childrens[i].cloneNode(true));
    }

    /**
     * Добавить содержимое объекта DocumentFragment
     * к содержимому выбранного объекта.
     */
    actualElement.appendChild(fragment);
  };

  /**
   * Обработчик события 'click' для кнопки 'На уровень выше'
   * блока INFOBLOCK.
   * @param null
   * @return void
   */
  let parentBtnClickHandler = function(): void {
    /**
     * Элемент-родитель текущего выбранного элемента,
     * сохраненного в переменную actualElement.
     * @type {object}
     */
    let parent = actualElement.parentNode;

    let rootElement = "BODY";

    /**
     * Если название аттрибута TAG элемента-родителя
     * равно 'BODY', удалить красную рамку-обводку и
     * выйти из функции.
     */
    if (parent.tagName === rootElement) {
      removeBorder(actualElement);
      return;
    }

    /**
     * Если блок INFOBLOCK существует, удалить его, убрать
     * красную рамку-обводку с элемента и удалить событие
     * прослушивающее нажатие клавиш с элемента document.
     */
    if (infoBlock.check()) {
      infoBlock.remove();
      removeBorder(actualElement);
      document.removeEventListener('keydown', pressEscHandler);
    }

    /**
     * Запустить функцию создания блока INFOBLOCK для
     * элемента-родителя текущего выбранного элемента.
     */
    infoBlockCreate(parent);
  };

  /**
   * Обработчик события 'click' для кнопки '+1'
   * блока INFOBLOCK.
   * @param null
   * @return void
   */
  let addBtnClickHandler = function(): void {
    /**
     * Элемент-родитель текущего выбранного элемента,
     * сохраненного в переменную actualElement.
     * @type {object}
     */
    let parent = actualElement.parentNode;

    /**
     * Новый элемент. Результат клонирования текущего
     * выбранного элемента, сохраненного в переменную actualElement.
     * @type {object}
     */
    let newElement = actualElement.cloneNode(true);

    removeBorder(newElement);

    /**
     * Добавить новый элемент в конец списка элементов-потомков
     * родительского элемента.
     */
    parent.appendChild(newElement);
  };

  /**
   * Обработчик события 'click' для кнопки '-1'
   * блока INFOBLOCK.
   * @param null
   * @return void
   */
  let removeBtnClickHandler = function (): void {
    /**
     * Удалить выбранный элемент из DOM.
     */
    actualElement.remove();

    /**
     * Удалить блок INFOBLOCK
     */
    infoBlock.remove();
  };

  /**
   * Создать блок INFOBLOCK, который включает в себя
   * информацию об элементе который передан в качетстве аргумента,
   * и элементы управления (копки), для манипуляций
   * над элементами-потомками данного блока.
   * @param el {object}
   * @return void
   */
  let infoBlockCreate = function (el) {
    /**
     * Координаты точки события "click".
     * @type {number, number}
     */
    let position = getPosition(e);

    /**
     * Устанавить координаты позиционирования для блока INFOBLOCK.
     */
    infoBlock.positionTop = position.y + 'px';
    infoBlock.positionLft = position.x + 'px';

    /**
     * Параметры элемента, который передан в качестве аргумента.
     * @type {string, string, number, string}
     */
    let info = getInfo(el);

    /**
     * Название класса блока CONTROLSBLOCK
     * @type {string}
     */
    let controlsBlockClass: string = controlsBlock.getClass();

    /**
     * Если событие 'click' приходиться на блок CONTROLSBLOCK выйти из функции
     */
    if (info.class === controlsBlockClass || info.parentClass === controlsBlockClass) {
      return;
    }

    /**
     * Добавить блок INFOBLOCK если его не существует,
     * если существует - удалить предыдущий и создать новый.
     * Добавить событие, которое блокирует распространение события
     * 'click' на блоке INFOBLOCK.
     */
    if (infoBlock.check()) {
      infoBlock.remove();
      infoBlock.add();
      infoBlock.get().addEventListener('click', infoBlockHandler);
    } else {
      infoBlock.add();
      infoBlock.get().addEventListener('click', infoBlockHandler);
    }

    /**
     * Добавить отслеживание события 'keydown'.
     * Если 'keydown.keyCode' = ESC, удалить блок INFOBLOCK.
     */
    document.addEventListener('keydown', pressEscHandler);

    /**
     * Если ранее какой либо блок страницы уже был выделен красной рамкой,
     * удалить обводку для этого элемента.
     */
    if (actualElement !== undefined) {
      removeBorder(actualElement);
    }

    /**
     * Добавить красную рамку для элемента страницы,
     * который передан в качестве аргумента.
     */
    addBorder(el);

    /**
     * Сохранить элемент страницы, который передан
     * в качестве аргумента в переменную.
     */
    actualElement = el;

    /**
     * Создать и добавить блок DIV, который является контейнером
     * для элементов блока INFOBLOCK
     */
    let infoWrapper = new BlockElementUI('div', 'cmanager-info__wrapper', 'cmg-info-wrapper', infoBlock.get(), 'relative', 0, 0);
    infoWrapper.add();

    /**
     * Создать и добавить элемент H3. Содержит название тега блока,
     * который передан в качестве аргумента.
     */
    let title = new ArticleElementUI('h3', 'cmanager-info__title', 'cmg-info-title', infoWrapper.get(), 'TAG: ' + info.name);
    title.add();

    /**
     * Создать и добавить элемент P. Содержит класс/классы блока,
     * который передан в качестве аргумента.
     */
    let desc = new ArticleElementUI('p', 'cmanager-info__classes', 'cmg-info-desc', infoWrapper.get(), 'CLASSES: ' + info.class);
    desc.add();

    /**
     * Создать и добавить элемент P. Содержит количество элементов-детей блока,
     * который передан в качестве аргумента.
     */
    let child = new ArticleElementUI('p', 'cmanager-info__childrens', 'cmg-info-count', infoWrapper.get(), 'CHILDRENS: ' + info.children);
    child.add();

    /**
     * Создать и добавить кнопку BUTTON. К данной кнопке добавляется событие,
     * которое позволяет перерисовать блок INFOBLOCK с информацией о родителе блока,
     * который передан в качестве аргумента (подъем на уровень выше).
     */
    let parentBtn = new ButtonElementUI('button', 'cmanager-info__btn', 'cmg-info-btn-parent', infoWrapper.get(), 'На уровень выше', 'button');
    parentBtn.add();
    parentBtn.get().addEventListener('click', parentBtnClickHandler);

    /**
     * Если количество элементов-потомков больше 0, создать кнопку.
     * К данной кнопке добавить событие, которое позволяет удвоить
     * количество элементов-потомков выбранного блока.
     */
    if (info.children > 0) {
      let doubleBtn = new ButtonElementUI('button', 'cmanager-info__btn', 'cmg-info-btn-double', infoWrapper.get(), '2x', 'button');
      doubleBtn.add();
      doubleBtn.get().addEventListener('click', doubleBtnClickHandler);
    }

    /**
     * Создать и добавить кнопку BUTTON. К данной кнопке добавляется событие,
     * которое позволяет склонировать элемент, который передан в качестве аргумента
     * и добавить его к эелементу-родителю.
     */
    let addBtn = new ButtonElementUI('button', 'cmanager-info__btn', 'cng-info-btn-add', infoWrapper.get(), '+1', 'button');
    addBtn.add();
    addBtn.get().addEventListener('click', addBtnClickHandler);

    /**
     * Создать и добавить кнопку BUTTON. К данной кнопке добавляется событие,
     * которое позволяет удалить выбранный элемент.
     */
    let removeBtn = new ButtonElementUI('button', 'cmanager-info__btn', 'cng-info-btn-removw', infoWrapper.get(), '-1', 'button');
    removeBtn.add();
    removeBtn.get().addEventListener('click', removeBtnClickHandler);
  };

  /**
   * Запустить функцию создания блока INFOBLOCK для
   * элемента на котором было совершено событие 'click'.
   */
  infoBlockCreate(e.target);
};

// HANDLERS - end

// LOGIC - start

let body = document.body;

/**
 * Создать и добавить блок DIV. Содержит элементы управления
 * всем контеннтом на странице.
 */
let controlsBlock = new BlockElementUI('div', 'cmanager-controls', 'cmg-controls', body, 'fixed', 50, 0);

/**
 * Создать и добавить блок DIV. Содержит информацию и элементы
 * управления выбранного элемента на странице.
 */
let infoBlock = new BlockElementUI('div', 'cmanager-info', 'cmg-info', body, 'fixed', 0, 0);

let actualElement = undefined;

/**
 * Запустить режим тестировнания переполнения контента.
 * @param null
 * @return void
 */
let startMode = function (): void {
  if (!controlsBlock.check()) {
    controlsBlock.add();

    let doubleBtnAll = new ButtonElementUI('button', 'cmanager-controls__btn', 'cmg-btn-double', controlsBlock.get(), 'x2', 'button');
    doubleBtnAll.add();
    doubleBtnAll.get().addEventListener('click', doubleAllHandler);

    let longBtnAll = new ButtonElementUI('button', 'cmanager-controls__btn', 'cmg-btn-long', controlsBlock.get(), 'lg', 'button');
    longBtnAll.add();
    longBtnAll.get().addEventListener('click', longAllHandler);

    let imgBtnAll = new ButtonElementUI('button', 'cmanager-controls__btn', 'cmg-btn-img', controlsBlock.get(), 'im', 'button');
    imgBtnAll.add();
    imgBtnAll.get().addEventListener('click', imgAllHandler);

    let bgBtnAll = new ButtonElementUI('button', 'cmanager-controls__btn', 'cmg-btn-bg', controlsBlock.get(), 'bg', 'button');
    bgBtnAll.add();
    bgBtnAll.get().addEventListener('click', bgAllHandler);

    body.addEventListener('click', clickHandler);
  }
};

/**
 * Завершить режим тестировнания переполнения контента.
 * @param null
 * @return void
 */
let stopMode = function (): void {
  if (controlsBlock.check()) {
    controlsBlock.remove()
  };
  if (infoBlock.check()) {
    infoBlock.remove()
    removeBorder(actualElement);
  };
  body.removeEventListener('click', clickHandler);
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
