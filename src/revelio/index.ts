/* eslint-disable no-use-before-define */
import { arrayFromString, getNumberFromString } from '../utils';

/**
 * Config that is shared between the 'options' and 'journey.[].options' properties
 */
type RevelioSharedConfig = {
  /**
   * The placement of the feature tour step. Can be 'top', 'bottom', 'left', 'right' or 'center'.
   */
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';

  /**
   * Determines whether the step dialog should be scrolled into view.
   */
  preventScrollIntoView: boolean;

  /**
   * If true, disables blinking the element for the current step.
   */
  disableBlink: boolean;

  /**
   * If true, persist the blink effect on the element for the current step.
   */
  persistBlink: boolean;

  /**
   * Disables click on highlighted element
   */
  disableClick: boolean;

  /**
   * Goes to the next step when the user clicks on the highlighted element
   */
  goNextOnClick: boolean;

  /**
   * Time to await for the element to be available
   */
  awaitElementTimeout: number;

  /**
   * Determines whether to show the step number and total steps.
   */
  showStepsInfo: boolean;

  /**
   * The css class to apply to the dialog.
   */
  dialogClass: string;

  /**
   * The css class to apply to the dialog title.
   */
  titleClass: string;

  /**
   * The css class to apply to the dialog content.
   */
  contentClass: string;

  /**
   * The css class to apply to the dialog steps info.
   */
  stepsInfoClass: string;

  /**
   * The css class to apply to the buttons.
   */
  btnClass: string;

  /**
   * Determines whether to prevent default styles from being applied to the dialog.
   */
  preventDefaultStyles: boolean;

  /**
   * The text to display on the previous button.
   */
  prevBtnText: string;

  /**
   * The text to display on the next button.
   */
  nextBtnText: string;

  /**
   * The text to display on the skip button.
   */
  skipBtnText: string;

  /**
   * The text to display on the done button.
   */
  doneBtnText: string;

  /**
   * Determines whether the previous button should be shown.
   */
  showPrevBtn: boolean;

  /**
   * Determines whether the next button should be shown.
   */
  showNextBtn: boolean;

  /**
   * Determines whether the skip button should be shown.
   */
  showSkipBtn: boolean;

  /**
   * Determines whether the done button should be shown.
   */
  showDoneBtn: boolean;

  /**
   * Function to call before the feature tour starts.
   * If this method returns false, the regular flow will be interrupted
   */
  onStartBefore?: (this: Revelio) => void | boolean;

  /**
   * Function to call after the feature tour starts.
   */
  onStartAfter?: (this: Revelio) => void;

  /**
   * Function to call when this.end() starts its execution.
   * If this method returns false, the regular flow will be interrupted
   */
  onEndBefore?: (this: Revelio) => void | boolean;

  /**
   * Function to call after this.end() methods executes this.unmountStep().
   */
  onEndAfterUnmountStep?: (this: Revelio) => void;

  /**
   * Function to call when the tour has finished. This can happen  because
   * the user clicked the 'Done' button or becasue the user clicked
   * the 'Skip' button or outside the dialog)
   */
  onEndAfter?: (this: Revelio) => void;

  /**
   * Function to call just when this.nextStep() starts its execution.
   * If this method returns false, the regular flow will be interrupted
   */
  onNextBefore?: (this: Revelio) => void | boolean;

  /**
   * Function to call just after the current step is unmounted.
   */
  onNextAfterUnmountStep?: (this: Revelio) => void;

  /**
   * Function to call when this.nextStep() finishes its execution.
   */
  onNextAfter?: (this: Revelio) => void;

  /**
   * Function to call just when this.prevStep() starts its execution.
   * If this method returns false, the regular flow will be interrupted
   */
  onPrevBefore?: (this: Revelio) => void | boolean;

  /**
   * Function to call just after the current step is unmounted.
   */
  onPrevAfterUnmountStep?: (this: Revelio) => void;

  /**
   * Function to call when this.prevStep() finishes its execution.
   */
  onPrevAfter?: (this: Revelio) => void;

  /**
   * Function to call when the skip button is clicked before the tour ends.
   * If this method returns false, the regular flow will be interrupted
   */
  onSkipBefore?: (this: Revelio) => void | boolean;

  /**
   * Function to call when the user clicks the 'Done' button and the tour has ended.
   * Ths is not triggered when skipping the tour (clicking outside the dialog or the skip button)
   * If you want ton ensure a callback is executed when the tour ends, use 'onEndAfter'
   * Runs after this.onEndAfter()
   */
  onDone?: (this: Revelio) => void;
};

/**
 * Options passed to the Revelio constructor
 */
type RevelioOptions = RevelioSharedConfig & {
  overlayColor: string;
};

/**
 * Journey passed to the Revelio constructor
 */
type JourneyStep = {
  element?: string | HTMLElement;
  title: string;
  content: string;
  /**
   * The options for the step. These will override the global options.
   */
  options?: Partial<RevelioSharedConfig>;
};

const defaultOptions: RevelioOptions = {
  placement: 'bottom',
  preventScrollIntoView: false,
  disableBlink: false,
  persistBlink: false,
  disableClick: false,
  goNextOnClick: false,
  awaitElementTimeout: 5000,
  showStepsInfo: true,
  dialogClass: '',
  titleClass: '',
  contentClass: '',
  stepsInfoClass: '',
  btnClass: '',
  preventDefaultStyles: false,
  prevBtnText: 'Prev',
  nextBtnText: 'Next',
  skipBtnText: 'Skip',
  doneBtnText: 'Done',
  showPrevBtn: true,
  showNextBtn: true,
  showSkipBtn: true,
  showDoneBtn: true,
  overlayColor: 'rgba(0, 0, 0, 0.78)',
};

export class Revelio {
  private static started: boolean;
  /**
   * The options for the Revelio instance
   */
  private baseConfig: RevelioOptions;
  /**
   * The root element for the Revelio instance
   */
  private rootElement: HTMLElement;
  /**
   * The feature tour for the Revelio instance
   */
  private _journey: JourneyStep[];
  /**
   * Read only copy of the initial journey
   */
  private _initialJourney: JourneyStep[];
  /**
   * The current step index for the Revelio instance
   */
  private _currentIndex: number;

  private placement: RevelioOptions['placement'] = defaultOptions.placement;
  private preventScrollIntoView: RevelioOptions['preventScrollIntoView'] =
    defaultOptions.preventScrollIntoView;
  private disableBlink: RevelioOptions['disableBlink'] =
    defaultOptions.disableBlink;
  private persistBlink: RevelioOptions['persistBlink'] =
    defaultOptions.persistBlink;
  private disableClick: RevelioOptions['disableClick'] =
    defaultOptions.disableClick;
  private goNextOnClick: RevelioOptions['goNextOnClick'] =
    defaultOptions.goNextOnClick;
  private awaitElementTimeout: RevelioOptions['awaitElementTimeout'] =
    defaultOptions.awaitElementTimeout;
  private showStepsInfo: RevelioOptions['showStepsInfo'] =
    defaultOptions.showStepsInfo;
  private dialogClass: RevelioOptions['dialogClass'] =
    defaultOptions.dialogClass;
  private titleClass: RevelioOptions['titleClass'] = defaultOptions.titleClass;
  private contentClass: RevelioOptions['contentClass'] =
    defaultOptions.contentClass;
  private stepsInfoClass: RevelioOptions['stepsInfoClass'] =
    defaultOptions.stepsInfoClass;
  private btnClass: RevelioOptions['btnClass'] = defaultOptions.btnClass;
  private preventDefaultStyles: RevelioOptions['preventDefaultStyles'] =
    defaultOptions.preventDefaultStyles;
  private prevBtnText: RevelioOptions['prevBtnText'] =
    defaultOptions.prevBtnText;
  private nextBtnText: RevelioOptions['nextBtnText'] =
    defaultOptions.nextBtnText;
  private skipBtnText: RevelioOptions['skipBtnText'] =
    defaultOptions.skipBtnText;
  private doneBtnText: RevelioOptions['doneBtnText'] =
    defaultOptions.doneBtnText;
  private showPrevBtn: RevelioOptions['showPrevBtn'] =
    defaultOptions.showPrevBtn;
  private showNextBtn: RevelioOptions['showNextBtn'] =
    defaultOptions.showNextBtn;
  private showSkipBtn: RevelioOptions['showSkipBtn'] =
    defaultOptions.showSkipBtn;
  private showDoneBtn: RevelioOptions['showDoneBtn'] =
    defaultOptions.showDoneBtn;
  private onStartBefore: RevelioOptions['onStartBefore'];
  private onStartAfter: RevelioOptions['onStartAfter'];
  private onEndBefore: RevelioOptions['onEndBefore'];
  private onEndAfterUnmountStep: RevelioOptions['onEndAfterUnmountStep'];
  private onEndAfter: RevelioOptions['onEndAfter'];
  private onNextBefore: RevelioOptions['onNextBefore'];
  private onNextAfterUnmountStep: RevelioOptions['onNextAfterUnmountStep'];
  private onNextAfter: RevelioOptions['onNextAfter'];
  private onPrevBefore: RevelioOptions['onPrevBefore'];
  private onPrevAfterUnmountStep: RevelioOptions['onPrevAfterUnmountStep'];
  private onPrevAfter: RevelioOptions['onPrevAfter'];
  private onSkipBefore: RevelioOptions['onSkipBefore'];
  private onDone: RevelioOptions['onDone'];

  constructor({
    journey,
    options,
  }: {
    /**
     * The feature journey steps for the Revelio instance
     */
    journey: JourneyStep[];
    /**
     * The global options for the Revelio instance. Will be applied to all steps unless overridden by the step's options.
     */
    options?: Partial<RevelioOptions>;
  }) {
    this.baseConfig = {
      ...defaultOptions,
      ...options,
    };

    // init props
    this._journey = journey ?? [];
    this._initialJourney = [...journey];
    this._currentIndex = 0;
    this.setStepProps();

    this.rootElement = document.body;
  }

  get currentIndex() {
    return this._currentIndex;
  }

  get journey() {
    return this._journey;
  }

  /**
   * Set the journey to the initial journey, useful when some steps have been added or removed
   * and want to reset the journey to the initial state
   */
  public resetJourney() {
    this._journey = [...this._initialJourney];
  }

  /**
   * @param index The index of the step to go
   * @param callbacks Callbacks to execute before and after the step is mounted and unmounted
   * @returns
   */
  public async goToStep(
    index: number,
    callbacks?: {
      onGoToStepBefore?: (this: Revelio) => void | boolean;
      onGoToStepAfterUnmountStep?: (this: Revelio) => void;
      onGoToStepAfter?: (this: Revelio) => void;
    },
  ) {
    const continueFlow = callbacks?.onGoToStepBefore?.bind(this)();
    if (continueFlow === false) {
      return;
    }
    if (index > this._journey.length - 1 || index < 0) {
      console.warn(`Step ${index} not found`);
      return;
    }

    await this.unmountStep();
    callbacks?.onGoToStepAfterUnmountStep?.bind(this)();

    this._currentIndex = index;
    this.setStepProps();
    this.mountStep();

    callbacks?.onGoToStepAfter?.bind(this)();
  }

  private async getStepElement(
    element: string | HTMLElement,
  ): Promise<HTMLElement> {
    let e: HTMLElement | null = null;
    if (typeof element === 'string') {
      // do some attempts and awaits to get the element, max 5 attempts
      let attempts = 0;
      const attemptsInterval = 100;
      const maxAttempts = this.awaitElementTimeout / attemptsInterval;
      while (attempts < maxAttempts) {
        e = document.querySelector(element);
        if (e) break;
        await new Promise((resolve) => setTimeout(resolve, attemptsInterval));
        attempts += 1;
      }
    } else {
      e = element;
    }
    if (!e) throw new Error(`Element ${element} not found`);
    if (!(e instanceof HTMLElement))
      throw new Error(`Element ${element} is not an HTMLElement`);
    return e;
  }

  private setStepProps() {
    const stepOptions = this._journey[this._currentIndex]?.options;
    this.placement = stepOptions?.placement ?? this.baseConfig.placement;
    this.preventScrollIntoView =
      stepOptions?.preventScrollIntoView ??
      this.baseConfig.preventScrollIntoView;
    this.disableBlink =
      stepOptions?.disableBlink ?? this.baseConfig.disableBlink;
    this.persistBlink =
      stepOptions?.persistBlink ?? this.baseConfig.persistBlink;
    this.disableClick =
      stepOptions?.disableClick ?? this.baseConfig.disableClick;
    this.goNextOnClick =
      stepOptions?.goNextOnClick ?? this.baseConfig.goNextOnClick;
    this.awaitElementTimeout =
      stepOptions?.awaitElementTimeout ?? this.baseConfig.awaitElementTimeout;
    this.showStepsInfo =
      stepOptions?.showStepsInfo ?? this.baseConfig.showStepsInfo;
    this.dialogClass = stepOptions?.dialogClass ?? this.baseConfig.dialogClass;
    this.titleClass = stepOptions?.titleClass ?? this.baseConfig.titleClass;
    this.contentClass =
      stepOptions?.contentClass ?? this.baseConfig.contentClass;
    this.stepsInfoClass =
      stepOptions?.stepsInfoClass ?? this.baseConfig.stepsInfoClass;
    this.btnClass = stepOptions?.btnClass ?? this.baseConfig.btnClass;
    this.preventDefaultStyles =
      stepOptions?.preventDefaultStyles ?? this.baseConfig.preventDefaultStyles;
    this.prevBtnText = stepOptions?.prevBtnText ?? this.baseConfig.prevBtnText;
    this.nextBtnText = stepOptions?.nextBtnText ?? this.baseConfig.nextBtnText;
    this.skipBtnText = stepOptions?.skipBtnText ?? this.baseConfig.skipBtnText;
    this.doneBtnText = stepOptions?.doneBtnText ?? this.baseConfig.doneBtnText;
    this.showPrevBtn = stepOptions?.showPrevBtn ?? this._currentIndex > 0;
    this.showNextBtn =
      stepOptions?.showNextBtn ?? this._currentIndex < this._journey.length - 1;
    this.showSkipBtn =
      stepOptions?.showSkipBtn ??
      (this._currentIndex < this._journey.length - 1 &&
        this.baseConfig.showSkipBtn);
    this.showDoneBtn =
      stepOptions?.showDoneBtn ??
      (this._currentIndex === this._journey.length - 1 &&
        this.baseConfig.showDoneBtn);
    this.onStartBefore =
      stepOptions?.onStartBefore ?? this.baseConfig.onStartBefore;
    this.onStartAfter =
      stepOptions?.onStartAfter ?? this.baseConfig.onStartAfter;
    this.onEndBefore = stepOptions?.onEndBefore ?? this.baseConfig.onEndBefore;
    this.onEndAfterUnmountStep =
      stepOptions?.onEndAfterUnmountStep ??
      this.baseConfig.onEndAfterUnmountStep;
    this.onEndAfter = stepOptions?.onEndAfter ?? this.baseConfig.onEndAfter;
    this.onNextBefore =
      stepOptions?.onNextBefore ?? this.baseConfig.onNextBefore;
    this.onNextAfterUnmountStep =
      stepOptions?.onNextAfterUnmountStep ??
      this.baseConfig.onNextAfterUnmountStep;
    this.onNextAfter = stepOptions?.onNextAfter ?? this.baseConfig.onNextAfter;
    this.onPrevBefore =
      stepOptions?.onPrevBefore ?? this.baseConfig.onPrevBefore;
    this.onPrevAfterUnmountStep =
      stepOptions?.onPrevAfterUnmountStep ??
      this.baseConfig.onPrevAfterUnmountStep;
    this.onPrevAfter = stepOptions?.onPrevAfter ?? this.baseConfig.onPrevAfter;
    this.onSkipBefore =
      stepOptions?.onSkipBefore ?? this.baseConfig.onSkipBefore;
    this.onDone = stepOptions?.onDone ?? this.baseConfig.onDone;
  }

  private async skipTour() {
    const continueFlow = this.onSkipBefore?.();
    if (continueFlow === false) {
      return;
    }

    await this.end();
  }

  /**
   * Global overlay that covers the entire page with a subtle dark background color
   */
  private renderOverlay() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = this.baseConfig.overlayColor;
    overlay.style.zIndex = '9999';
    overlay.id = 'revelio-overlay';

    overlay.onclick = this.skipTour.bind(this);

    this.rootElement.appendChild(overlay);
  }

  private getPlacementArray(
    placement: RevelioOptions['placement'],
  ): RevelioOptions['placement'][] {
    switch (placement) {
      case 'left':
        return ['left', 'right', 'top', 'bottom', 'center'];
      case 'right':
        return ['right', 'left', 'bottom', 'top', 'center'];
      case 'top':
        return ['top', 'bottom', 'left', 'right', 'center'];
      case 'bottom':
      default:
        return ['bottom', 'top', 'right', 'left', 'center'];
      case 'center':
        return ['center'];
    }
  }

  private setDialogPosition(
    dialog: HTMLElement,
    elementPosition?: { top: number; left: number },
    elementDimensions?: { width: number; height: number },
  ) {
    const dialogBoundingRect = dialog.getBoundingClientRect();
    const dialogComputedStyle = window.getComputedStyle(dialog);
    const dialogMargin = getNumberFromString(dialogComputedStyle.margin);
    const dialogSpaceWidth = dialogBoundingRect.width + dialogMargin * 2;
    const dialogSpaceHeight = dialogBoundingRect.height + dialogMargin * 2;

    // get dialog top and left position, take into account the dialog does not overflow the root element
    const rootElementRect = this.rootElement.getBoundingClientRect();
    const rootElementWidth = rootElementRect.width;
    const rootElementHeight = rootElementRect.height;

    function getDialogPosition(placementArray: RevelioOptions['placement'][]) {
      let dialogLeft: number = 0,
        dialogTop: number = 0;

      const currentPlacement = placementArray.shift();

      if (!currentPlacement) {
        throw new Error('No placement specified');
      }

      if (currentPlacement === 'center') {
        dialogLeft = rootElementWidth / 2 - dialogSpaceWidth / 2;
        dialogTop = rootElementHeight / 2 - dialogSpaceHeight / 2;
      } else {
        if (!elementPosition || !elementDimensions) {
          throw new Error('No element position or dimensions specified');
        }

        const elementXCenter =
          elementPosition.left + elementDimensions.width / 2;
        const elementYCenter =
          elementPosition.top + elementDimensions.height / 2;

        switch (currentPlacement) {
          case 'left':
            dialogLeft = elementPosition.left - dialogSpaceWidth;
            dialogTop = elementYCenter - dialogSpaceHeight / 2;

            // get potential overlap
            if (dialogLeft < rootElementRect.left) {
              // will overlap with element as there is no space to the left
              if (placementArray.length > 0) {
                return getDialogPosition(placementArray);
              }
            }

            break;
          case 'right':
            dialogLeft = elementPosition.left + elementDimensions.width;
            dialogTop = elementYCenter - dialogSpaceHeight / 2;

            // get potential overlap
            if (dialogLeft + dialogSpaceWidth > rootElementRect.right) {
              // will overlap with element as there is no space to the right
              if (placementArray.length > 0) {
                return getDialogPosition(placementArray);
              }
            }

            break;
          case 'top':
            dialogLeft = elementXCenter - dialogSpaceWidth / 2;
            dialogTop = elementPosition.top - dialogSpaceHeight;

            // get potential overlap
            if (dialogTop < rootElementRect.top) {
              // will overlap with element as there is no space above
              if (placementArray.length > 0) {
                return getDialogPosition(placementArray);
              }
            }

            break;
          case 'bottom':
          default:
            dialogLeft = elementXCenter - dialogSpaceWidth / 2;
            dialogTop = elementPosition.top + elementDimensions.height;

            // get potential overlap
            if (dialogTop + dialogSpaceHeight > rootElementRect.bottom) {
              // will overlap with element as there is no space below
              if (placementArray.length > 0) {
                return getDialogPosition(placementArray);
              }
            }

            break;
        }
      }

      return {
        dialogLeft,
        dialogTop,
      };
    }

    const placementArray = this.getPlacementArray(this.placement);

    const { dialogLeft, dialogTop } = getDialogPosition(placementArray);

    dialog.style.top = `clamp(0px, ${dialogTop}px, ${
      rootElementHeight - dialogSpaceHeight
    }px)`;
    dialog.style.left = `clamp(0px, ${dialogLeft}px, ${
      rootElementWidth - dialogSpaceWidth
    }px)`;

    // Set CSS to make it visible
    dialog.style.visibility = '';
  }

  private createDialog() {
    const dialog = document.createElement('div');
    if (!this.preventDefaultStyles) {
      // dialog default styles
      dialog.style.backgroundColor = 'white';
      dialog.style.maxWidth = '300px';
      dialog.style.maxHeight = '300px';
      dialog.style.overflowY = 'auto';
      dialog.style.padding = '1rem';
      dialog.style.margin = '1rem';
      dialog.style.borderRadius = '0.5rem';
      dialog.style.boxShadow = '0 0 0.5rem rgba(0, 0, 0, 0.5)';
      dialog.style.width = '300px';
    }
    dialog.id = 'revelio-dialog';
    // required styles
    dialog.style.position = 'absolute';
    dialog.style.zIndex = '10000';
    // Set CSS to make it invisible until we have the correct position
    dialog.style.visibility = 'hidden';

    // dialog class
    if (this.dialogClass) {
      dialog.classList.add(...arrayFromString(this.dialogClass));
    }

    return dialog;
  }

  private createTitle(step: JourneyStep) {
    const title = document.createElement('div');
    title.textContent = step.title;
    if (!this.preventDefaultStyles) {
      title.style.fontWeight = 'bold';
      title.style.fontSize = '1.5rem';
      title.style.marginBottom = '1rem';
    }
    if (this.titleClass) {
      title.classList.add(...arrayFromString(this.titleClass));
    }
    return title;
  }

  private createContent(step: JourneyStep) {
    const content = document.createElement('div');
    content.innerHTML = step.content;
    if (this.contentClass) {
      content.classList.add(...arrayFromString(this.contentClass));
    }
    return content;
  }

  private createStepsInfo() {
    const stepsInfo = document.createElement('div');
    if (!this.preventDefaultStyles) {
      stepsInfo.style.display = 'flex';
      stepsInfo.style.justifyContent = 'center';
      stepsInfo.style.marginTop = '0.5rem';
      stepsInfo.style.marginBottom = '1rem';
      stepsInfo.style.fontSize = '0.75rem';
      stepsInfo.style.color = 'rgba(0, 0, 0, 0.5)';
    }
    stepsInfo.textContent = `${this._currentIndex + 1}/${this._journey.length}`;
    if (this.stepsInfoClass) {
      stepsInfo.classList.add(...arrayFromString(this.stepsInfoClass));
    }
    return stepsInfo;
  }

  private createButton(text: string, onClick: () => void) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    if (!this.preventDefaultStyles) {
      btn.style.padding = '0.25rem 1rem';
      btn.style.borderRadius = '0.25rem';
      btn.style.border = 'none';
      btn.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      btn.style.cursor = 'pointer';
      btn.style.fontWeight = '600';
      btn.style.fontSize = '1rem';
    }
    if (this.btnClass) {
      btn.classList.add(...arrayFromString(this.btnClass));
    }
    return btn;
  }

  private createButtonsContainer() {
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'grid';
    buttonsContainer.style.gridTemplateColumns = '1fr 1fr 1fr';
    buttonsContainer.style.gap = '1rem';
    buttonsContainer.style.marginTop = '1rem';

    const prevBtnContainer = document.createElement('div');
    const nextBtnContainer = document.createElement('div');
    const centerBtnContainer = document.createElement('div');
    prevBtnContainer.style.justifySelf = 'start';
    nextBtnContainer.style.justifySelf = 'end';
    centerBtnContainer.style.justifySelf = 'center';

    if (this.showPrevBtn) {
      const prevBtn = this.createButton(this.prevBtnText, () => {
        this.prevStep();
      });
      prevBtnContainer.appendChild(prevBtn);
    }

    if (this.showNextBtn) {
      const nextBtn = this.createButton(this.nextBtnText, () => {
        this.nextStep();
      });
      nextBtnContainer.appendChild(nextBtn);
    }

    if (this.showDoneBtn) {
      const doneBtn = this.createButton(this.doneBtnText, async () => {
        await this.end();
        this.onDone?.();
      });
      nextBtnContainer.appendChild(doneBtn);
    }

    if (this.showSkipBtn) {
      const skipBtn = this.createButton(
        this.skipBtnText,
        this.skipTour.bind(this),
      );
      centerBtnContainer.appendChild(skipBtn);
    }

    buttonsContainer.appendChild(prevBtnContainer);
    buttonsContainer.appendChild(centerBtnContainer);
    buttonsContainer.appendChild(nextBtnContainer);
    return buttonsContainer;
  }

  private renderStepDialog(
    step: JourneyStep,
    elementPosition?: { top: number; left: number },
    elementDimensions?: { width: number; height: number },
  ) {
    const dialog = this.createDialog();
    const title = this.createTitle(step);
    dialog.appendChild(title);
    const content = this.createContent(step);
    dialog.appendChild(content);

    if (this.showStepsInfo) {
      const stepsInfo = this.createStepsInfo();
      dialog.appendChild(stepsInfo);
    }

    const buttonsContainer = this.createButtonsContainer();

    dialog.appendChild(buttonsContainer);

    this.rootElement.appendChild(dialog);

    this.setDialogPosition(dialog, elementPosition, elementDimensions);
  }

  private createBlinkOverlay(
    element: HTMLElement,
    top: number,
    left: number,
    width: number,
    height: number,
  ) {
    // create a div that blinks over the element
    const blinkOverlay = document.createElement('div');
    blinkOverlay.style.position = 'absolute';
    blinkOverlay.style.top = `${top}px`;
    blinkOverlay.style.left = `${left}px`;
    blinkOverlay.style.width = `${width}px`;
    blinkOverlay.style.height = `${height}px`;
    blinkOverlay.style.backgroundColor = 'white';
    blinkOverlay.style.opacity = '0.0';
    blinkOverlay.style.boxShadow =
      '0 0 5px white, 0 0 25px white, 0 0 50px white, 0 0 100px';
    blinkOverlay.style.zIndex = '10000';
    blinkOverlay.style.pointerEvents = 'none';
    blinkOverlay.style.borderRadius =
      window.getComputedStyle(element).borderRadius;
    blinkOverlay.id = 'revelio-blink-overlay';

    this.rootElement.appendChild(blinkOverlay);

    blinkOverlay.animate(
      [
        {
          opacity: 0,
        },
        {
          opacity: 0.3,
        },
        {
          opacity: 0,
        },
      ],
      {
        duration: 1000,
        iterations: this.persistBlink ? Infinity : 1,
        easing: 'ease-in',
      },
    );
  }

  private async highlightStepElement(element: HTMLElement) {
    const elementComputedStyle = window.getComputedStyle(element);
    element.style.zIndex = '10000';
    if (elementComputedStyle.position === 'static') {
      element.style.position = 'relative';
    }
    if (this.disableClick) {
      element.style.pointerEvents = 'none';
    }
    if (this.goNextOnClick) {
      element.addEventListener('click', this.boundNextStep);
    }

    // get the position and dimensions
    const elementRect = element.getBoundingClientRect();
    const rootRect = this.rootElement.getBoundingClientRect();
    const top = elementRect.top - rootRect.top;
    const left = elementRect.left - rootRect.left;
    const { width, height } = elementRect;

    if (!this.disableBlink) {
      this.createBlinkOverlay(element, top, left, width, height);
    }

    return {
      position: {
        top,
        left,
      },
      dimensions: {
        width,
        height,
      },
    };
  }

  /**
   * Returns the current step
   */
  private getCurrentStep() {
    const step = this._journey[this._currentIndex];
    if (!step) {
      throw new Error(`Step ${this._currentIndex} not found`);
    }
    return step;
  }

  /**
   * Overlay that covers the element for the current step
   */
  private async mountStep() {
    const step = this.getCurrentStep();
    if (step.element === undefined) {
      this.placement = 'center';
      return this.renderStepDialog(step);
    }
    const stepElement = await this.getStepElement(step.element);

    if (!this.preventScrollIntoView) {
      stepElement.scrollIntoView({
        behavior: 'instant',
        block: 'center',
        inline: 'center',
      });
    }

    const { position, dimensions } =
      await this.highlightStepElement(stepElement);

    this.renderStepDialog(step, position, dimensions);
  }

  public async start() {
    const continueFlow = this.onStartBefore?.();
    if (continueFlow === false) {
      return;
    }

    if (Revelio.started) {
      console.warn('Another Revelio tour is already started');
      return;
    }
    Revelio.started = true;
    this._currentIndex = 0;
    this.setStepProps();

    this.renderOverlay();

    await this.mountStep();

    this.onStartAfter?.();
  }

  public async end() {
    const continueFlow = this.onEndBefore?.();
    if (continueFlow === false) {
      return;
    }

    const overlay = this.rootElement.querySelector('#revelio-overlay');
    if (overlay) {
      this.rootElement.removeChild(overlay);
    }

    try {
      await this.unmountStep();
      this.onEndAfterUnmountStep?.();
    } catch (e) {
      console.error(e); // log the error but continue to end the instance
    }

    this._currentIndex = 0;

    Revelio.started = false;

    this.onEndAfter?.();
  }

  public async unmountStep() {
    const step = this.getCurrentStep();

    const dialog = this.rootElement.querySelector('#revelio-dialog');

    if (dialog) {
      this.rootElement.removeChild(dialog);
    }

    if (step.element !== undefined) {
      const element = await this.getStepElement(step.element);

      element.style.zIndex = '';
      element.style.position = '';

      if (!element.getAttribute('style')?.trim()) {
        element.removeAttribute('style');
      }

      if (this.goNextOnClick) {
        element.removeEventListener('click', this.boundNextStep);
      }

      const blinkOverlay = this.rootElement.querySelector(
        '#revelio-blink-overlay',
      );
      if (blinkOverlay) {
        this.rootElement.removeChild(blinkOverlay);
      }
    }
  }

  /**
   *
   * @param step The step to add
   * @param position The position to insert the step at (can be a negative number as
   * this works with splice). If not specified, the step will be added at the end of
   * the journey.
   */
  public addStep(step: JourneyStep, position?: number) {
    if (position === undefined) {
      this._journey.push(step);
    } else {
      this._journey.splice(position, 0, step);
    }
  }

  /**
   *
   * @param position The position of the step to remove (can be negative as this works with splice).
   * If not specified, the last step will be removed.
   */
  public removeStep(position?: number) {
    if (position === undefined) {
      this._journey.pop();
    } else {
      this._journey.splice(position, 1);
    }
  }

  public async nextStep() {
    const continueFlow = this.onNextBefore?.();
    if (continueFlow === false) {
      return;
    }

    if (this._currentIndex >= this._journey.length - 1) {
      console.warn('no next step');
      return;
    }

    await this.unmountStep();

    this.onNextAfterUnmountStep?.();

    this._currentIndex += 1;
    this.setStepProps();
    this.mountStep();

    this.onNextAfter?.();
  }

  private boundNextStep = this.nextStep.bind(this);

  public async prevStep() {
    const continueFlow = this.onPrevBefore?.();
    if (continueFlow === false) {
      return;
    }

    if (this._currentIndex <= 0) {
      console.warn('no prev step');
      return;
    }

    await this.unmountStep();

    this.onPrevAfterUnmountStep?.();

    this._currentIndex -= 1;
    this.setStepProps();
    this.mountStep();

    this.onPrevAfter?.();
  }
}

export default Revelio;
