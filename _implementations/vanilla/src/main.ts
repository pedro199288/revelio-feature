import './style.css';
import typescriptLogo from './typescript.svg';
import viteLogo from '/vite.svg';
import { setupCounter } from './counter.ts';
import { Revelio } from 'bun-library-starter';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="tour" type="button">Start tour</button>
    </div>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <div class="card">
      <button id="step-2" type="button">I'm step 2</button>
    </div>
    <div class="card">
      <button id="step-3" type="button">I'm step 3</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!);

const tour = new Revelio({
  journey: [
    {
      title: 'Counter',
      content: 'This is the counter button',
      element: '#counter',
      options: {
        placement: 'right',
      },
    },
    {
      title: 'Second',
      content: '',
      element: '#step-2',
      options: {
        placement: 'right',
      },
    },
    {
      title: 'Third',
      content: '',
      element: '#step-3',
      options: {
        placement: 'right',
      },
    },
    {
      title: 'Tour',
      content: 'This is the tour button',
      element: '#tour',
      options: {
        placement: 'right',
      },
    },
    {
      title: 'Read the docs',
      content: 'Click on the Vite and TypeScript logos to learn more',
      element: '.read-the-docs',
      options: {
        placement: 'top',
      },
    },
    {
      title: 'Vite',
      content: 'Vite is a fast build tool for modern web projects',
      element: '#app a:nth-child(1) .logo',
      options: {
        placement: 'bottom',
      },
    },
    {
      title: 'TypeScript',
      content:
        'TypeScript is a typed superset of JavaScript that compiles to plain JavaScript',
      element: '#app a:nth-child(2) .logo',
      options: {
        placement: 'bottom',
      },
    },
    {
      title: 'The end',
      content: 'This is the end of the tour',
      element: '#app',
      options: {
        placement: 'top',
      },
    },
  ],
});

function startTour() {
  tour.start();
}

document.querySelector<HTMLButtonElement>('#tour')!.onclick = startTour;
