import { Revelio } from 'revelio-feature';

const tour = new Revelio({
  journey: [
    {
      title: 'Global Clock',
      content:
        'This is the clock to manage your work time, take into account to take breaks',
      element: '#global-clock',
      options: {
        placement: 'right',
      },
    },
    {
      title: 'Global Clock Controls',
      content:
        'This is the controls to manage your work time, you can start, pause and resume the clock',
      element: '#global-clock-controls',
      options: {
        placement: 'bottom',
      },
    },
    {
      title: 'Todo List',
      content: 'This is the todo list, you can add, edit and delete todos',
      element: '#todo-list',
      options: {
        placement: 'bottom',
      },
    },
    {
      title: 'Todo item checkbox',
      content:
        'This is a todo item checkbox, you can complete or uncomplete a todo by clicking on it',
      element: '#todo-2-label',
    },
    {
      title: 'Todo item time',
      content: 'This is the time you have estimated to complete the todo',
      element: '#time-2',
    },
    {
      title: 'New Todo input',
      content: 'This is the input to add a new todo',
      element: '#new-todo',
    },
    {
      title: 'Add Todo button',
      content:
        'This is the button to add a new todo, you can also press enter to add a new todo',
      element: '#add-todo',
    },
    {
      title: 'The end',
      content: 'This is the end of the tour, enjoy working with this app',
      element: '#app',
    },
  ],
});

function startTour() {
  tour.start();
}

document.querySelector<HTMLButtonElement>('#start-tour-todos')!.onclick =
  startTour;
