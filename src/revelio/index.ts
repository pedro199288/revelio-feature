/* eslint-disable no-use-before-define */
import { arrayFromClassesString, getNumberFromString } from '../utils';

/**
 * Config that is shared between the 'options' and 'journey.[].options' properties
 */
export type RevelioSharedConfig = {
  rootElement: string | HTMLElement;

  /**
   * The placement of the feature tour step. Can be 'top', 'bottom', 'left', 'right' or 'center'.
   */
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center';

  /**
   * Determines whether the step dialog should be scrolled into view.
   */
  preventScrollIntoView: boolean;

  /**
   * The stacking context ancestors of the element, if any. This is useful when the element is inside a stacking context.
   * This ensures that all the ancestors are placed above the overlay so the element is properly highlighted.
   * TODO: explain this better in docs
   */
  stackingContextAncestors: (string | HTMLElement)[] | undefined;

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
   * If true, the user must click on the highlighted element to go to the next step
   */
  requireClickToGoNext: boolean | undefined;

  /**
   * Time to await for the element to be available
   */
  awaitElementTimeout: number;

  /**
   * Elements that are expected to be animated and should be waited for before the next step
   */
  animatedElements: (string | HTMLElement)[];

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
  onStartBefore?: (this: Revelio) => void | boolean | Promise<void | boolean>;

  /**
   * Function to call after the feature tour starts.
   */
  onStartAfter?: (this: Revelio) => void | Promise<void>;

  /**
   * Function to call when this.end() starts its execution.
   * If this method returns false, the regular flow will be interrupted
   */
  onEndBefore?: (this: Revelio) => void | boolean | Promise<void | boolean>;

  /**
   * Function to call after this.end() methods executes this._unmountStep().
   */
  onEndAfterUnmountStep?: (this: Revelio) => void | Promise<void>;

  /**
   * Function to call when the tour has finished. This can happen  because
   * the user clicked the 'Done' button or becasue the user clicked
   * the 'Skip' button or outside the dialog)
   */
  onEndAfter?: (this: Revelio) => void | Promise<void>;

  /**
   * Function to call just when this.nextStep() starts its execution.
   * If this method returns false, the regular flow will be interrupted
   */
  onNextBefore?: (this: Revelio) => void | boolean | Promise<void | boolean>;

  /**
   * Function to call just after the current step is unmounted.
   */
  onNextAfterUnmountStep?: (this: Revelio) => void | Promise<void>;

  /**
   * Function to call when this.nextStep() finishes its execution.
   */
  onNextAfter?: (this: Revelio) => void | Promise<void>;

  /**
   * Function to call just when this.prevStep() starts its execution.
   * If this method returns false, the regular flow will be interrupted
   */
  onPrevBefore?: (this: Revelio) => void | boolean | Promise<void | boolean>;

  /**
   * Function to call just after the current step is unmounted.
   */
  onPrevAfterUnmountStep?: (this: Revelio) => void | Promise<void>;

  /**
   * Function to call when this.prevStep() finishes its execution.
   */
  onPrevAfter?: (this: Revelio) => void | Promise<void>;

  /**
   * Function to call when the skip button is clicked before the tour ends.
   * If this method returns false, the regular flow will be interrupted
   */
  onSkipBefore?: (this: Revelio) => void | boolean | Promise<void | boolean>;

  /**
   * Function to call when the user clicks the 'Done' button and the tour has ended.
   * Ths is not triggered when skipping the tour (clicking outside the dialog or the skip button)
   * If you want ton ensure a callback is executed when the tour ends, use 'onEndAfter'
   * Runs after this.onEndAfter()
   */
  onDone?: (this: Revelio) => void | Promise<void>;
};

/**
 * Options passed to the Revelio constructor
 */
export type RevelioOptions = RevelioSharedConfig & {
  overlayColor: string;
};

/**
 * Journey passed to the Revelio constructor
 */
export type JourneyStep = {
  /**
   * The element to highlight. Can be a query selector or an HTMLElement.
   */
  element?: string | HTMLElement;
  /**
   * The title of the step.
   */
  title: string;
  /**
   * The content of the step. A string that supports HTML.
   */
  content: string;
  /**
   * The options for the step. These will override the global options.
   */
  options?: Partial<RevelioSharedConfig>;
};

const defaultOptions: RevelioOptions = {
  rootElement: document.body,
  placement: 'bottom',
  preventScrollIntoView: false,
  stackingContextAncestors: undefined,
  disableBlink: false,
  persistBlink: false,
  disableClick: false,
  goNextOnClick: false,
  requireClickToGoNext: undefined,
  awaitElementTimeout: 5000,
  animatedElements: [],
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

const zIndexValue = '10000';
const zIndexOverlayValue = '9999';
const revelioElementAncestorWithOverlayClass =
  'revelio-element-ancestor-with-overlay';
const revelioElementAncestorWithOpacityClass =
  'revelio-element-ancestor-with-opacity';

export class Revelio {
  private static _started: boolean;
  /**
   * The options for the Revelio instance
   */
  private _baseConfig: RevelioOptions;
  /**
   * The root element for the Revelio instance
   */
  private _rootElement: HTMLElement = document.body;
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

  private _placement: RevelioOptions['placement'] = defaultOptions.placement;
  private _preventScrollIntoView: RevelioOptions['preventScrollIntoView'] =
    defaultOptions.preventScrollIntoView;
  private _stackingContextAncestors?: {
    element: string | HTMLElement;
    originalStyles?: CSSStyleDeclaration;
  }[] = defaultOptions.stackingContextAncestors?.map((element) => ({
    element: element,
    originalStyles: undefined,
  }));
  private _disableBlink: RevelioOptions['disableBlink'] =
    defaultOptions.disableBlink;
  private _persistBlink: RevelioOptions['persistBlink'] =
    defaultOptions.persistBlink;
  private _disableClick: RevelioOptions['disableClick'] =
    defaultOptions.disableClick;
  private _goNextOnClick: RevelioOptions['goNextOnClick'] =
    defaultOptions.goNextOnClick;
  private _requireClickToGoNext: RevelioOptions['requireClickToGoNext'] =
    defaultOptions.requireClickToGoNext;
  private _awaitElementTimeout: RevelioOptions['awaitElementTimeout'] =
    defaultOptions.awaitElementTimeout;
  private _animatedElements: RevelioOptions['animatedElements'] =
    defaultOptions.animatedElements;
  private _showStepsInfo: RevelioOptions['showStepsInfo'] =
    defaultOptions.showStepsInfo;
  private _dialogClass: RevelioOptions['dialogClass'] =
    defaultOptions.dialogClass;
  private _titleClass: RevelioOptions['titleClass'] = defaultOptions.titleClass;
  private _contentClass: RevelioOptions['contentClass'] =
    defaultOptions.contentClass;
  private _stepsInfoClass: RevelioOptions['stepsInfoClass'] =
    defaultOptions.stepsInfoClass;
  private _btnClass: RevelioOptions['btnClass'] = defaultOptions.btnClass;
  private _preventDefaultStyles: RevelioOptions['preventDefaultStyles'] =
    defaultOptions.preventDefaultStyles;
  private _prevBtnText: RevelioOptions['prevBtnText'] =
    defaultOptions.prevBtnText;
  private _nextBtnText: RevelioOptions['nextBtnText'] =
    defaultOptions.nextBtnText;
  private _skipBtnText: RevelioOptions['skipBtnText'] =
    defaultOptions.skipBtnText;
  private _doneBtnText: RevelioOptions['doneBtnText'] =
    defaultOptions.doneBtnText;
  private _showPrevBtn: RevelioOptions['showPrevBtn'] =
    defaultOptions.showPrevBtn;
  private _showNextBtn: RevelioOptions['showNextBtn'] =
    defaultOptions.showNextBtn;
  private _showSkipBtn: RevelioOptions['showSkipBtn'] =
    defaultOptions.showSkipBtn;
  private _showDoneBtn: RevelioOptions['showDoneBtn'] =
    defaultOptions.showDoneBtn;
  private _onStartBefore: RevelioOptions['onStartBefore'];
  private _onStartAfter: RevelioOptions['onStartAfter'];
  private _onEndBefore: RevelioOptions['onEndBefore'];
  private _onEndAfterUnmountStep: RevelioOptions['onEndAfterUnmountStep'];
  private _onEndAfter: RevelioOptions['onEndAfter'];
  private _onNextBefore: RevelioOptions['onNextBefore'];
  private _onNextAfterUnmountStep: RevelioOptions['onNextAfterUnmountStep'];
  private _onNextAfter: RevelioOptions['onNextAfter'];
  private _onPrevBefore: RevelioOptions['onPrevBefore'];
  private _onPrevAfterUnmountStep: RevelioOptions['onPrevAfterUnmountStep'];
  private _onPrevAfter: RevelioOptions['onPrevAfter'];
  private _onSkipBefore: RevelioOptions['onSkipBefore'];
  private _onDone: RevelioOptions['onDone'];

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
    this._baseConfig = {
      ...defaultOptions,
      ...options,
    };

    // init props
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

  private _createError(error: string) {
    if (Revelio._started === true) {
      // flag to avoid bucle calls to this.end() (as it might throw an error in its execution)
      this._transitionBlocked = false;
      Revelio._started = false;
      this.end();
      this.resetJourney();
    }
    return new Error(error);
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

    await this._unmountStep();
    callbacks?.onGoToStepAfterUnmountStep?.bind(this)();

    this._currentIndex = index;
    await this._setStepProps();
    await this._mountStep();

    callbacks?.onGoToStepAfter?.bind(this)();
  }

  private async _getElement(
    element: string | HTMLElement,
  ): Promise<HTMLElement> {
    let e: HTMLElement | null = null;
    if (typeof element === 'string') {
      // do some attempts and awaits to get the element, max 5 attempts
      let attempts = 0;
      const attemptsInterval = 100;
      const maxAttempts = this._awaitElementTimeout / attemptsInterval;
      while (attempts < maxAttempts) {
        e = document.querySelector(element);
        if (e) break;
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

  private async _setStepProps() {
    const stepOptions = this._journey[this._currentIndex]?.options;
    const rootElement = await this._getElement(
      stepOptions?.rootElement ?? this._baseConfig.rootElement,
    );
    this._rootElement = rootElement;
    this._placement = stepOptions?.placement ?? this._baseConfig.placement;
    this._preventScrollIntoView =
      stepOptions?.preventScrollIntoView ??
      this._baseConfig.preventScrollIntoView;
    const stackingContextAncestors =
      stepOptions?.stackingContextAncestors ??
      this._baseConfig.stackingContextAncestors;
    this._stackingContextAncestors = stackingContextAncestors?.map(
      (element) => ({
        element: element,
        originalStyles: undefined,
      }),
    );
    this._disableBlink =
      stepOptions?.disableBlink ?? this._baseConfig.disableBlink;
    this._persistBlink =
      stepOptions?.persistBlink ?? this._baseConfig.persistBlink;
    this._disableClick =
      stepOptions?.disableClick ?? this._baseConfig.disableClick;
    this._goNextOnClick =
      stepOptions?.requireClickToGoNext ??
      this._baseConfig.requireClickToGoNext ??
      stepOptions?.goNextOnClick ??
      this._baseConfig.goNextOnClick;
    this._requireClickToGoNext =
      stepOptions?.requireClickToGoNext ??
      this._baseConfig.requireClickToGoNext;
    this._awaitElementTimeout =
      stepOptions?.awaitElementTimeout ?? this._baseConfig.awaitElementTimeout;
    this._animatedElements =
      stepOptions?.animatedElements ?? this._baseConfig.animatedElements;
    this._showStepsInfo =
      stepOptions?.showStepsInfo ?? this._baseConfig.showStepsInfo;
    this._dialogClass =
      stepOptions?.dialogClass ?? this._baseConfig.dialogClass;
    this._titleClass = stepOptions?.titleClass ?? this._baseConfig.titleClass;
    this._contentClass =
      stepOptions?.contentClass ?? this._baseConfig.contentClass;
    this._stepsInfoClass =
      stepOptions?.stepsInfoClass ?? this._baseConfig.stepsInfoClass;
    this._btnClass = stepOptions?.btnClass ?? this._baseConfig.btnClass;
    this._preventDefaultStyles =
      stepOptions?.preventDefaultStyles ??
      this._baseConfig.preventDefaultStyles;
    this._prevBtnText =
      stepOptions?.prevBtnText ?? this._baseConfig.prevBtnText;
    this._nextBtnText =
      stepOptions?.nextBtnText ?? this._baseConfig.nextBtnText;
    this._skipBtnText =
      stepOptions?.skipBtnText ?? this._baseConfig.skipBtnText;
    this._doneBtnText =
      stepOptions?.doneBtnText ?? this._baseConfig.doneBtnText;
    this._showPrevBtn = stepOptions?.showPrevBtn ?? this._currentIndex > 0;
    this._showNextBtn =
      stepOptions?.showNextBtn ?? this._currentIndex < this._journey.length - 1;
    this._showSkipBtn =
      stepOptions?.showSkipBtn ??
      (this._currentIndex < this._journey.length - 1 &&
        this._baseConfig.showSkipBtn);
    this._showDoneBtn =
      stepOptions?.showDoneBtn ??
      (this._currentIndex === this._journey.length - 1 &&
        this._baseConfig.showDoneBtn);
    this._onStartBefore =
      stepOptions?.onStartBefore ?? this._baseConfig.onStartBefore;
    this._onStartAfter =
      stepOptions?.onStartAfter ?? this._baseConfig.onStartAfter;
    this._onEndBefore =
      stepOptions?.onEndBefore ?? this._baseConfig.onEndBefore;
    this._onEndAfterUnmountStep =
      stepOptions?.onEndAfterUnmountStep ??
      this._baseConfig.onEndAfterUnmountStep;
    this._onEndAfter = stepOptions?.onEndAfter ?? this._baseConfig.onEndAfter;
    this._onNextBefore =
      stepOptions?.onNextBefore ?? this._baseConfig.onNextBefore;
    this._onNextAfterUnmountStep =
      stepOptions?.onNextAfterUnmountStep ??
      this._baseConfig.onNextAfterUnmountStep;
    this._onNextAfter =
      stepOptions?.onNextAfter ?? this._baseConfig.onNextAfter;
    this._onPrevBefore =
      stepOptions?.onPrevBefore ?? this._baseConfig.onPrevBefore;
    this._onPrevAfterUnmountStep =
      stepOptions?.onPrevAfterUnmountStep ??
      this._baseConfig.onPrevAfterUnmountStep;
    this._onPrevAfter =
      stepOptions?.onPrevAfter ?? this._baseConfig.onPrevAfter;
    this._onSkipBefore =
      stepOptions?.onSkipBefore ?? this._baseConfig.onSkipBefore;
    this._onDone = stepOptions?.onDone ?? this._baseConfig.onDone;
  }

  public async skipTour() {
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

  /**
   * Global overlay that covers the entire page with a subtle dark background color
   */
  private _renderOverlay() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = this._baseConfig.overlayColor;
    overlay.style.zIndex = zIndexOverlayValue;
    document.documentElement.style.cssText += `--revelio-z-index: ${zIndexOverlayValue};`;
    overlay.id = 'revelio-overlay';

    overlay.onclick = this.skipTour.bind(this);

    this._rootElement.appendChild(overlay);
    return overlay;
  }

  private _getPlacementArray(
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

  private _setDialogPosition(
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
    const viewportLeft = window.scrollX || window.pageXOffset;
    const viewportTop = window.scrollY || window.pageYOffset;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const viewportBottom = viewportTop + viewportHeight;
    const viewportRight = viewportLeft + viewportWidth;
    let currentPlacement: RevelioOptions['placement'] | undefined;

    const getDialogPosition = (
      placementArray: RevelioOptions['placement'][],
    ): { dialogLeft: number; dialogTop: number } => {
      let dialogLeft: number = 0,
        dialogTop: number = 0;

      currentPlacement = placementArray.shift();

      if (!currentPlacement) {
        throw this._createError('No placement specified');
      }

      if (currentPlacement === 'center') {
        dialogLeft = viewportWidth / 2 - dialogSpaceWidth / 2;
        dialogTop = viewportHeight / 2 - dialogSpaceHeight / 2;
      } else {
        if (!elementPosition || !elementDimensions) {
          throw this._createError(
            'No element position or dimensions specified',
          );
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
            if (dialogLeft < viewportLeft) {
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
            if (dialogLeft + dialogSpaceWidth > viewportRight) {
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
            if (dialogTop < viewportTop) {
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
            if (dialogTop + dialogSpaceHeight > viewportBottom) {
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
    };

    const placementArray = this._getPlacementArray(this._placement);

    const { dialogLeft, dialogTop } = getDialogPosition(placementArray);

    dialog.style.top = `clamp(${viewportTop}px, ${dialogTop}px, ${
      viewportBottom - dialogSpaceHeight
    }px)`;
    dialog.style.left = `clamp(${viewportLeft}px,
    ${dialogLeft}px, ${viewportRight - dialogSpaceWidth}px)`;

    if (currentPlacement === 'center' && this._rootElement === document.body) {
      dialog.style.position = 'fixed';
      dialog.style.transform = 'translate(-50%, -50%)';
      dialog.style.top = '50%';
      dialog.style.left = '50%';
      dialog.style.margin = '0';
    }
    // Set CSS to make it visible
    setTimeout(() => {
      dialog.style.visibility = '';
    }, 25);
  }

  private _createDialog() {
    const dialog = document.createElement('div');
    if (!this._preventDefaultStyles) {
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
    dialog.style.zIndex = zIndexValue;
    // Set CSS to make it invisible until we have the correct position
    dialog.style.visibility = 'hidden';

    // dialog class
    if (this._dialogClass) {
      dialog.classList.add(...arrayFromClassesString(this._dialogClass));
    }

    return dialog;
  }

  private _createTitle(step: JourneyStep) {
    const title = document.createElement('div');
    title.textContent = step.title;
    if (!this._preventDefaultStyles) {
      title.style.fontWeight = 'bold';
      title.style.fontSize = '1.5rem';
      title.style.marginBottom = '1rem';
    }
    if (this._titleClass) {
      title.classList.add(...arrayFromClassesString(this._titleClass));
    }
    return title;
  }

  private _createContent(step: JourneyStep) {
    const content = document.createElement('div');
    content.innerHTML = step.content;
    if (this._contentClass) {
      content.classList.add(...arrayFromClassesString(this._contentClass));
    }
    return content;
  }

  private _createStepsInfo() {
    const stepsInfo = document.createElement('div');
    if (!this._preventDefaultStyles) {
      stepsInfo.style.display = 'flex';
      stepsInfo.style.justifyContent = 'center';
      stepsInfo.style.marginTop = '0.5rem';
      stepsInfo.style.marginBottom = '1rem';
      stepsInfo.style.fontSize = '0.75rem';
      stepsInfo.style.color = 'rgba(0, 0, 0, 0.5)';
    }
    stepsInfo.textContent = `${this._currentIndex + 1}/${this._journey.length}`;
    if (this._stepsInfoClass) {
      stepsInfo.classList.add(...arrayFromClassesString(this._stepsInfoClass));
    }
    return stepsInfo;
  }

  private _createButton(text: string, onClick: () => void) {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.addEventListener('click', onClick);
    if (!this._preventDefaultStyles) {
      btn.style.padding = '0.25rem 1rem';
      btn.style.borderRadius = '0.25rem';
      btn.style.border = 'none';
      btn.style.backgroundColor = 'rgba(0, 0, 0, 0.1)';
      btn.style.cursor = 'pointer';
      btn.style.fontWeight = '600';
      btn.style.fontSize = '1rem';
    }
    if (this._btnClass) {
      btn.classList.add(...arrayFromClassesString(this._btnClass));
    }
    return btn;
  }

  private _createButtonsContainer() {
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
      const skipBtn = this._createButton(
        this._skipBtnText,
        this.skipTour.bind(this),
      );
      centerBtnContainer.appendChild(skipBtn);
    }

    buttonsContainer.appendChild(prevBtnContainer);
    buttonsContainer.appendChild(centerBtnContainer);
    buttonsContainer.appendChild(nextBtnContainer);
    return buttonsContainer;
  }

  private async _createOrMoveRootOverlay() {
    let currentRootOverlay = document.querySelector('#revelio-overlay');

    if (currentRootOverlay) {
      this._rootElement.appendChild(currentRootOverlay);
    } else {
      currentRootOverlay = this._renderOverlay();
    }

    currentRootOverlay ??= document.querySelector('#revelio-overlay');

    if (!currentRootOverlay) {
      this._renderOverlay();
    }
  }

  private async _renderStepDialog(
    step: JourneyStep,
    elementPosition?: { top: number; left: number },
    elementDimensions?: { width: number; height: number },
  ) {
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

  private _createBlinkOverlay(
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
    blinkOverlay.style.zIndex = zIndexValue;
    blinkOverlay.style.pointerEvents = 'none';
    blinkOverlay.style.borderRadius =
      window.getComputedStyle(element).borderRadius;
    blinkOverlay.id = 'revelio-blink-overlay';
    this._rootElement.appendChild(blinkOverlay);

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
        iterations: this._persistBlink ? Infinity : 1,
        easing: 'ease-in',
      },
    );
  }

  private _addOverlayInsideElement(element: HTMLElement, id: string) {
    const elementComputedStyle = window.getComputedStyle(element);
    const overlay = document.createElement('div');
    overlay.id = `revelio-overlay-${id}`;
    overlay.style.position = 'absolute';
    overlay.style.top = `calc(0px - ${elementComputedStyle.borderWidth})`;
    overlay.style.left = `calc(0px - ${elementComputedStyle.borderWidth})`;
    overlay.style.width = `calc(${elementComputedStyle.width} )`;
    overlay.style.height = `calc(${elementComputedStyle.height} )`;
    if (elementComputedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      overlay.style.backgroundColor = this._baseConfig.overlayColor;
    }
    overlay.style.border = elementComputedStyle.border;
    overlay.style.borderRadius = elementComputedStyle.borderRadius;
    overlay.style.borderColor = this._baseConfig.overlayColor;
    overlay.style.zIndex = `calc(var(--revelio-z-index) + 1)`;
    overlay.onclick = this.skipTour.bind(this);
    element.appendChild(overlay);
  }

  private async _createStackedContextsOverlays(
    highlightedElement: HTMLElement,
  ) {
    if (this._stackingContextAncestors) {
      if (!document.querySelector('#revelio-overlay-ancestor-style')) {
        const style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.id = 'revelio-overlay-ancestor-style';
        style.innerHTML = `
          .${revelioElementAncestorWithOverlayClass} { position: relative; }
          .${revelioElementAncestorWithOpacityClass} { opacity: 0.2; }
        `;
        // NOTE: the opacity doesn't reduce the vissibility as an overlay but is good enough to indicate that the element is not the highlighted one
        // prepend so other styles can override this one
        document.head.prepend(style);
      }

      function addOverlayToSiblingsWithoutHighlightedElement(
        ancestorElement: HTMLElement,
        revelioInstance: Revelio,
      ) {
        // get all the children of the ancestorElement
        const children = ancestorElement.children;
        // if no children, add the opacity
        if (!children.length) {
          return ancestorElement.classList.add(
            revelioElementAncestorWithOpacityClass,
          );
        }
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (
            child instanceof HTMLElement &&
            child !== highlightedElement &&
            !child.id.match(/revelio-overlay/) &&
            !stackingContextAncestorElements.some(
              (ancestor) => ancestor === child,
            )
          ) {
            const childComputedStyle = window.getComputedStyle(child);
            if (
              !child.contains(highlightedElement) &&
              childComputedStyle.backgroundColor !== 'rgba(0, 0, 0, 0)'
            ) {
              // the child has a background color, so we will apply an overlay to reduce its visibility
              if (childComputedStyle.position === 'static') {
                // this class is for the overlay to work in a relative positioned element
                child.classList.add(revelioElementAncestorWithOverlayClass);
              }
              revelioInstance._addOverlayInsideElement(
                child,
                `ancestor-sibling-${i}`,
              );
            } else {
              // continue checking the children
              addOverlayToSiblingsWithoutHighlightedElement(
                child,
                revelioInstance,
              );
            }
          }
        }
      }

      const stackingContextAncestorElements = await Promise.all(
        this._stackingContextAncestors.map(async (ancestor) => {
          return await this._getElement(ancestor.element);
        }),
      );

      await Promise.all(
        this._stackingContextAncestors.map(async (ancestor, idx) => {
          // get the stacking context ancestors elements
          const stackingContextAncestorElement =
            stackingContextAncestorElements[idx]!;

          ancestor.originalStyles = { ...stackingContextAncestorElement.style };

          stackingContextAncestorElement.style.zIndex = `calc(var(--revelio-z-index) + ${idx} + 1)`;
          const ancestorElementComputedStyle = window.getComputedStyle(
            stackingContextAncestorElement,
          );
          if (ancestorElementComputedStyle.position === 'static') {
            stackingContextAncestorElement.style.position = 'relative';
          }
          this._addOverlayInsideElement(
            stackingContextAncestorElement,
            `ancestor-${idx}`,
          );
          if (
            // this means that the background is transparent
            ancestorElementComputedStyle.backgroundColor === 'rgba(0, 0, 0, 0)'
          ) {
            addOverlayToSiblingsWithoutHighlightedElement(
              stackingContextAncestorElement,
              this,
            );
          }
        }),
      );
    }
  }

  private async _highlightStepElement(element: HTMLElement) {
    await this._createStackedContextsOverlays(element);

    const elementComputedStyle = window.getComputedStyle(element);
    element.style.zIndex = (
      +zIndexOverlayValue +
      (this._stackingContextAncestors?.length ?? 0) +
      1
    ).toString();
    if (elementComputedStyle.position === 'static') {
      element.style.position = 'relative';
    }
    if (this._disableClick) {
      element.style.pointerEvents = 'none';
    }
    if (this._goNextOnClick) {
      element.addEventListener('click', this._boundNextStep);
    }

    // get the position and dimensions
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
        left,
      },
      dimensions: {
        width,
        height,
      },
    };
  }

  /**
   * Returns the step for the given index, or the current step if no index is provided
   */
  private _getStep(index: number = this._currentIndex) {
    const step = this._journey[index];
    if (!step) {
      throw this._createError(`Step ${index} not found`);
    }
    return step;
  }

  private _scrollStartHandler = () => {};

  private async _highlightAndRenderDialog(stepElement: HTMLElement) {
    const { position, dimensions } =
      await this._highlightStepElement(stepElement);
    await this._renderStepDialog(this._getStep(), position, dimensions);
  }

  /**
   * Await for elements to animate, if any
   */
  private async _awaitAnimatedElements() {
    if (this._animatedElements.length > 0) {
      let iteratingSelector: string | HTMLElement | undefined;
      const animatedElementsStillAnimatingPromises = this._animatedElements
        .map((selector) => {
          iteratingSelector = selector;
          return this._getElement(selector);
        })
        .filter(async (element) => {
          const { animationPlayState, transitionProperty } =
            window.getComputedStyle(await element);
          return (
            animationPlayState === 'running' || transitionProperty !== 'none'
          );
        })
        .map(
          (element) =>
            new Promise<void>(async (resolve) => {
              let resolved = false;
              element.then((element) => {
                const animationEndHandler = () => {
                  element.removeEventListener(
                    'animationend',
                    animationEndHandler,
                  );
                  element.removeEventListener(
                    'transitionend',
                    animationEndHandler,
                  );
                  if (resolved) return;
                  resolved = true;
                  resolve();
                };
                element.addEventListener('animationend', animationEndHandler);
                element.addEventListener('transitionend', animationEndHandler);

                // fallback resolution in case the event is not triggered
                setTimeout(() => {
                  if (resolved) return;
                  resolved = true;
                  console.warn(
                    `A timeout was triggered to resolve the promise, the animation last too long or the 
                    found element with selector ${iteratingSelector?.toString()} is not animating`,
                  );
                  resolve();
                }, 5000);
              });
            }),
        );
      if (animatedElementsStillAnimatingPromises.length > 0) {
        await Promise.all(animatedElementsStillAnimatingPromises);
      }
    }
  }

  /**
   * Overlay that covers the element for the current step
   */
  private async _mountStep() {
    return new Promise<void>(async (resolve) => {
      const step = this._getStep();
      if (step.element === undefined) {
        this._placement = 'center';
        await this._renderStepDialog(step);
        return resolve();
      }

      await this._awaitAnimatedElements();

      const stepElement = await this._getElement(step.element);

      if (!this._preventScrollIntoView) {
        // flag to not resolve if scroll event is triggered
        let scrollTriggered = false;
        let resolved = false;

        const scrollEndHandler = async () => {
          if (resolved) return;
          await this._highlightAndRenderDialog(stepElement);
          resolved = true;
          resolve();
        };

        const scrollStartHandler = async () => {
          if (!scrollTriggered) {
            scrollTriggered = true;
            const step = this._getStep();
            if (step.element === undefined) {
              console.error(
                'no element, is undefined and will only render dialog',
              );
              this._placement = 'center';
              await this._renderStepDialog(step);
              resolved = true;
              return;
            }
          }

          // NOTE: this is a workaround because scrollend does not work always
          clearTimeout(window.scrollEndTimer);
          window.scrollEndTimer = setTimeout(scrollEndHandler, 100);
        };

        this._scrollStartHandler = scrollStartHandler;

        window.addEventListener('scroll', this._scrollStartHandler, {
          capture: true,
        });

        stepElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });

        if (!scrollTriggered) {
          // if the scroll has been triggered there is no need to wait for the setTimeout
          setTimeout(async () => {
            if (!scrollTriggered && !resolved) {
              // scrollTriggered needs to be checked again as it might have changed
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

  private _handleKeyDown = async (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowRight':
        if (this._requireClickToGoNext) {
          return;
        }
        await this.nextStep();
        break;
      case 'ArrowLeft':
        await this.prevStep();
        break;
      case 'Escape':
        await this.skipTour();
        break;
    }
  };

  public async start() {
    const continueFlow = await this._onStartBefore?.();
    if (continueFlow === false) {
      return;
    }

    if (Revelio._started) {
      console.warn('Another Revelio tour is already started');
      return;
    }

    this._transitionBlocked = true;
    document.addEventListener('keydown', this._handleKeyDown);

    Revelio._started = true;
    this._currentIndex = 0;

    await this._setStepProps();

    await this._mountStep();

    this._transitionBlocked = false;

    await this._onStartAfter?.();
  }

  public async end() {
    const continueFlow = await this._onEndBefore?.();
    if (continueFlow === false) {
      return;
    }

    this._transitionBlocked = true;

    const overlay = this._rootElement.querySelector('#revelio-overlay');
    if (overlay) {
      this._rootElement.removeChild(overlay);
    }

    try {
      await this._unmountStep();
      await this._onEndAfterUnmountStep?.();
    } catch (e) {} // to continue the execution even if there is an error

    this._currentIndex = 0;

    document.removeEventListener('keydown', this._handleKeyDown);
    Revelio._started = false;
    this._transitionBlocked = false;

    await this._onEndAfter?.();
  }

  private _unmountDialog() {
    const dialog = this._rootElement.querySelector('#revelio-dialog');

    if (dialog) {
      this._rootElement.removeChild(dialog);
    }
  }

  private _unmountBlinkOverlay() {
    const blinkOverlay = this._rootElement.querySelector(
      '#revelio-blink-overlay',
    );
    if (blinkOverlay) {
      this._rootElement.removeChild(blinkOverlay);
    }
  }

  private async _removeStackingContextAncestorsOverlays() {
    if (this._stackingContextAncestors) {
      function removeWithOverlayClassFromSiblingsWithoutHighlightedElement(
        ancestorElement: HTMLElement,
      ) {
        // get all the children of the ancestorElement
        const children = ancestorElement.children;
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child instanceof HTMLElement) {
            child.classList.remove(revelioElementAncestorWithOverlayClass);
            child.classList.remove(revelioElementAncestorWithOpacityClass);
            removeWithOverlayClassFromSiblingsWithoutHighlightedElement(child);
          }
        }
      }
      await Promise.all(
        this._stackingContextAncestors.map(async (ancestor) => {
          const stackingContextAncestorElement = await this._getElement(
            ancestor.element,
          );
          const ancestorElementComputedStyle = window.getComputedStyle(
            stackingContextAncestorElement,
          );
          if (
            ancestorElementComputedStyle.backgroundColor === 'rgba(0, 0, 0, 0)'
          ) {
            removeWithOverlayClassFromSiblingsWithoutHighlightedElement(
              stackingContextAncestorElement,
            );
            document.head
              .querySelector('#revelio-overlay-ancestor-style')
              ?.remove();
          }
          stackingContextAncestorElement.style.zIndex =
            ancestor.originalStyles?.zIndex ?? '';
          stackingContextAncestorElement.style.position =
            ancestor.originalStyles?.position ?? '';
          if (!stackingContextAncestorElement.getAttribute('style')?.trim()) {
            stackingContextAncestorElement.removeAttribute('style');
          }

          // remove all overlays
          document
            .querySelectorAll(`[id^="revelio-overlay-"]`)
            .forEach((overlay) => {
              const overlayParent = overlay.parentElement;
              if (overlayParent) {
                overlayParent.removeChild(overlay);
              }
            });
        }),
      );
    }
  }

  private async _unmountStep() {
    const step = this._getStep();

    if (step.element !== undefined) {
      const element = await this._getElement(step.element);

      element.style.zIndex = '';
      element.style.position = '';
      if (this._disableClick) {
        element.style.pointerEvents = '';
      }

      if (!element.getAttribute('style')?.trim()) {
        element.removeAttribute('style');
      }

      if (this._goNextOnClick) {
        element.removeEventListener('click', this._boundNextStep);
      }
      this._unmountBlinkOverlay();
    }
    this._unmountDialog();

    await this._removeStackingContextAncestorsOverlays();

    // remove scroll listener if any
    window.removeEventListener('scroll', this._scrollStartHandler, {
      capture: true,
    });
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
    if (this._transitionBlocked) {
      return;
    }
    const continueFlow = await this._onNextBefore?.();
    if (continueFlow === false) {
      return;
    }

    if (this._currentIndex >= this._journey.length - 1) {
      /**
       * this is not prevented because when navigating with arrow keys, the user
       * might expect to finish the tour if there is no next step
       * the same could be expected if a "Next" button is showed instead of
       + the "Done" button at the last step
       */
      console.warn('no next step, finishing tour');
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

  private _boundNextStep = this.nextStep.bind(this);

  public async prevStep() {
    if (this._transitionBlocked) {
      return;
    }
    const continueFlow = await this._onPrevBefore?.();
    if (continueFlow === false) {
      return;
    }

    if (this._currentIndex <= 0) {
      console.warn('no prev step');
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
}
