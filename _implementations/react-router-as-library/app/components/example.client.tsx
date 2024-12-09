import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Revelio } from 'revelio-feature';

export function ExampleClient() {
  const tour = new Revelio({
    options: {
      onEndAfter: function () {
        this.resetJourney();
      },
      onSkipBefore: function () {
        this.addStep(
          {
            title: 'Exit',
            content: 'Do you want to exit the tour?',
            options: {
              // to not used the global onSkipBefore that is used add the exit step
              onSkipBefore: function () {},
              onPrevBefore: function () {
                // This will be the 'No' button
                // go to the previous step
                this.goToStep(this.currentIndex - 1, {
                  onGoToStepAfterUnmountStep: function () {
                    // remove the created exit dialog step
                    this.removeStep(this.currentIndex);
                  },
                });
                // return false to prevent the tour to go to the previous step as it is already done
                return false;
              },
              onNextBefore: function () {
                // This will be the 'Yes' button
                this.skipTour();
                // return false to prevent the tour to go to the next step as there won't be any
                return false;
              },
              nextBtnText: 'Yes',
              prevBtnText: 'No',
              placement: 'center',
              showStepsInfo: false,
              showPrevBtn: true,
              showNextBtn: true,
              showSkipBtn: false,
              showDoneBtn: false,
            },
          },
          this.currentIndex + 1,
        );
        this.goToStep(this.currentIndex + 1);
        return false;
      },
    },
    journey: [
      {
        title: 'Welcome to the app',
        content: 'This is the first step of the tour, open the dialog',
        element: '#dialog-trigger',
        options: {
          persistBlink: true,
          requireClickToGoNext: true,
          goNextOnClick: true,
          showNextBtn: false,
        },
      },
      {
        title: 'The dialog',
        content: 'This is the second step of the tour, the dialog',
        element: '#dialog-content',
      },
      {
        title: 'The button',
        content: 'This is the third step of the tour, the button',
        element: '#dialog-button',
      },
      {
        title: 'The end',
        content: 'Close the dialog clicking here',
        element: '#dialog-content button.absolute',
        options: {
          persistBlink: true,
        },
      },
    ],
  });

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => tour.start()}>Start tour</Button>

      <Dialog>
        <DialogTrigger id="dialog-trigger" asChild>
          <Button className="bg-red-500 max-w-fit">Open</Button>
        </DialogTrigger>
        <DialogContent id="dialog-content">
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
              <Button id="dialog-button">Button</Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
