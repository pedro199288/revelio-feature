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
     * The dialog will default to the center of the screen if the dialog doesn't fit with
     * any placement into the viewport.
     */
    fallbackPlacementToCenter: boolean;
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
export declare class Revelio {
    private static _started;
    /**
     * The options for the Revelio instance
     */
    private _baseConfig;
    /**
     * The root element for the Revelio instance
     */
    private _rootElement;
    /**
     * The feature tour for the Revelio instance
     */
    private _journey;
    /**
     * Read only copy of the initial journey
     */
    private _initialJourney;
    /**
     * The current step index for the Revelio instance
     */
    private _currentIndex;
    private _placement;
    private _fallbackPlacementToCenter;
    private _preventScrollIntoView;
    private _stackingContextAncestors?;
    private _disableBlink;
    private _persistBlink;
    private _disableClick;
    private _goNextOnClick;
    private _requireClickToGoNext;
    private _awaitElementTimeout;
    private _animatedElements;
    private _showStepsInfo;
    private _dialogClass;
    private _titleClass;
    private _contentClass;
    private _stepsInfoClass;
    private _btnClass;
    private _preventDefaultStyles;
    private _prevBtnText;
    private _nextBtnText;
    private _skipBtnText;
    private _doneBtnText;
    private _showPrevBtn;
    private _showNextBtn;
    private _showSkipBtn;
    private _showDoneBtn;
    private _onStartBefore;
    private _onStartAfter;
    private _onEndBefore;
    private _onEndAfterUnmountStep;
    private _onEndAfter;
    private _onNextBefore;
    private _onNextAfterUnmountStep;
    private _onNextAfter;
    private _onPrevBefore;
    private _onPrevAfterUnmountStep;
    private _onPrevAfter;
    private _onSkipBefore;
    private _onDone;
    constructor({ journey, options, }: {
        /**
         * The feature journey steps for the Revelio instance
         */
        journey: JourneyStep[];
        /**
         * The global options for the Revelio instance. Will be applied to all steps unless overridden by the step's options.
         */
        options?: Partial<RevelioOptions>;
    });
    get currentIndex(): number;
    get journey(): JourneyStep[];
    private _createError;
    /**
     * Set the journey to the initial journey, useful when some steps have been added or removed
     * and want to reset the journey to the initial state
     */
    resetJourney(): void;
    /**
     * @param index The index of the step to go
     * @param callbacks Callbacks to execute before and after the step is mounted and unmounted
     * @returns
     */
    goToStep(index: number, callbacks?: {
        onGoToStepBefore?: (this: Revelio) => void | boolean;
        onGoToStepAfterUnmountStep?: (this: Revelio) => void;
        onGoToStepAfter?: (this: Revelio) => void;
    }): Promise<void>;
    private _getElement;
    private _setStepProps;
    skipTour(): Promise<void>;
    /**
     * Global overlay that covers the entire page with a subtle dark background color
     */
    private _renderOverlay;
    private _getPlacementArray;
    private _setDialogPosition;
    private _createDialog;
    private _createTitle;
    private _createContent;
    private _createStepsInfo;
    private _createButton;
    private _createButtonsContainer;
    private _createOrMoveRootOverlay;
    private _renderStepDialog;
    private _createBlinkOverlay;
    private _addOverlayInsideElement;
    private _createStackedContextsOverlays;
    private _highlightStepElement;
    /**
     * Returns the step for the given index, or the current step if no index is provided
     */
    private _getStep;
    private _scrollStartHandler;
    private _highlightAndRenderDialog;
    /**
     * Await for elements to animate, if any
     */
    private _awaitAnimatedElements;
    /**
     * Overlay that covers the element for the current step
     */
    private _mountStep;
    _transitionBlocked: boolean;
    private _handleKeyDown;
    start(): Promise<void>;
    end(): Promise<void>;
    private _unmountDialog;
    private _unmountBlinkOverlay;
    private _removeStackingContextAncestorsOverlays;
    private _unmountStep;
    /**
     *
     * @param step The step to add
     * @param position The position to insert the step at (can be a negative number as
     * this works with splice). If not specified, the step will be added at the end of
     * the journey.
     */
    addStep(step: JourneyStep, position?: number): void;
    /**
     *
     * @param position The position of the step to remove (can be negative as this works with splice).
     * If not specified, the last step will be removed.
     */
    removeStep(position?: number): void;
    nextStep(): Promise<void>;
    private _boundNextStep;
    prevStep(): Promise<void>;
}
