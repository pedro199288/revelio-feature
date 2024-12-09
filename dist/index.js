// src/utils.ts
function arrayFromClassesString(classString) {
  return classString.split(" ").map((c) => c.trim()).filter(Boolean);
}
function getNumberFromString(string) {
  return Number(string.replace(/[^0-9]/g, ""));
}

// src/revelio/index.ts
var defaultOptions = {
  rootElement: document.body,
  placement: "bottom",
  fallbackPlacementToCenter: false,
  preventScrollIntoView: false,
  disableBlink: false,
  persistBlink: false,
  disableClick: false,
  goNextOnClick: false,
  requireClickToGoNext: undefined,
  awaitElementTimeout: 5000,
  animatedElements: [],
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
  _fallbackPlacementToCenter = defaultOptions.fallbackPlacementToCenter;
  _preventScrollIntoView = defaultOptions.preventScrollIntoView;
  _disableBlink = defaultOptions.disableBlink;
  _persistBlink = defaultOptions.persistBlink;
  _disableClick = defaultOptions.disableClick;
  _goNextOnClick = defaultOptions.goNextOnClick;
  _requireClickToGoNext = defaultOptions.requireClickToGoNext;
  _awaitElementTimeout = defaultOptions.awaitElementTimeout;
  _animatedElements = defaultOptions.animatedElements;
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
  _createError(error) {
    if (Revelio._started === true) {
      this._transitionBlocked = false;
      Revelio._started = false;
      this.end();
      this.resetJourney();
    }
    return new Error(error);
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
    if (!e) {
      throw this._createError(`Element ${element} not found`);
    }
    if (!(e instanceof HTMLElement)) {
      throw this._createError(`Element ${element} is not an HTMLElement`);
    }
    return e;
  }
  async _setStepProps() {
    const stepOptions = this._journey[this._currentIndex]?.options;
    const rootElement = await this._getElement(stepOptions?.rootElement ?? this._baseConfig.rootElement);
    this._rootElement = rootElement;
    this._placement = stepOptions?.placement ?? this._baseConfig.placement;
    this._fallbackPlacementToCenter = stepOptions?.fallbackPlacementToCenter ?? this._baseConfig.fallbackPlacementToCenter;
    this._preventScrollIntoView = stepOptions?.preventScrollIntoView ?? this._baseConfig.preventScrollIntoView;
    this._disableBlink = stepOptions?.disableBlink ?? this._baseConfig.disableBlink;
    this._persistBlink = stepOptions?.persistBlink ?? this._baseConfig.persistBlink;
    this._disableClick = stepOptions?.disableClick ?? this._baseConfig.disableClick;
    this._goNextOnClick = stepOptions?.requireClickToGoNext ?? this._baseConfig.requireClickToGoNext ?? stepOptions?.goNextOnClick ?? this._baseConfig.goNextOnClick;
    this._requireClickToGoNext = stepOptions?.requireClickToGoNext ?? this._baseConfig.requireClickToGoNext;
    this._awaitElementTimeout = stepOptions?.awaitElementTimeout ?? this._baseConfig.awaitElementTimeout;
    this._animatedElements = stepOptions?.animatedElements ?? this._baseConfig.animatedElements;
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
    const continueFlow = await this._onSkipBefore?.();
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
    document.documentElement.style.cssText += `--revelio-z-index: ${zIndexOverlayValue};`;
    overlay.id = "revelio-overlay";
    overlay.onclick = this.skipTour.bind(this);
    this._rootElement.appendChild(overlay);
    return overlay;
  }
  _getPlacementArray(placement) {
    switch (placement) {
      case "left":
        return [
          "left",
          "right",
          "top",
          "bottom",
          this._fallbackPlacementToCenter ? "center" : "left"
        ];
      case "right":
        return [
          "right",
          "left",
          "bottom",
          "top",
          this._fallbackPlacementToCenter ? "center" : "right"
        ];
      case "top":
        return [
          "top",
          "bottom",
          "left",
          "right",
          this._fallbackPlacementToCenter ? "center" : "top"
        ];
      case "bottom":
      default:
        return [
          "bottom",
          "top",
          "right",
          "left",
          this._fallbackPlacementToCenter ? "center" : "bottom"
        ];
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
    const viewportLeft = window.scrollX || window.pageXOffset;
    const viewportTop = window.scrollY || window.pageYOffset;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const viewportBottom = viewportTop + viewportHeight;
    const viewportRight = viewportLeft + viewportWidth;
    let currentPlacement;
    const getDialogPosition = (placementArray2) => {
      let dialogLeft2 = 0, dialogTop2 = 0;
      currentPlacement = placementArray2.shift();
      if (!currentPlacement) {
        throw this._createError("No placement specified");
      }
      if (currentPlacement === "center") {
        dialogLeft2 = viewportWidth / 2 - dialogSpaceWidth / 2;
        dialogTop2 = viewportHeight / 2 - dialogSpaceHeight / 2;
      } else {
        if (!elementPosition || !elementDimensions) {
          throw this._createError("No element position or dimensions specified");
        }
        const elementXCenter = elementPosition.left + elementDimensions.width / 2;
        const elementYCenter = elementPosition.top + elementDimensions.height / 2;
        switch (currentPlacement) {
          case "left":
            dialogLeft2 = elementPosition.left - dialogSpaceWidth;
            dialogTop2 = elementYCenter - dialogSpaceHeight / 2;
            if (dialogLeft2 < viewportLeft) {
              if (placementArray2.length > 0) {
                return getDialogPosition(placementArray2);
              }
            }
            break;
          case "right":
            dialogLeft2 = elementPosition.left + elementDimensions.width;
            dialogTop2 = elementYCenter - dialogSpaceHeight / 2;
            if (dialogLeft2 + dialogSpaceWidth > viewportRight) {
              if (placementArray2.length > 0) {
                return getDialogPosition(placementArray2);
              }
            }
            break;
          case "top":
            dialogLeft2 = elementXCenter - dialogSpaceWidth / 2;
            dialogTop2 = elementPosition.top - dialogSpaceHeight;
            if (dialogTop2 < viewportTop) {
              if (placementArray2.length > 0) {
                return getDialogPosition(placementArray2);
              }
            }
            break;
          case "bottom":
          default:
            dialogLeft2 = elementXCenter - dialogSpaceWidth / 2;
            dialogTop2 = elementPosition.top + elementDimensions.height;
            if (dialogTop2 + dialogSpaceHeight > viewportBottom) {
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
    };
    const placementArray = this._getPlacementArray(this._placement);
    const { dialogLeft, dialogTop } = getDialogPosition(placementArray);
    dialog.style.top = `clamp(${viewportTop}px, ${dialogTop}px, ${viewportBottom - dialogSpaceHeight}px)`;
    dialog.style.left = `clamp(${viewportLeft}px,
    ${dialogLeft}px, ${viewportRight - dialogSpaceWidth}px)`;
    if (currentPlacement === "center" && this._rootElement === document.body) {
      dialog.style.position = "fixed";
      dialog.style.transform = "translate(-50%, -50%)";
      dialog.style.top = "50%";
      dialog.style.left = "50%";
      dialog.style.margin = "0";
    }
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
      dialog.classList.add(...arrayFromClassesString(this._dialogClass));
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
      title.classList.add(...arrayFromClassesString(this._titleClass));
    }
    return title;
  }
  _createContent(step) {
    const content = document.createElement("div");
    content.innerHTML = step.content;
    if (this._contentClass) {
      content.classList.add(...arrayFromClassesString(this._contentClass));
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
      stepsInfo.classList.add(...arrayFromClassesString(this._stepsInfoClass));
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
      btn.classList.add(...arrayFromClassesString(this._btnClass));
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
        if (!this._requireClickToGoNext) {
          await this.nextStep();
        }
      });
      nextBtnContainer.appendChild(nextBtn);
    }
    if (this._showDoneBtn) {
      const doneBtn = this._createButton(this._doneBtnText, async () => {
        await this.end();
        await this._onDone?.();
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
  _scrollStartHandler = () => {
  };
  async _highlightAndRenderDialog(stepElement) {
    const { position, dimensions } = await this._highlightStepElement(stepElement);
    await this._renderStepDialog(this._getStep(), position, dimensions);
  }
  async _awaitAnimatedElements() {
    if (this._animatedElements.length > 0) {
      let iteratingSelector;
      const animatedElementsStillAnimatingPromises = this._animatedElements.map((selector) => {
        iteratingSelector = selector;
        return this._getElement(selector);
      }).filter(async (element) => {
        const { animationPlayState, transitionProperty } = window.getComputedStyle(await element);
        return animationPlayState === "running" || transitionProperty !== "none";
      }).map((element) => new Promise(async (resolve) => {
        let resolved = false;
        element.then((element2) => {
          const animationEndHandler = () => {
            element2.removeEventListener("animationend", animationEndHandler);
            element2.removeEventListener("transitionend", animationEndHandler);
            if (resolved)
              return;
            resolved = true;
            resolve();
          };
          element2.addEventListener("animationend", animationEndHandler);
          element2.addEventListener("transitionend", animationEndHandler);
          setTimeout(() => {
            if (resolved)
              return;
            resolved = true;
            console.warn(`A timeout was triggered to resolve the promise, the animation last too long or the 
                    found element with selector ${iteratingSelector?.toString()} is not animating`);
            resolve();
          }, 5000);
        });
      }));
      if (animatedElementsStillAnimatingPromises.length > 0) {
        await Promise.all(animatedElementsStillAnimatingPromises);
      }
    }
  }
  async _mountStep() {
    return new Promise(async (resolve) => {
      const step = this._getStep();
      if (step.element === undefined) {
        this._placement = "center";
        await this._renderStepDialog(step);
        return resolve();
      }
      await this._awaitAnimatedElements();
      const stepElement = await this._getElement(step.element);
      if (!this._preventScrollIntoView) {
        let scrollTriggered = false;
        let resolved = false;
        const scrollEndHandler = async () => {
          if (resolved)
            return;
          await this._highlightAndRenderDialog(stepElement);
          resolved = true;
          resolve();
        };
        const scrollStartHandler = async () => {
          if (!scrollTriggered) {
            scrollTriggered = true;
            const step2 = this._getStep();
            if (step2.element === undefined) {
              console.error("no element, is undefined and will only render dialog");
              this._placement = "center";
              await this._renderStepDialog(step2);
              resolved = true;
              return;
            }
          }
          clearTimeout(window.scrollEndTimer);
          window.scrollEndTimer = setTimeout(scrollEndHandler, 100);
        };
        this._scrollStartHandler = scrollStartHandler;
        window.addEventListener("scroll", this._scrollStartHandler, {
          capture: true
        });
        stepElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center"
        });
        if (!scrollTriggered) {
          setTimeout(async () => {
            if (!scrollTriggered && !resolved) {
              await this._highlightAndRenderDialog(stepElement);
              resolved = true;
              resolve();
            }
          }, 50);
        }
      } else {
        await this._highlightAndRenderDialog(stepElement);
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
    const continueFlow = await this._onStartBefore?.();
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
    await this._onStartAfter?.();
  }
  async end() {
    const continueFlow = await this._onEndBefore?.();
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
      await this._onEndAfterUnmountStep?.();
    } catch (e) {
    }
    this._currentIndex = 0;
    document.removeEventListener("keydown", this._handleKeyDown);
    Revelio._started = false;
    this._transitionBlocked = false;
    await this._onEndAfter?.();
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
  async _unmountStep() {
    const step = this._getStep();
    if (step.element !== undefined) {
      const overlay = document.querySelector("#revelio-overlay");
      if (overlay) {
        overlay.remove();
      }
      if (this._goNextOnClick) {
        const element = await this._getElement(step.element);
        element.removeEventListener("click", this._boundNextStep);
      }
    }
    this._unmountDialog();
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
    const continueFlow = await this._onNextBefore?.();
    if (continueFlow === false) {
      return;
    }
    if (this._currentIndex >= this._journey.length - 1) {
      console.warn("no next step, finishing tour");
      await this.end();
      await this._onDone?.();
      return;
    }
    this._transitionBlocked = true;
    await this._unmountStep();
    await this._onNextAfterUnmountStep?.();
    this._currentIndex += 1;
    await this._setStepProps();
    await this._mountStep();
    this._transitionBlocked = false;
    await this._onNextAfter?.();
  }
  _boundNextStep = this.nextStep.bind(this);
  async prevStep() {
    if (this._transitionBlocked) {
      return;
    }
    const continueFlow = await this._onPrevBefore?.();
    if (continueFlow === false) {
      return;
    }
    if (this._currentIndex <= 0) {
      console.warn("no prev step");
      return;
    }
    this._transitionBlocked = true;
    await this._unmountStep();
    await this._onPrevAfterUnmountStep?.();
    this._currentIndex -= 1;
    await this._setStepProps();
    await this._mountStep();
    this._transitionBlocked = false;
    await this._onPrevAfter?.();
  }
  _getStep(index = this._currentIndex) {
    const step = this._journey[index];
    if (!step) {
      throw this._createError(`Step ${index} not found`);
    }
    return step;
  }
  async _highlightStepElement(element) {
    const overlay = document.createElement("div");
    overlay.id = "revelio-overlay";
    const rect = element.getBoundingClientRect();
    const rootRect = this._rootElement.getBoundingClientRect();
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      display: grid;
      z-index: ${zIndexOverlayValue};
      grid-template: 
        "top    top    top"    ${rect.top - rootRect.top}px
        "left   focus  right"  ${rect.height}px
        "bottom bottom bottom" 1fr
        / ${rect.left - rootRect.left}px ${rect.width}px 1fr;
    `;
    const mask = document.createElement("div");
    mask.style.cssText = `
      grid-area: 1 / 1 / 4 / 4;
      background: ${this._baseConfig.overlayColor};
      pointer-events: auto;
    `;
    mask.onclick = this.skipTour.bind(this);
    const highlight = document.createElement("div");
    highlight.style.cssText = `
      grid-area: focus;
      box-shadow: 0 0 0 2px white;
      pointer-events: ${this._disableClick ? "none" : "auto"};
      ${!this._disableBlink ? "animation: revelio-blink 1s ease-in" : ""};
      ${this._persistBlink ? "animation-iteration-count: infinite" : "1"};
    `;
    if (this._goNextOnClick) {
      highlight.addEventListener("click", this._boundNextStep);
    }
    overlay.append(mask, highlight);
    this._rootElement.appendChild(overlay);
    if (!document.querySelector("#revelio-styles")) {
      const style = document.createElement("style");
      style.id = "revelio-styles";
      style.textContent = `
        @keyframes revelio-blink {
          0% { opacity: 0; }
          50% { opacity: 0.3; }
          100% { opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
    return {
      position: {
        top: rect.top - rootRect.top,
        left: rect.left - rootRect.left
      },
      dimensions: {
        width: rect.width,
        height: rect.height
      }
    };
  }
}
export {
  Revelio
};
