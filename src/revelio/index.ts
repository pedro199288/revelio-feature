import { arrayFromString, getNumberFromString } from '../utils';

/**
 * Config that is shared between the 'options' and 'journey.[].options' properties
 */
type RevelioSharedConfig = {
  /**
   * The placement of the feature tour step. Can be 'top', 'bottom', 'left', or 'right'.
   */
  placement: 'top' | 'bottom' | 'left' | 'right';

  /**
   * Determines whether the step dialog should be scrolled into view.
   */
  preventScrollIntoView: boolean;

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
   * Function to call when the feature tour starts.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onStart?: (...args: any[]) => any;

  /**
   * Function to call when the feature tour ends.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEnd?: (...args: any[]) => any;

  /**
   * Function to call when the next button is clicked.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNext?: (...args: any[]) => any;

  /**
   * Function to call when the previous button is clicked.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onPrev?: (...args: any[]) => any;

  /**
   * Function to call when the skip button is clicked.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSkip?: (...args: any[]) => any;
  /**
   * Function to call when the user clicks the 'Done' button
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDone?: (...args: any[]) => any;
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
  element: string | HTMLElement;
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
  private journey: JourneyStep[];
  /**
   * The current step index for the Revelio instance
   */
  private currentIndex: number;

  private placement: RevelioOptions['placement'] = defaultOptions.placement;
  private preventScrollIntoView: RevelioOptions['preventScrollIntoView'] =
    defaultOptions.preventScrollIntoView;
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
  private onStart: RevelioOptions['onStart'];
  private onEnd: RevelioOptions['onEnd'];
  private onNext: RevelioOptions['onNext'];
  private onPrev: RevelioOptions['onPrev'];
  private onSkip: RevelioOptions['onSkip'];
  private onDone: RevelioOptions['onDone'];

  constructor({
    journey,
    rootElement,
    options,
  }: {
    /**
     * The feature journey steps for the Revelio instance
     */
    journey: JourneyStep[];
    /**
     * The root element for the Revelio instance
     */
    rootElement?: HTMLElement | string;
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
    this.journey = journey ?? [];
    this.currentIndex = 0;
    this.setStepProps();

    // validate root element or default to document.body
    const element =
      typeof rootElement === 'string'
        ? document.querySelector(rootElement)
        : rootElement;
    if (rootElement && !element)
      throw new Error(`Element ${element} not found`);
    if (element && !(element instanceof HTMLElement))
      throw new Error(`Element ${element} is not an HTMLElement`);

    this.rootElement = element ?? document.body;
  }

  private getStepElement(element: string | HTMLElement): HTMLElement {
    const e =
      typeof element === 'string' ? document.querySelector(element) : element;
    if (!e) throw new Error(`Element ${element} not found`);
    if (!(e instanceof HTMLElement))
      throw new Error(`Element ${element} is not an HTMLElement`);
    return e;
  }

  private setStepProps() {
    const stepOptions = this.journey[this.currentIndex]?.options;
    this.placement =
      stepOptions?.placement ?? this.baseConfig.placement ?? this.placement;
    this.preventScrollIntoView =
      stepOptions?.preventScrollIntoView ??
      this.baseConfig.preventScrollIntoView ??
      this.preventScrollIntoView;
    this.showStepsInfo =
      stepOptions?.showStepsInfo ??
      this.baseConfig.showStepsInfo ??
      this.showStepsInfo;
    this.dialogClass =
      stepOptions?.dialogClass ??
      this.baseConfig.dialogClass ??
      this.dialogClass;
    this.titleClass =
      stepOptions?.titleClass ?? this.baseConfig.titleClass ?? this.titleClass;
    this.contentClass =
      stepOptions?.contentClass ??
      this.baseConfig.contentClass ??
      this.contentClass;
    this.stepsInfoClass =
      stepOptions?.stepsInfoClass ??
      this.baseConfig.stepsInfoClass ??
      this.stepsInfoClass;
    this.btnClass =
      stepOptions?.btnClass ?? this.baseConfig.btnClass ?? this.btnClass;
    this.preventDefaultStyles =
      stepOptions?.preventDefaultStyles ??
      this.baseConfig.preventDefaultStyles ??
      this.preventDefaultStyles;
    this.prevBtnText =
      stepOptions?.prevBtnText ??
      this.baseConfig.prevBtnText ??
      this.prevBtnText;
    this.nextBtnText =
      stepOptions?.nextBtnText ??
      this.baseConfig.nextBtnText ??
      this.nextBtnText;
    this.skipBtnText =
      stepOptions?.skipBtnText ??
      this.baseConfig.skipBtnText ??
      this.skipBtnText;
    this.doneBtnText =
      stepOptions?.doneBtnText ??
      this.baseConfig.doneBtnText ??
      this.doneBtnText;
    this.showPrevBtn = stepOptions?.showPrevBtn ?? this.currentIndex > 0;
    this.showNextBtn =
      stepOptions?.showNextBtn ?? this.currentIndex < this.journey.length - 1;
    this.showSkipBtn =
      stepOptions?.showSkipBtn ??
      (this.currentIndex < this.journey.length - 1 &&
        (this.baseConfig.showSkipBtn ?? this.showSkipBtn));
    this.showDoneBtn =
      stepOptions?.showDoneBtn ??
      (this.currentIndex === this.journey.length - 1 &&
        (this.baseConfig.showDoneBtn ?? this.showDoneBtn));
    this.onStart =
      stepOptions?.onStart ?? this.baseConfig.onStart ?? this.onStart;
    this.onEnd = stepOptions?.onEnd ?? this.baseConfig.onEnd ?? this.onEnd;
    this.onNext = stepOptions?.onNext ?? this.baseConfig.onNext ?? this.onNext;
    this.onPrev = stepOptions?.onPrev ?? this.baseConfig.onPrev ?? this.onPrev;
    this.onSkip = stepOptions?.onSkip ?? this.baseConfig.onSkip ?? this.onSkip;
    this.onDone = stepOptions?.onDone ?? this.baseConfig.onDone ?? this.onDone;
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

    overlay.onclick = () => {
      this.end();
    };

    this.rootElement.appendChild(overlay);
  }

  private setDialogPosition(
    dialog: HTMLElement,
    elementPosition: { top: number; left: number },
    elementDimensions: { width: number; height: number },
  ) {
    const dialogBoundingRect = dialog.getBoundingClientRect();
    const dialogComputedStyle = window.getComputedStyle(dialog);
    const dialogMargin = getNumberFromString(dialogComputedStyle.margin);
    const dialogBorderBoxWidth = dialogBoundingRect.width + dialogMargin * 2;
    const dialogBorderBoxHeight = dialogBoundingRect.height + dialogMargin * 2;
    const elementXCenter = elementPosition.left + elementDimensions.width / 2;
    const elementYCenter = elementPosition.top + elementDimensions.height / 2;

    // get dialog top and left position, take into account the dialog does not overflow the root element
    const rootElementRect = this.rootElement.getBoundingClientRect();
    const rootElementWidth = rootElementRect.width;
    const rootElementHeight = rootElementRect.height;

    let dialogLeft: number = 0,
      dialogTop: number = 0;

    switch (this.placement) {
      case 'right':
      default:
        console.log('getting for right');
        dialogLeft = Math.min(
          elementPosition.left + elementDimensions.width,
          rootElementWidth - dialogBorderBoxWidth,
        );
        dialogTop = Math.min(
          elementYCenter - dialogBorderBoxHeight / 2,
          rootElementHeight - dialogBorderBoxHeight,
        );
        break;
      case 'left':
        console.log('getting for left');
        dialogLeft = Math.max(elementPosition.left - dialogBorderBoxWidth, 0);
        dialogTop = Math.min(
          elementYCenter - dialogBorderBoxHeight / 2,
          rootElementHeight - dialogBorderBoxHeight,
        );
        break;
      case 'top':
        console.log('getting for top');
        dialogLeft = Math.min(
          elementXCenter - dialogBorderBoxWidth / 2,
          rootElementWidth - dialogBorderBoxWidth,
        );
        dialogTop = Math.max(elementPosition.top - dialogBorderBoxHeight, 0);
        break;
      case 'bottom':
        console.log('getting for bottom');
        dialogLeft = Math.min(
          elementXCenter - dialogBorderBoxWidth / 2,
          rootElementWidth - dialogBorderBoxWidth,
        );
        dialogTop = Math.min(
          elementPosition.top + elementDimensions.height,
          rootElementHeight - dialogBorderBoxHeight,
        );
        break;
    }

    if (dialogLeft < 0) {
      dialogLeft = 0;
    }
    if (dialogTop < 0) {
      dialogTop = 0;
    }

    dialog.style.top = `${dialogTop}px`;
    dialog.style.left = `${dialogLeft}px`;

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
    stepsInfo.textContent = `${this.currentIndex + 1}/${this.journey.length}`;
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
        this.onPrev?.();
        this.prevStep();
      });
      prevBtnContainer.appendChild(prevBtn);
    }

    if (this.showNextBtn) {
      const nextBtn = this.createButton(this.nextBtnText, () => {
        this.onNext?.();
        this.nextStep();
      });
      nextBtnContainer.appendChild(nextBtn);
    }

    if (this.showDoneBtn) {
      const doneBtn = this.createButton(this.doneBtnText, () => {
        this.onDone?.();
        this.end();
      });
      nextBtnContainer.appendChild(doneBtn);
    }

    if (this.showSkipBtn) {
      const skipBtn = this.createButton(this.skipBtnText, () => {
        this.onSkip?.();
        this.end();
      });
      centerBtnContainer.appendChild(skipBtn);
    }

    buttonsContainer.appendChild(prevBtnContainer);
    buttonsContainer.appendChild(centerBtnContainer);
    buttonsContainer.appendChild(nextBtnContainer);
    return buttonsContainer;
  }

  private renderStepDialog(
    step: JourneyStep,
    elementPosition: { top: number; left: number },
    elementDimensions: { width: number; height: number },
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

    if (!this.preventScrollIntoView) {
      dialog.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }
  }

  private highlightStepElement(step: JourneyStep) {
    const element = this.getStepElement(step.element);
    element.style.zIndex = '10000';
    element.style.position = 'relative';

    // get the position and dimensions
    const elementRect = element.getBoundingClientRect();
    const rootRect = this.rootElement.getBoundingClientRect();
    const top = elementRect.top - rootRect.top;
    const left = elementRect.left - rootRect.left;
    const { width, height } = elementRect;

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
        iterations: 1,
        easing: 'ease-in',
      },
    );

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
    const step = this.journey[this.currentIndex];
    if (!step) {
      throw new Error(`Step ${this.currentIndex} not found`);
    }
    return step;
  }

  /**
   * Overlay that covers the element for the current step
   */
  private mountStep() {
    const step = this.getCurrentStep();
    const { position, dimensions } = this.highlightStepElement(step);
    this.renderStepDialog(step, position, dimensions);
  }

  public start() {
    if (Revelio.started) {
      console.warn('Another Revelio tour is already started');
      return;
    }
    Revelio.started = true;
    this.currentIndex = 0;
    this.setStepProps();

    this.renderOverlay();

    this.mountStep();
  }

  public end() {
    const overlay = this.rootElement.querySelector('#revelio-overlay');
    if (overlay) {
      this.rootElement.removeChild(overlay);
    }

    this.unmountStep();

    this.currentIndex = 0;

    Revelio.started = false;

    // call onEnd
    this.onEnd?.();
  }

  public unmountStep() {
    const step = this.getCurrentStep();

    const dialog = this.rootElement.querySelector('#revelio-dialog');

    if (dialog) {
      this.rootElement.removeChild(dialog);
    }

    const element = this.getStepElement(step.element);

    element.style.zIndex = '';
    element.style.position = '';

    if (!element.getAttribute('style')?.trim()) {
      element.removeAttribute('style');
    }

    const blinkOverlay = this.rootElement.querySelector(
      '#revelio-blink-overlay',
    );
    if (blinkOverlay) {
      this.rootElement.removeChild(blinkOverlay);
    }
  }

  public nextStep() {
    if (this.currentIndex >= this.journey.length - 1) {
      console.warn('no next step');
      return;
    }

    this.unmountStep();

    this.currentIndex += 1;
    this.setStepProps();
    this.mountStep();
  }

  public prevStep() {
    if (this.currentIndex <= 0) {
      console.warn('no prev step');
      return;
    }

    this.unmountStep();

    this.currentIndex -= 1;
    this.setStepProps();
    this.mountStep();
  }
}

export default Revelio;
