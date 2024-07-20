let todoList = [];
const dateTime = new Date();
const dateString = dateTime.toDateString();
const onload = () => {
  const currentDate = document.getElementById("current-date");
  currentDate.innerHTML = dateString;
  if (window.localStorage.getItem("todo") === null) {
    addNewList();
  } else {
    console.log(window.localStorage.getItem("todo"));
    todoList = JSON.parse(localStorage.getItem("todo"));
  }
  reload();
};

const clrAll = () => {
  localStorage.clear();
  location.reload();
};


const randomChars = () => {
  const Char = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n',
                'o','p','q','r','s','t','u','v','w','x','y','z','1','2',
                '3','4','5','6','7','8','9','0'];
  const ranRange = Char.length;
  let genString = "";
  for (let index = 0; index < 16; index++) {
    const ranNum = Math.floor(Math.random()*ranRange);
    genString += Char[ranNum];
  }
  return genString;
}

const idGenerate = () => {
  let generatedId = randomChars();
  const checkId = false;
  todoList.forEach(list => {
    if(list.id===generatedId) checkId=true;
  });
  if(checkId) idGenerate();
  else return generatedId;
}

const reload = () => {
  const listsView = document.getElementById("lists-view");
  let html = todoList
    .map((list) => {
      console.log(list);
      const { id, title, date, goals } = list;
      return `
        <div class="list col-m-1 col-l-1 col-xl-1">
          <div class="list-title" id=${id}">
            <input type="text" value='${title}' id=${id} onkeydown="editListTitle(this)">
            <img src="./office.png" alt="delete list" id=${id} onclick="deleteList(this.id)">
          </div>
          <div class="date">
            <input type="date" name="" id=${id} value=${date} onchange="editListDate(this)">
          </div>
          <ul class="list-goals">
            ${goals
              .map((goal) => {
                return `
                <li class=${goal.status} id=${goal.id} onclick="check(this.id)">
                  ${goal.title}
                  <img src="./close.png" alt="close" id=${goal.id} onclick="deleteGoal(this.id)">
                </li>
              `;
              })
              .join("")}
            <li class="add-goal">
              <input type="text" placeholder="+ add a goal" id='${id}a2g' onkeydown="addNewGoal('${id}',this)">
            </li>
          </ul>
        </div>
    `;
    })
    .join("");
  window.localStorage.setItem("todo", JSON.stringify(todoList));
  listsView.innerHTML = html;
};

const addNewList = () => {
  const d = new Date();
  const date = d.toISOString().split("T");
  const newId = idGenerate();
  const newTitle = "new list";
  const newDate = date[0];
  const newGoals = [];
  const newList = {
    id: newId,
    title: newTitle,
    date: newDate,
    goals: newGoals,
  };
  todoList.push(newList);
  reload();
};

const deleteList = (id) => {
  const tempLists = todoList.filter((list) => list.id !== id);
  todoList = tempLists;
  reload();
};

const editListTitle = (list) => {
  document.getElementById(list.id).addEventListener(
    "keypress",
    (event) => {
      if (event.key === "Enter") {
        const newTitle = list.value;
        todoList.forEach((todolist) => {
          if (todolist.id === list.id) todolist.title = newTitle;
        });
        reload();
      }
    },
    { once: true }
  );
};

const editListDate = (list) => {
  const listId = list.id;
  const newDate = list.value;
  todoList.forEach((todolist) => {
    if (todolist.id === listId) todolist.date = newDate;
  });
};

const addNewGoal = (listId, target) => {
  document.getElementById(target.id).addEventListener(
    "keypress",
    (event) => {
      if (event.key === "Enter") {
        const d = new Date();
        const tempdate = d
          .toLocaleString()
          .replaceAll(/[&\/\\#, +()$~%.'":*?<>{}]/g, "");
        const newTempId = listId + "-" + tempdate;
        const newTitle = target.value;
        const newStatus = "pending";
        const newGoal = {
          id: newTempId,
          title: newTitle,
          status: newStatus,
        };
        todoList.forEach((list) => {
          if (list.id === listId) list.goals.push(newGoal);
        });
        reload();
      }
    },
    { once: true }
  );
};

const deleteGoal = (goalId) => {
  const temp = goalId.split("-");
  const listId = temp[0];
  todoList.forEach((list) => {
    if (list.id === listId) {
      let tGoals = list.goals;
      let nGoals = tGoals.filter((goal) => goal.id !== goalId);
      list.goals = nGoals;
    }
  });
  reload();
};

const check = (goalId) => {
  const temp = goalId.split("-");
  const listId = temp[0];
  todoList.forEach((list) => {
    if (list.id === listId) {
      list.goals.forEach((goal) => {
        if (goal.id === goalId) {
          if (goal.status === "pending") goal.status = "done";
          else goal.status = "pending";
        }
      });
    }
  });
  reload();
};
