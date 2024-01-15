// src/utils.ts
var arrayFromString = function(classString) {
  return classString.split(" ").map((c) => c.trim());
};
var getNumberFromString = function(string) {
  return Number(string.replace(/[^0-9]/g, ""));
};

// src/revelio/index.ts
var defaultOptions = {
  rootElement: document.body,
  placement: "bottom",
  preventScrollIntoView: false,
  stackingContextAncestors: undefined,
  disableBlink: false,
  persistBlink: false,
  disableClick: false,
  goNextOnClick: false,
  requireClickToGoNext: undefined,
  awaitElementTimeout: 5000,
  showStepsInfo: true,
  dialogClass: "",
  titleClass: "",
  contentClass: "",
  stepsInfoClass: "",
  btnClass: "",
  preventDefaultStyles: false,
  prevBtnText: "Prev",
  nextBtnText: "Next",
  skipBtnText: "Skip",
  doneBtnText: "Done",
  showPrevBtn: true,
  showNextBtn: true,
  showSkipBtn: true,
  showDoneBtn: true,
  overlayColor: "rgba(0, 0, 0, 0.78)"
};
var zIndexValue = "10000";
var zIndexOverlayValue = "9999";

class Revelio {
  static _started;
  _baseConfig;
  _rootElement = document.body;
  _journey;
  _initialJourney;
  _currentIndex;
  _placement = defaultOptions.placement;
  _preventScrollIntoView = defaultOptions.preventScrollIntoView;
  _stackingContextAncestors = defaultOptions.stackingContextAncestors?.map((element) => ({
    element,
    originalStyles: undefined
  }));
  _disableBlink = defaultOptions.disableBlink;
  _persistBlink = defaultOptions.persistBlink;
  _disableClick = defaultOptions.disableClick;
  _goNextOnClick = defaultOptions.goNextOnClick;
  _requireClickToGoNext = defaultOptions.requireClickToGoNext;
  _awaitElementTimeout = defaultOptions.awaitElementTimeout;
  _showStepsInfo = defaultOptions.showStepsInfo;
  _dialogClass = defaultOptions.dialogClass;
  _titleClass = defaultOptions.titleClass;
  _contentClass = defaultOptions.contentClass;
  _stepsInfoClass = defaultOptions.stepsInfoClass;
  _btnClass = defaultOptions.btnClass;
  _preventDefaultStyles = defaultOptions.preventDefaultStyles;
  _prevBtnText = defaultOptions.prevBtnText;
  _nextBtnText = defaultOptions.nextBtnText;
  _skipBtnText = defaultOptions.skipBtnText;
  _doneBtnText = defaultOptions.doneBtnText;
  _showPrevBtn = defaultOptions.showPrevBtn;
  _showNextBtn = defaultOptions.showNextBtn;
  _showSkipBtn = defaultOptions.showSkipBtn;
  _showDoneBtn = defaultOptions.showDoneBtn;
  _onStartBefore;
  _onStartAfter;
  _onEndBefore;
  _onEndAfterUnmountStep;
  _onEndAfter;
  _onNextBefore;
  _onNextAfterUnmountStep;
  _onNextAfter;
  _onPrevBefore;
  _onPrevAfterUnmountStep;
  _onPrevAfter;
  _onSkipBefore;
  _onDone;
  constructor({
    journey,
    options
  }) {
    this._baseConfig = {
      ...defaultOptions,
      ...options
    };
    this._journey = journey ?? [];
    this._initialJourney = [...journey];
    this._currentIndex = 0;
  }
  get currentIndex() {
    return this._currentIndex;
  }
  get journey() {
    return this._journey;
  }
  resetJourney() {
    this._journey = [...this._initialJourney];
  }
  async goToStep(index, callbacks) {
    const continueFlow = callbacks?.onGoToStepBefore?.bind(this)();
    if (continueFlow === false) {
      return;
    }
    if (index > this._journey.length - 1 || index < 0) {
      console.warn(`Step ${index} not found`);
      return;
    }
    await this._unmountStep();
    callbacks?.onGoToStepAfterUnmountStep?.bind(this)();
    this._currentIndex = index;
    await this._setStepProps();
    await this._mountStep();
    callbacks?.onGoToStepAfter?.bind(this)();
  }
  async _getElement(element) {
    let e = null;
    if (typeof element === "string") {
      let attempts = 0;
      const attemptsInterval = 100;
      const maxAttempts = this._awaitElementTimeout / attemptsInterval;
      while (attempts < maxAttempts) {
        e = document.querySelector(element);
        if (e)
          break;
        await new Promise((resolve) => setTimeout(resolve, attemptsInterval));
        attempts += 1;
      }
    } else {
      e = element;
    }
    if (!e)
      throw new Error(`Element ${element} not found`);
    if (!(e instanceof HTMLElement))
      throw new Error(`Element ${element} is not an HTMLElement`);
    return e;
  }
  async _setStepProps() {
    const stepOptions = this._journey[this._currentIndex]?.options;
    const rootElement = await this._getElement(stepOptions?.rootElement ?? this._baseConfig.rootElement);
    this._rootElement = rootElement;
    this._placement = stepOptions?.placement ?? this._baseConfig.placement;
    this._preventScrollIntoView = stepOptions?.preventScrollIntoView ?? this._baseConfig.preventScrollIntoView;
    const stackingContextAncestors = stepOptions?.stackingContextAncestors ?? this._baseConfig.stackingContextAncestors;
    this._stackingContextAncestors = stackingContextAncestors?.map((element) => ({
      element,
      originalStyles: undefined
    }));
    this._disableBlink = stepOptions?.disableBlink ?? this._baseConfig.disableBlink;
    this._persistBlink = stepOptions?.persistBlink ?? this._baseConfig.persistBlink;
    this._disableClick = stepOptions?.disableClick ?? this._baseConfig.disableClick;
    this._goNextOnClick = stepOptions?.requireClickToGoNext ?? this._baseConfig.requireClickToGoNext ?? stepOptions?.goNextOnClick ?? this._baseConfig.goNextOnClick;
    this._requireClickToGoNext = stepOptions?.requireClickToGoNext ?? this._baseConfig.requireClickToGoNext;
    this._awaitElementTimeout = stepOptions?.awaitElementTimeout ?? this._baseConfig.awaitElementTimeout;
    this._showStepsInfo = stepOptions?.showStepsInfo ?? this._baseConfig.showStepsInfo;
    this._dialogClass = stepOptions?.dialogClass ?? this._baseConfig.dialogClass;
    this._titleClass = stepOptions?.titleClass ?? this._baseConfig.titleClass;
    this._contentClass = stepOptions?.contentClass ?? this._baseConfig.contentClass;
    this._stepsInfoClass = stepOptions?.stepsInfoClass ?? this._baseConfig.stepsInfoClass;
    this._btnClass = stepOptions?.btnClass ?? this._baseConfig.btnClass;
    this._preventDefaultStyles = stepOptions?.preventDefaultStyles ?? this._baseConfig.preventDefaultStyles;
    this._prevBtnText = stepOptions?.prevBtnText ?? this._baseConfig.prevBtnText;
    this._nextBtnText = stepOptions?.nextBtnText ?? this._baseConfig.nextBtnText;
    this._skipBtnText = stepOptions?.skipBtnText ?? this._baseConfig.skipBtnText;
    this._doneBtnText = stepOptions?.doneBtnText ?? this._baseConfig.doneBtnText;
    this._showPrevBtn = stepOptions?.showPrevBtn ?? this._currentIndex > 0;
    this._showNextBtn = stepOptions?.showNextBtn ?? this._currentIndex < this._journey.length - 1;
    this._showSkipBtn = stepOptions?.showSkipBtn ?? (this._currentIndex < this._journey.length - 1 && this._baseConfig.showSkipBtn);
    this._showDoneBtn = stepOptions?.showDoneBtn ?? (this._currentIndex === this._journey.length - 1 && this._baseConfig.showDoneBtn);
    this._onStartBefore = stepOptions?.onStartBefore ?? this._baseConfig.onStartBefore;
    this._onStartAfter = stepOptions?.onStartAfter ?? this._baseConfig.onStartAfter;
    this._onEndBefore = stepOptions?.onEndBefore ?? this._baseConfig.onEndBefore;
    this._onEndAfterUnmountStep = stepOptions?.onEndAfterUnmountStep ?? this._baseConfig.onEndAfterUnmountStep;
    this._onEndAfter = stepOptions?.onEndAfter ?? this._baseConfig.onEndAfter;
    this._onNextBefore = stepOptions?.onNextBefore ?? this._baseConfig.onNextBefore;
    this._onNextAfterUnmountStep = stepOptions?.onNextAfterUnmountStep ?? this._baseConfig.onNextAfterUnmountStep;
    this._onNextAfter = stepOptions?.onNextAfter ?? this._baseConfig.onNextAfter;
    this._onPrevBefore = stepOptions?.onPrevBefore ?? this._baseConfig.onPrevBefore;
    this._onPrevAfterUnmountStep = stepOptions?.onPrevAfterUnmountStep ?? this._baseConfig.onPrevAfterUnmountStep;
    this._onPrevAfter = stepOptions?.onPrevAfter ?? this._baseConfig.onPrevAfter;
    this._onSkipBefore = stepOptions?.onSkipBefore ?? this._baseConfig.onSkipBefore;
    this._onDone = stepOptions?.onDone ?? this._baseConfig.onDone;
  }
  async skipTour() {
    if (this._transitionBlocked) {
      return;
    }
    const continueFlow = this._onSkipBefore?.();
    if (continueFlow === false) {
      return;
    }
    this._transitionBlocked = true;
    await this.end();
    this._transitionBlocked = false;
  }
  _renderOverlay() {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = this._baseConfig.overlayColor;
    overlay.style.zIndex = zIndexOverlayValue;
    overlay.id = "revelio-overlay";
    overlay.onclick = this.skipTour.bind(this);
    this._rootElement.appendChild(overlay);
    return overlay;
  }
  _getPlacementArray(placement) {
    switch (placement) {
      case "left":
        return ["left", "right", "top", "bottom", "center"];
      case "right":
        return ["right", "left", "bottom", "top", "center"];
      case "top":
        return ["top", "bottom", "left", "right", "center"];
      case "bottom":
      default:
        return ["bottom", "top", "right", "left", "center"];
      case "center":
        return ["center"];
    }
  }
  _setDialogPosition(dialog, elementPosition, elementDimensions) {
    const dialogBoundingRect = dialog.getBoundingClientRect();
    const dialogComputedStyle = window.getComputedStyle(dialog);
    const dialogMargin = getNumberFromString(dialogComputedStyle.margin);
    const dialogSpaceWidth = dialogBoundingRect.width + dialogMargin * 2;
    const dialogSpaceHeight = dialogBoundingRect.height + dialogMargin * 2;
    const rootElementRect = this._rootElement.getBoundingClientRect();
    const rootElementWidth = rootElementRect.width;
    const rootElementHeight = rootElementRect.height;
    function getDialogPosition(placementArray2) {
      let dialogLeft2 = 0, dialogTop2 = 0;
      const currentPlacement = placementArray2.shift();
      if (!currentPlacement) {
        throw new Error("No placement specified");
      }
      if (currentPlacement === "center") {
        dialogLeft2 = rootElementWidth / 2 - dialogSpaceWidth / 2;
        dialogTop2 = rootElementHeight / 2 - dialogSpaceHeight / 2;
      } else {
        if (!elementPosition || !elementDimensions) {
          throw new Error("No element position or dimensions specified");
        }
        const elementXCenter = elementPosition.left + elementDimensions.width / 2;
        const elementYCenter = elementPosition.top + elementDimensions.height / 2;
        switch (currentPlacement) {
          case "left":
            dialogLeft2 = elementPosition.left - dialogSpaceWidth;
            dialogTop2 = elementYCenter - dialogSpaceHeight / 2;
            if (dialogLeft2 < rootElementRect.left) {
              if (placementArray2.length > 0) {
                return getDialogPosition(placementArray2);
              }
            }
            break;
          case "right":
            dialogLeft2 = elementPosition.left + elementDimensions.width;
            dialogTop2 = elementYCenter - dialogSpaceHeight / 2;
            if (dialogLeft2 + dialogSpaceWidth > rootElementRect.right) {
              if (placementArray2.length > 0) {
                return getDialogPosition(placementArray2);
              }
            }
            break;
          case "top":
            dialogLeft2 = elementXCenter - dialogSpaceWidth / 2;
            dialogTop2 = elementPosition.top - dialogSpaceHeight;
            if (dialogTop2 < rootElementRect.top) {
              if (placementArray2.length > 0) {
                return getDialogPosition(placementArray2);
              }
            }
            break;
          case "bottom":
          default:
            dialogLeft2 = elementXCenter - dialogSpaceWidth / 2;
            dialogTop2 = elementPosition.top + elementDimensions.height;
            if (dialogTop2 + dialogSpaceHeight > rootElementRect.bottom) {
              if (placementArray2.length > 0) {
                return getDialogPosition(placementArray2);
              }
            }
            break;
        }
      }
      return {
        dialogLeft: dialogLeft2,
        dialogTop: dialogTop2
      };
    }
    const placementArray = this._getPlacementArray(this._placement);
    const { dialogLeft, dialogTop } = getDialogPosition(placementArray);
    dialog.style.top = `clamp(0px, ${dialogTop}px, ${rootElementHeight - dialogSpaceHeight}px)`;
    dialog.style.left = `clamp(0px, ${dialogLeft}px, ${rootElementWidth - dialogSpaceWidth}px)`;
    setTimeout(() => {
      dialog.style.visibility = "";
    }, 25);
  }
  _createDialog() {
    const dialog = document.createElement("div");
    if (!this._preventDefaultStyles) {
      dialog.style.backgroundColor = "white";
      dialog.style.maxWidth = "300px";
      dialog.style.maxHeight = "300px";
      dialog.style.overflowY = "auto";
      dialog.style.padding = "1rem";
      dialog.style.margin = "1rem";
      dialog.style.borderRadius = "0.5rem";
      dialog.style.boxShadow = "0 0 0.5rem rgba(0, 0, 0, 0.5)";
      dialog.style.width = "300px";
    }
    dialog.id = "revelio-dialog";
    dialog.style.position = "absolute";
    dialog.style.zIndex = zIndexValue;
    dialog.style.visibility = "hidden";
    if (this._dialogClass) {
      dialog.classList.add(...arrayFromString(this._dialogClass));
    }
    return dialog;
  }
  _createTitle(step) {
    const title = document.createElement("div");
    title.textContent = step.title;
    if (!this._preventDefaultStyles) {
      title.style.fontWeight = "bold";
      title.style.fontSize = "1.5rem";
      title.style.marginBottom = "1rem";
    }
    if (this._titleClass) {
      title.classList.add(...arrayFromString(this._titleClass));
    }
    return title;
  }
  _createContent(step) {
    const content = document.createElement("div");
    content.innerHTML = step.content;
    if (this._contentClass) {
      content.classList.add(...arrayFromString(this._contentClass));
    }
    return content;
  }
  _createStepsInfo() {
    const stepsInfo = document.createElement("div");
    if (!this._preventDefaultStyles) {
      stepsInfo.style.display = "flex";
      stepsInfo.style.justifyContent = "center";
      stepsInfo.style.marginTop = "0.5rem";
      stepsInfo.style.marginBottom = "1rem";
      stepsInfo.style.fontSize = "0.75rem";
      stepsInfo.style.color = "rgba(0, 0, 0, 0.5)";
    }
    stepsInfo.textContent = `${this._currentIndex + 1}/${this._journey.length}`;
    if (this._stepsInfoClass) {
      stepsInfo.classList.add(...arrayFromString(this._stepsInfoClass));
    }
    return stepsInfo;
  }
  _createButton(text, onClick) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.addEventListener("click", onClick);
    if (!this._preventDefaultStyles) {
      btn.style.padding = "0.25rem 1rem";
      btn.style.borderRadius = "0.25rem";
      btn.style.border = "none";
      btn.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
      btn.style.cursor = "pointer";
      btn.style.fontWeight = "600";
      btn.style.fontSize = "1rem";
    }
    if (this._btnClass) {
      btn.classList.add(...arrayFromString(this._btnClass));
    }
    return btn;
  }
  _createButtonsContainer() {
    const buttonsContainer = document.createElement("div");
    buttonsContainer.style.display = "grid";
    buttonsContainer.style.gridTemplateColumns = "1fr 1fr 1fr";
    buttonsContainer.style.gap = "1rem";
    buttonsContainer.style.marginTop = "1rem";
    const prevBtnContainer = document.createElement("div");
    const nextBtnContainer = document.createElement("div");
    const centerBtnContainer = document.createElement("div");
    prevBtnContainer.style.justifySelf = "start";
    nextBtnContainer.style.justifySelf = "end";
    centerBtnContainer.style.justifySelf = "center";
    if (this._showPrevBtn) {
      const prevBtn = this._createButton(this._prevBtnText, async () => {
        await this.prevStep();
      });
      prevBtnContainer.appendChild(prevBtn);
    }
    if (this._showNextBtn) {
      const nextBtn = this._createButton(this._nextBtnText, async () => {
        await this.nextStep();
      });
      nextBtnContainer.appendChild(nextBtn);
    }
    if (this._showDoneBtn) {
      const doneBtn = this._createButton(this._doneBtnText, async () => {
        await this.end();
        this._onDone?.();
      });
      nextBtnContainer.appendChild(doneBtn);
    }
    if (this._showSkipBtn) {
      const skipBtn = this._createButton(this._skipBtnText, this.skipTour.bind(this));
      centerBtnContainer.appendChild(skipBtn);
    }
    buttonsContainer.appendChild(prevBtnContainer);
    buttonsContainer.appendChild(centerBtnContainer);
    buttonsContainer.appendChild(nextBtnContainer);
    return buttonsContainer;
  }
  async _createOrMoveRootOverlay() {
    let currentRootOverlay = document.querySelector("#revelio-overlay");
    if (currentRootOverlay) {
      this._rootElement.appendChild(currentRootOverlay);
    } else {
      currentRootOverlay = this._renderOverlay();
    }
    currentRootOverlay ??= document.querySelector("#revelio-overlay");
    if (!currentRootOverlay) {
      this._renderOverlay();
    }
  }
  async _renderStepDialog(step, elementPosition, elementDimensions) {
    const dialog = this._createDialog();
    const title = this._createTitle(step);
    dialog.appendChild(title);
    const content = this._createContent(step);
    dialog.appendChild(content);
    if (this._showStepsInfo) {
      const stepsInfo = this._createStepsInfo();
      dialog.appendChild(stepsInfo);
    }
    const buttonsContainer = this._createButtonsContainer();
    dialog.appendChild(buttonsContainer);
    await this._createOrMoveRootOverlay();
    this._rootElement.appendChild(dialog);
    this._setDialogPosition(dialog, elementPosition, elementDimensions);
  }
  _createBlinkOverlay(element, top, left, width, height) {
    const blinkOverlay = document.createElement("div");
    blinkOverlay.style.position = "absolute";
    blinkOverlay.style.top = `${top}px`;
    blinkOverlay.style.left = `${left}px`;
    blinkOverlay.style.width = `${width}px`;
    blinkOverlay.style.height = `${height}px`;
    blinkOverlay.style.backgroundColor = "white";
    blinkOverlay.style.opacity = "0.0";
    blinkOverlay.style.boxShadow = "0 0 5px white, 0 0 25px white, 0 0 50px white, 0 0 100px";
    blinkOverlay.style.zIndex = zIndexValue;
    blinkOverlay.style.pointerEvents = "none";
    blinkOverlay.style.borderRadius = window.getComputedStyle(element).borderRadius;
    blinkOverlay.id = "revelio-blink-overlay";
    this._rootElement.appendChild(blinkOverlay);
    blinkOverlay.animate([
      {
        opacity: 0
      },
      {
        opacity: 0.3
      },
      {
        opacity: 0
      }
    ], {
      duration: 1000,
      iterations: this._persistBlink ? Infinity : 1,
      easing: "ease-in"
    });
  }
  async _createStackedContextsOverlays() {
    if (this._stackingContextAncestors) {
      await Promise.all(this._stackingContextAncestors.map(async (ancestor, idx) => {
        const stackingContextAncestorElement = await this._getElement(ancestor.element);
        ancestor.originalStyles = { ...stackingContextAncestorElement.style };
        stackingContextAncestorElement.style.zIndex = zIndexValue;
        const elementComputedStyle = window.getComputedStyle(stackingContextAncestorElement);
        if (elementComputedStyle.position === "static") {
          stackingContextAncestorElement.style.position = "relative";
        }
        const overlay = document.createElement("div");
        overlay.id = `revelio-ancestor-overlay-${idx}`;
        overlay.style.position = "absolute";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        if (elementComputedStyle.backgroundColor !== "rgba(0, 0, 0, 0)") {
          overlay.style.backgroundColor = this._baseConfig.overlayColor;
        }
        overlay.style.zIndex = zIndexOverlayValue;
        overlay.onclick = this.skipTour.bind(this);
        stackingContextAncestorElement.appendChild(overlay);
      }));
    }
  }
  async _highlightStepElement(element) {
    await this._createStackedContextsOverlays();
    const elementComputedStyle = window.getComputedStyle(element);
    element.style.zIndex = zIndexValue;
    if (elementComputedStyle.position === "static") {
      element.style.position = "relative";
    }
    if (this._disableClick) {
      element.style.pointerEvents = "none";
    }
    if (this._goNextOnClick) {
      element.addEventListener("click", this._boundNextStep);
    }
    const elementRect = element.getBoundingClientRect();
    const rootRect = this._rootElement.getBoundingClientRect();
    const top = elementRect.top - rootRect.top;
    const left = elementRect.left - rootRect.left;
    const { width, height } = elementRect;
    if (!this._disableBlink) {
      this._createBlinkOverlay(element, top, left, width, height);
    }
    return {
      position: {
        top,
        left
      },
      dimensions: {
        width,
        height
      }
    };
  }
  _getStep(index = this._currentIndex) {
    const step = this._journey[index];
    if (!step) {
      throw new Error(`Step ${this._currentIndex} not found`);
    }
    return step;
  }
  _scrollStartHandler = () => {
  };
  async _mountStep() {
    return new Promise(async (resolve) => {
      const step = this._getStep();
      if (step.element === undefined) {
        this._placement = "center";
        await this._renderStepDialog(step);
        return resolve();
      }
      const stepElement = await this._getElement(step.element);
      let scrollTriggered = false;
      let resolved = false;
      const scrollStartHandler = async () => {
        scrollTriggered = true;
        const step2 = this._getStep();
        if (step2.element === undefined) {
          this._placement = "center";
          await this._renderStepDialog(step2);
          return;
        }
        const stepElement2 = await this._getElement(step2.element);
        const scrollEndHandler = async () => {
          const { position: position2, dimensions: dimensions2 } = await this._highlightStepElement(stepElement2);
          await this._renderStepDialog(step2, position2, dimensions2);
          resolved = true;
          resolve();
        };
        this._unmountDialog();
        this._unmountBlinkOverlay();
        window.addEventListener("scrollend", scrollEndHandler, {
          capture: true,
          once: true
        });
      };
      this._scrollStartHandler = scrollStartHandler;
      if (!this._preventScrollIntoView) {
        window.addEventListener("scroll", this._scrollStartHandler, {
          capture: true,
          once: true
        });
        stepElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center"
        });
      }
      const { position, dimensions } = await this._highlightStepElement(stepElement);
      this._renderStepDialog(step, position, dimensions);
      if (!this._preventScrollIntoView) {
        setTimeout(() => {
          if (!scrollTriggered && !resolved) {
            resolve();
          }
        }, 50);
      } else {
        resolve();
      }
    });
  }
  _transitionBlocked = false;
  _handleKeyDown = async (event) => {
    switch (event.key) {
      case "ArrowRight":
        if (this._requireClickToGoNext) {
          return;
        }
        await this.nextStep();
        break;
      case "ArrowLeft":
        await this.prevStep();
        break;
      case "Escape":
        await this.skipTour();
        break;
    }
  };
  async start() {
    const continueFlow = this._onStartBefore?.();
    if (continueFlow === false) {
      return;
    }
    if (Revelio._started) {
      console.warn("Another Revelio tour is already started");
      return;
    }
    this._transitionBlocked = true;
    document.addEventListener("keydown", this._handleKeyDown);
    Revelio._started = true;
    this._currentIndex = 0;
    await this._setStepProps();
    await this._mountStep();
    this._transitionBlocked = false;
    this._onStartAfter?.();
  }
  async end() {
    const continueFlow = this._onEndBefore?.();
    if (continueFlow === false) {
      return;
    }
    this._transitionBlocked = true;
    const overlay = this._rootElement.querySelector("#revelio-overlay");
    if (overlay) {
      this._rootElement.removeChild(overlay);
    }
    try {
      await this._unmountStep();
      this._onEndAfterUnmountStep?.();
    } catch (e) {
      console.error(e);
    }
    this._currentIndex = 0;
    document.removeEventListener("keydown", this._handleKeyDown);
    Revelio._started = false;
    this._transitionBlocked = false;
    this._onEndAfter?.();
  }
  _unmountDialog() {
    const dialog = this._rootElement.querySelector("#revelio-dialog");
    if (dialog) {
      this._rootElement.removeChild(dialog);
    }
  }
  _unmountBlinkOverlay() {
    const blinkOverlay = this._rootElement.querySelector("#revelio-blink-overlay");
    if (blinkOverlay) {
      this._rootElement.removeChild(blinkOverlay);
    }
  }
  async _removeStackingContextAncestorsOverlays() {
    if (this._stackingContextAncestors) {
      await Promise.all(this._stackingContextAncestors.map(async (ancestor, idx) => {
        const stackingContextAncestorElement = await this._getElement(ancestor.element);
        stackingContextAncestorElement.style.zIndex = ancestor.originalStyles?.zIndex ?? "";
        stackingContextAncestorElement.style.position = ancestor.originalStyles?.position ?? "";
        if (!stackingContextAncestorElement.getAttribute("style")?.trim()) {
          stackingContextAncestorElement.removeAttribute("style");
        }
        const overlay = document.querySelector(`#revelio-ancestor-overlay-${idx}`);
        if (overlay) {
          stackingContextAncestorElement.removeChild(overlay);
        }
      }));
    }
  }
  async _unmountStep() {
    const step = this._getStep();
    this._unmountDialog();
    if (step.element !== undefined) {
      const element = await this._getElement(step.element);
      element.style.zIndex = "";
      element.style.position = "";
      if (!element.getAttribute("style")?.trim()) {
        element.removeAttribute("style");
      }
      if (this._goNextOnClick) {
        element.removeEventListener("click", this._boundNextStep);
      }
      this._unmountBlinkOverlay();
    }
    await this._removeStackingContextAncestorsOverlays();
    window.removeEventListener("scroll", this._scrollStartHandler, {
      capture: true
    });
  }
  addStep(step, position) {
    if (position === undefined) {
      this._journey.push(step);
    } else {
      this._journey.splice(position, 0, step);
    }
  }
  removeStep(position) {
    if (position === undefined) {
      this._journey.pop();
    } else {
      this._journey.splice(position, 1);
    }
  }
  async nextStep() {
    if (this._transitionBlocked) {
      return;
    }
    const continueFlow = this._onNextBefore?.();
    if (continueFlow === false) {
      return;
    }
    if (this._currentIndex >= this._journey.length - 1) {
      console.warn("no next step, finishing tour");
      await this.end();
      this._onDone?.();
      return;
    }
    this._transitionBlocked = true;
    await this._unmountStep();
    this._onNextAfterUnmountStep?.();
    this._currentIndex += 1;
    await this._setStepProps();
    await this._mountStep();
    this._transitionBlocked = false;
    this._onNextAfter?.();
  }
  _boundNextStep = this.nextStep.bind(this);
  async prevStep() {
    if (this._transitionBlocked) {
      return;
    }
    const continueFlow = this._onPrevBefore?.();
    if (continueFlow === false) {
      return;
    }
    if (this._currentIndex <= 0) {
      console.warn("no prev step");
      return;
    }
    this._transitionBlocked = true;
    await this._unmountStep();
    this._onPrevAfterUnmountStep?.();
    this._currentIndex -= 1;
    await this._setStepProps();
    await this._mountStep();
    this._transitionBlocked = false;
    this._onPrevAfter?.();
  }
}
var revelio_default = Revelio;
export {
  revelio_default as Revelio
};
