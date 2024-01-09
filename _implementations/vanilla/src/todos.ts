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
      element: '#todo-1-label',
      options: {
        placement: 'left',
      },
    },
    {
      title: 'Todo item time',
      content: 'This is the time you have estimated to complete the todo',
      element: '#time-1',
    },
    {
      title: 'New Todo input',
      content: 'This is the input to add a new todo',
      element: '#new-todo-input',
    },
    {
      title: 'Add Todo button',
      content:
        'This is the button to add a new todo, you can also press enter to add a new todo',
      element: '#add-todo-btn',
      options: {
        goNextOnClick: true,
        showNextBtn: false,
      },
    },
    {
      title: 'New todo',
      content: 'This is the new todo you have just added',
      element: '.todo:last-child',
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

function createTodo(title: string, id: number): HTMLLIElement {
  const todoItem = document.createElement('li');
  todoItem.classList.add(
    ...'todo flex items-center justify-between p-4 bg-white rounded-lg shadow-sm'.split(
      ' ',
    ),
  );
  todoItem.id = `todo-${id}`;
  todoItem.innerHTML = `
   <div class="flex items-center gap-4 group">
     <label
       for="todo-${id}-checkbox"
       class="cursor-pointer"
     >
       <input
         type="checkbox"
         role="checkbox"
         aria-checked="false"
         value="on"
         class="hidden h-4 w-4 shrink-0 rounded-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
         id="todo-${id}-checkbox"
       />
       <svg
         xmlns="http:www.w3.org/2000/svg"
         width="24"
         height="24"
         viewBox="0 0 24 24"
         stroke-linecap="round"
         stroke-linejoin="round"
         class="h-6 w-6 stroke-slate-500 stroke-2 fill-none"
       >
         <rect width="18" height="18" x="3" y="3" rx="2"></rect>
         <path
           class="invisible group-has-[:checked]:visible"
           d="M9 12l2 2 4-4"
         ></path>
       </svg>
     </label>
     <span class="text-lg font-medium text-gray-900">
       ${title}
     </span>
   </div>
   <input
     class="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-32"
     id="time-2"
     placeholder="00:25:00"
     type="text"
   />
   `;

  return todoItem;
}

function addTodo() {
  setTimeout(() => {
    const todoInput =
      document.querySelector<HTMLInputElement>('#new-todo-input')!;
    const todoList = document.querySelector<HTMLUListElement>('#todo-list')!;
    const itemsAmount = todoList.children.length;
    const todoItem = createTodo(todoInput.value, itemsAmount + 1);
    todoList.appendChild(todoItem);
    todoInput.value = '';
    todoInput.focus();
  }, 4900);
}

document
  .querySelector<HTMLButtonElement>('#add-todo-form')!
  .addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
  });
