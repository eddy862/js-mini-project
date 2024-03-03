let ToDoList = JSON.parse(localStorage.getItem('todolist')) || [];

let editWinOpen = false;
let addWinOpen = false;

let editIndex;

renderTodolist();
renderCheckBox();

function add_ToDo() {
  const inputName = document.querySelector('.todo-input');
  const inputDate = document.querySelector('.input-date');
  
  if (inputName.value.trim().length!=0 && inputName.value && inputDate.value) {
    ToDoList.push({
      name: inputName.value,
      date: inputDate.value,
      checkStatus : false,
    });

    inputName.value = '';
    inputDate.value = '';

    localStorage.setItem('todolist', JSON.stringify(ToDoList));

    renderTodolist();
    renderCheckBox();
  }  
}

function groupListsByDate(lists) {
  const groupedLists = {};

  lists.forEach(list => {
    const date = list.date;
    //check if object already has a property with the date, if not, create an empty array
    if (!groupedLists[date]) {
      groupedLists[date] = [];
    }
    groupedLists[date].push(list);
  });

  return groupedLists;
}

function renderTodolist() {
  let todolistHTML = '';

  if (ToDoList.length === 0) {
    todolistHTML = 'No Listing...';
    document.querySelector('.todolist').style.color = 'grey';
  } else {
    document.querySelector('.todolist').style.color = 'black';
  }

  //make sure the list sorted with date in ascending order
  ToDoList.sort((a, b)=> new Date(a.date) - new Date(b.date));

  const groupedListsByDate = groupListsByDate(ToDoList);

  for (const date in groupedListsByDate) {
    todolistHTML += `<div class='list-date'>${date}</div>`;
    groupedListsByDate[date].forEach(list => {
      todolistHTML += `<div class='list-item'> 
          <label class='list-checkbox'>
            <input class='checkbox-input' type='checkbox'>
            <span class='checkmark'></span>
          </label>
          <div class='list-name'>
            <div>${list.name}</div>
            <div class='expiry-display'>&#9888 This is expired</div>
          </div>
          <button class='delete-button'>
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24">
              <path d="M 10.806641 2 C 10.289641 2 9.7956875 2.2043125 9.4296875 2.5703125 L 9 3 L 4 3 A 1.0001 1.0001 0 1 0 4 5 L 20 5 A 1.0001 1.0001 0 1 0 20 3 L 15 3 L 14.570312 2.5703125 C 14.205312 2.2043125 13.710359 2 13.193359 2 L 10.806641 2 z M 4.3652344 7 L 5.8925781 20.263672 C 6.0245781 21.253672 6.877 22 7.875 22 L 16.123047 22 C 17.121047 22 17.974422 21.254859 18.107422 20.255859 L 19.634766 7 L 4.3652344 7 z"></path>
            </svg>
          </button>
          <button class='edit-button'>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA/klEQVR4nO2WQQrCMBBF39aNRfA2QvU6eoEs7Up6AY9Rj6BbF269g54iEkhBpI3aopmBeZBVKbw/kxkChmFIogJqFMv7eGrN8l5biKpDXlUIlwhgIf6J09KJ1Kp00kN8sipdIsAWJavSaZD/JoRYeR9Plfi375sYeS9lQMfIe2khhsh7KSHGyHsNA2vyv8AqnwurfC6s8rmobM9nZAqUQDOgC1mfxF0cNMsHVprlA3PpD7OWHVDQzQRY9MyEmMrfgHMiREsjUX7+JPUuRClNPrB8uRapEIU0+cCm425fgBlK2PdsFzUhTj0B7nE7iecKHGMn1nEmwmAbhmEYtDwAfHuD7urk16QAAAAASUVORK5CYII=">
          </button>
        </div>`
    })
  }


  document.querySelector('.todolist').innerHTML = todolistHTML;

  handleDeleteButton();
  handleCheckBox();
  handleEditButton();
  checkExpired();
}

function renderCheckBox() {
  ToDoList.forEach((list, index) => {
    if (list.checkStatus === true) {
      document.querySelectorAll('.checkmark')[index].style.backgroundColor = 'rgb(23, 217, 169)';
      document.querySelectorAll('.list-name')[index].firstElementChild.style.textDecoration = 'line-through';
    } else {
      document.querySelectorAll('.checkmark')[index].style.backgroundColor = 'white';
      document.querySelectorAll('.list-name')[index].firstElementChild.style.textDecoration = 'none';
    }
  })
}

function handleCheckBox() {
  document.querySelectorAll('.checkbox-input').forEach((checkbox, index) => {
    checkbox.addEventListener('change', ()=> {
      if (ToDoList[index].checkStatus === false) {
        ToDoList[index].checkStatus = true;
      } else {
        ToDoList[index].checkStatus = false;
      }
      localStorage.setItem('todolist', JSON.stringify(ToDoList));

      renderCheckBox();
    })
  });
}

function handleDeleteButton() {
  document.querySelectorAll('.delete-button').forEach((deleteButton, index)=>{
    deleteButton.addEventListener('click', ()=>{
      ToDoList.splice(index, 1);
      localStorage.setItem('todolist', JSON.stringify(ToDoList));

      renderTodolist();
      renderCheckBox();
    });
  });
}

function handleEditButton() {
  document.querySelectorAll('.edit-button').forEach((editButton, index)=>{
    editButton.addEventListener('click',()=>{
      showEditWindow();
      
      const inputName = document.querySelector('.edit-todo-input');
      const inputDate = document.querySelector('.edit-input-date');

      inputDate.value = ToDoList[index].date;
      inputName.value = ToDoList[index].name;

      editIndex = index;
    })
  })
}

document.querySelector('.edit-save-button').addEventListener('click', ()=>{
  const inputDate = document.querySelector('.edit-input-date');
  const inputName = document.querySelector('.edit-todo-input');

  if (inputName.value.trim().length!=0 && inputName.value && inputDate.value) {
    ToDoList[editIndex].name = inputName.value;
    ToDoList[editIndex].date = inputDate.value;

    localStorage.setItem('todolist', JSON.stringify(ToDoList));
  
    renderTodolist();
    renderCheckBox();
    showEditWindow();
  }
})

function showEditWindow() {
  const win = document.querySelector('.js-edit-window');
  if(editWinOpen) {
    editWinOpen = false;
    win.style.display = 'none';
  } else if (!addWinOpen) {
    editWinOpen = true;
    win.style.display = 'flex';
  }
}

function showAddWindow() {
  const win = document.querySelector('.js-add-window');
  if (addWinOpen) {
    win.style.display = 'none';
    addWinOpen = false;
  } else if (!editWinOpen) {
    win.style.display = 'flex';
    addWinOpen = true;

    document.querySelector('.todo-input').value = '';
    document.querySelector('.input-date').value = '';
  }
}

function checkExpired() {
  document.querySelectorAll('.expiry-display').forEach((date, index)=>{
    if (new Date(ToDoList[index].date) < new Date()) {
      date.style.display = 'block';
    } else {
      date.style.display = 'none';
    }
  })
}

document.querySelector('.add-nav').addEventListener('click', showAddWindow);
document.querySelector('.add-button').addEventListener('click', ()=> {
  add_ToDo();
  showAddWindow();
});
document.querySelector('.cancel-button').addEventListener('click', showAddWindow);
document.querySelector('.edit-cancel-button').addEventListener('click', showEditWindow);