/**
 * Config that is shared between the 'options' and 'journey.[].options' properties
 */
type RevelioSharedConfig = {
  /**
   * The placement of the feature tour step. Can be 'top', 'bottom', 'left', or 'right'.
   */
  placement: 'top' | 'bottom' | 'left' | 'right';

  /**
   * The padding around the dialog content.
   */
  dialogPadding: number;

  /**
   * The max width of the dialog content.
   */
  dialogMaxWidth: number;

  /**
   * The max height of the dialog content.
   */
  dialogMaxHeight: number;

  /**
   * The margin around the dialog content.
   */
  dialogMargin: number;

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
  options: Partial<RevelioSharedConfig>;
};

const defaultOptions: RevelioOptions = {
  placement: 'top',
  dialogPadding: 16,
  dialogMaxWidth: 300,
  dialogMaxHeight: 300,
  dialogMargin: 16,
  prevBtnText: 'Prev',
  nextBtnText: 'Next',
  skipBtnText: 'Skip',
  doneBtnText: 'Done',
  showPrevBtn: true,
  showNextBtn: true,
  showSkipBtn: true,
  showDoneBtn: true,
  overlayColor: 'rgba(0, 0, 0, 0.5)',
};

export class Revelio {
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

  private dialogPadding: RevelioOptions['dialogPadding'] =
    defaultOptions.dialogPadding;
  private dialogMaxWidth: RevelioOptions['dialogMaxWidth'] =
    defaultOptions.dialogMaxWidth;
  private dialogMaxHeight: RevelioOptions['dialogMaxHeight'] =
    defaultOptions.dialogMaxHeight;
  private dialogMargin: RevelioOptions['dialogMargin'] =
    defaultOptions.dialogMargin;
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
    journey: JourneyStep[];
    rootElement?: HTMLElement | string;
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
    this.dialogPadding =
      stepOptions?.dialogPadding ??
      this.baseConfig.dialogPadding ??
      this.dialogPadding;
    this.dialogMaxWidth =
      stepOptions?.dialogMaxWidth ??
      this.baseConfig.dialogMaxWidth ??
      this.dialogMaxWidth;
    this.dialogMaxHeight =
      stepOptions?.dialogMaxHeight ??
      this.baseConfig.dialogMaxHeight ??
      this.dialogMaxHeight;
    this.dialogMargin =
      stepOptions?.dialogMargin ??
      this.baseConfig.dialogMargin ??
      this.dialogMargin;
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
    this.showPrevBtn =
      stepOptions?.showPrevBtn ??
      this.baseConfig.showPrevBtn ??
      this.showPrevBtn;
    this.showNextBtn =
      stepOptions?.showNextBtn ??
      this.baseConfig.showNextBtn ??
      this.showNextBtn;
    this.showSkipBtn =
      stepOptions?.showSkipBtn ??
      this.baseConfig.showSkipBtn ??
      this.showSkipBtn;
    this.showDoneBtn =
      stepOptions?.showDoneBtn ??
      this.baseConfig.showDoneBtn ??
      this.showDoneBtn;
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
    overlay.style.position = 'absolute';
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

  private renderStepDialog(
    step: JourneyStep,
    elementPosition: { top: number; left: number },
    elementDimensions: { width: number; height: number },
  ) {
    const dialog = document.createElement('div');
    dialog.style.position = 'absolute';
    dialog.style.zIndex = '10000';
    dialog.style.maxWidth = `${this.dialogMaxWidth}px`;
    dialog.style.maxHeight = `${this.dialogMaxHeight}px`;
    dialog.style.backgroundColor = 'white';
    dialog.style.padding = `${this.dialogPadding}px`;
    dialog.style.borderRadius = '0.5rem';
    dialog.style.boxShadow = '0 0 0.5rem rgba(0, 0, 0, 0.5)';
    dialog.style.margin = `${this.dialogPadding}px`;
    dialog.style.width = '300px';
    dialog.id = 'revelio-dialog';

    // Set CSS to make it invisible until we have the correct position
    dialog.style.visibility = 'hidden';

    const title = document.createElement('h3');
    title.style.color = 'black';
    title.textContent = step.title;
    dialog.appendChild(title);

    const content = document.createElement('p');
    content.style.color = 'black';
    content.textContent = step.content;
    dialog.appendChild(content);

    const buttons = document.createElement('div');
    buttons.style.display = 'flex';
    buttons.style.justifyContent = 'space-between';
    dialog.appendChild(buttons);

    if (this.showPrevBtn) {
      const prevBtn = document.createElement('button');
      prevBtn.textContent = this.prevBtnText;
      prevBtn.addEventListener('click', () => {
        this.onPrev?.();
        this.prevStep();
      });
      buttons.appendChild(prevBtn);
    }

    if (this.showNextBtn) {
      const nextBtn = document.createElement('button');
      nextBtn.textContent = this.nextBtnText;
      nextBtn.addEventListener('click', () => {
        this.onNext?.();
        this.nextStep();
      });
      buttons.appendChild(nextBtn);
    }

    if (this.showSkipBtn) {
      const skipBtn = document.createElement('button');
      skipBtn.textContent = this.skipBtnText;
      skipBtn.addEventListener('click', () => {
        this.onSkip?.();
        this.end();
      });
      buttons.appendChild(skipBtn);
    }

    if (this.showDoneBtn) {
      const doneBtn = document.createElement('button');
      doneBtn.textContent = this.doneBtnText;
      doneBtn.addEventListener('click', () => {
        this.onDone?.();
        this.end();
      });
      buttons.appendChild(doneBtn);
    }

    this.rootElement.appendChild(dialog);

    // TODO: refactor this to be a separate function to get the position and dimensions of the dialog
    const dialogBoundingRect = dialog.getBoundingClientRect();
    const dialogBorderBoxWidth =
      dialogBoundingRect.width + this.dialogMargin * 2;
    const dialogBorderBoxHeight =
      dialogBoundingRect.height + this.dialogMargin * 2;

    // get dialog top and left position, take into account the dialog does not overflow the root element
    const rootElementRect = this.rootElement.getBoundingClientRect();
    const rootElementWidth = rootElementRect.width;
    const rootElementHeight = rootElementRect.height;
    const dialogLeft = Math.min(
      elementPosition.left + elementDimensions.width,
      rootElementWidth - dialogBorderBoxWidth,
    );
    const dialogTop = Math.min(
      elementPosition.top + elementDimensions.height,
      rootElementHeight - dialogBorderBoxHeight,
    );
    dialog.style.top = `${dialogTop}px`;
    dialog.style.left = `${dialogLeft}px`;

    // Set CSS to make it visible
    dialog.style.visibility = '';
  }

  private higlightStepElement(step: JourneyStep) {
    const element = this.getStepElement(step.element);
    element.style.zIndex = '10000';
    element.style.position = 'relative';

    // return the position of the element relative to the root element
    const rect = element.getBoundingClientRect();
    const rootRect = this.rootElement.getBoundingClientRect();
    const top = rect.top - rootRect.top;
    const left = rect.left - rootRect.left;
    const width = rect.width;
    const height = rect.height;

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
    const { position, dimensions } = this.higlightStepElement(step);
    this.renderStepDialog(step, position, dimensions);
  }

  public start() {
    this.currentIndex = 0;
    this.setStepProps();

    // render overlay on root element
    this.renderOverlay();

    // higlight the element for the current step
    this.mountStep();
  }

  public end() {
    // remove overlay
    const overlay = this.rootElement.querySelector('#revelio-overlay');
    if (overlay) {
      this.rootElement.removeChild(overlay);
    }

    this.unmountStep();

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