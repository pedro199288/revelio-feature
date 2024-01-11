import { Revelio } from 'revelio-feature';

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
      element: '#todo-list-container',
      options: {
        placement: 'bottom',
      },
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
        requireClickToGoNext: true,
        showNextBtn: false,
        onNextBefore: function () {
          const itemsAmount =
            document.querySelector<HTMLUListElement>('#todo-list')!.children
              .length;
          const newTodoNumber = itemsAmount + 1;
          this.addStep(
            {
              title: 'New todo',
              content: `New step added showing the new created todo ${newTodoNumber}`,
              element: `#todo-${newTodoNumber}`,
              options: {
                onEndAfter: function () {
                  this.resetJourney();
                },
                onPrevAfterUnmountStep: function () {
                  this.resetJourney();
                },
              },
            },
            this.currentIndex + 1,
          );
        },
      },
    },
    {
      title: 'Scroll to top',
      content: 'This is the button to scroll to the top of the page',
      element: '#scroll-to-top-btn',
    },
    {
      title: 'The end',
      content: 'This is the end of the tour, enjoy working with this app',
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
     id="time-${id}"
     placeholder="00:25:00"
     type="text"
   />
   `;

  return todoItem;
}

function addTodo() {
  const todoInput =
    document.querySelector<HTMLInputElement>('#new-todo-input')!;
  const todoList = document.querySelector<HTMLUListElement>('#todo-list')!;
  const itemsAmount = todoList.children.length;
  const todoItem = createTodo(todoInput.value, itemsAmount + 1);
  todoList.appendChild(todoItem);
  todoInput.value = '';
  todoInput.focus();
}

document
  .querySelector<HTMLButtonElement>('#add-todo-form')!
  .addEventListener('submit', (e) => {
    e.preventDefault();
    addTodo();
  });

// Add initial todos
const initialTodos = Array.from({ length: 50 }, (_, i) => `Todo ${i + 1}`);
initialTodos.forEach((todo, index) => {
  const todoItem = createTodo(todo, index + 1);
  document.querySelector<HTMLUListElement>('#todo-list')!.appendChild(todoItem);
});
