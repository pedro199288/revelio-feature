import { Revelio } from 'revelio-feature';

const tour = new Revelio({
  options: {
    preventDefaultStyles: true,
    dialogClass: 'bg-white p-4 m-4 rounded-lg shadow-lg text-center',
    contentClass: 'text-center',
    titleClass: 'text-2xl font-bold text-red-400',
    stepsInfoClass: 'text-gray-300 my-4 text-center',
    btnClass: 'bg-red-400 text-white px-4 py-1 rounded-lg',
  },
  journey: [
    {
      title: 'Features Link',
      content: 'Click here to know all the <strong>featues</strong> available',
      element: '#features-link',
      options: {
        placement: 'bottom',
      },
    },
    {
      title: 'Get started',
      content: 'Want to use now this app? Click here to go to the Todos page',
      element: '#get-started-button',
      options: {
        placement: 'bottom',
      },
    },
    {
      title: 'Learn more',
      content: 'Check the features',
      element: '#learn-more-button',
      options: {
        placement: 'bottom',
      },
    },
    {
      title: 'Dall-E Image',
      content: 'Nothing to do here, just enjoy the image',
      element: '#hero-image',
      options: {
        placement: 'bottom',
      },
    },
    {
      title: 'Features section',
      content: 'All the featues are in this section',
      element: '#features-section',
    },
    {
      title: 'Get Started',
      content: 'Click to start working with your todos!',
      element: '#get-started-features-button',
    },
    {
      title: 'The end',
      content: 'This is the end of the tour, enjoy working with this app',
      element: '#app',
      options: {
        placement: 'center',
      },
    },
  ],
});

function startTour() {
  tour.start();
}

document.querySelector<HTMLButtonElement>('#start-tour-index')!.onclick =
  startTour;
