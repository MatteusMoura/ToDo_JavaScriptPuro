// Seleção de elementos
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#eraser-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;
// titulo antigo é oque já está digitado no texto e vai para edição

// Funções
const saveTodo = (text, done = 0, save = 1) => {
  /* Text é a nota, Done é quando a tarefa está pronta ( todas começam ser estar prontas 'por isso o 0' ) porém quando eu imprimo/pego um dado que está na Local Storage, ele já pode vim pronto, então passarei esse paramêtro quando vim nesse fruxo, mas quando for o de criação ele usa o Zero, Save salva o dado na localStorage

  */
  const todo = document.createElement("div");
  todo.classList.add("todo");

  const todoTitle = document.createElement("h3");
  todoTitle.innerText = text;
  todo.appendChild(todoTitle);
  console.log(todo);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-todo");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  todo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-todo");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  todo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-todo");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  todo.appendChild(deleteBtn);

  // Utilizando dados da localStorage
  if (done) {
    todo.classList.add("done");
    // Se o usuário marcou a tarefa como feita, quando voltar da LocalStorage, adiciona a ClassList 'done'
  }

  if (save) {
    saveTodoLocalStorage({ text, done });
    //                   Texto da nota
  }

  todoList.appendChild(todo);

  todoInput.value = "";
  todoInput.focus();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  todoForm.classList.toggle("hide");
  todoList.classList.toggle("hide");
};

const updateTodo = (text) => {
  // Primeiro: Vai receber como paramêtro o novo texto criado na edição da nota

  const todos = document.querySelectorAll(".todo");
  // Segundo: Um array de toDos

  todos.forEach((todo) => {
    // Terceiro: Identificar qual toDo eu quero e editar

    let todoTitle = todo.querySelector("h3");
    // Quarto: Pegar o título do toDo atual que estou mapeando
    // Obs de programação: Primeiro seleciona o elemento, e depois a propriedade que desejada

    if (todoTitle.innerText === oldInputValue) {
      // Quinto: Comparando o título da minha interação atual se é igual o valor que eu salvei na mémoria
      todoTitle.innerText = text;
      // Sexto: Por fim ocorre a troca do toDo antigo, pelo novo toDo ( texto da nota criada pela edição )

      updateTodoLocalStorage(oldInputValue, text);
    }
  });
};

const getSearchTodos = (search) => {
  const todos = document.querySelectorAll(".todo");

  todos.forEach((todo) => {
    let todoTitle = todo.querySelector("h3").innerText.toLowerCase();
    const normalizedSearch = search.toLowerCase();
    // Para ambos ficarem em lowerCase, tanto as notas quanto oque for buscado pelo usuário

    todo.style.display = "flex";
    // Até que não se prove a nota não tenha algo no título que eu esteja procurando, todas vão estar sendo exibidas

    if (!todoTitle.includes(normalizedSearch)) {
      todo.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const todos = document.querySelectorAll(".todo");

  switch (filterValue) {
    case "all":
      todos.forEach((todo) => (todo.style.display = "flex"));
      // Fazendo com que a propriedade vire Flex, forçamos todos toDos a aparecer
      break;

    case "done":
      todos.forEach((todo) =>
        todo.classList.contains("done")
          ? (todo.style.display = "flex")
          : (todo.style.display = "none")
      );
      break;

    case "todo":
      todos.forEach(
        (todo) =>
          !todo.classList.contains("done")
            ? (todo.style.display = "flex")
            : // Se a classe !Não tem "done", é para mostrar "flex"
              (todo.style.display = "none")
        // Se a classe tem "done", não é para mostrar "none"
      );
      break;

    default:
      break;
  }
};

// Eventos
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = todoInput.value;
  try {
    if (inputValue) {
      saveTodo(inputValue);
    } else {
      throw new Error("'O campo precisa ser preenchido'");
    }
  } catch (error) {
    console.log(`O ${error} foi capturado pelo sistema`);
  } finally {
    console.log("O codigo foi executado");
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let todoTitle;

  if (parentEl && parentEl.querySelector("h3")) {
    todoTitle = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("finish-todo")) {
    parentEl.classList.toggle("done");

    updateTodosStatusLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("remove-todo")) {
    parentEl.remove();

    removeTodoLocalStorage(todoTitle);
  }

  if (targetEl.classList.contains("edit-todo")) {
    toggleForms();
    // Primeiro: Chama essa função, que vai deixar apenas o campo de edição e esconder os demais

    editInput.value = todoTitle;
    // Segundo: Mudando o valor do campo de Edit, para que seja o todoTitle (texto da nota criada)
    oldInputValue = todoTitle;
    // Terceiro: Jogo o (texto da nota criada) na varíavel oldInputValue ( que serve como banco de dados )
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();

  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const editInputValue = editInput.value;
  // Quarto: Vai ser guardado nessa varíavel o ( novo texto da nota criada na edição )

  if (editInputValue) {
    updateTodo(editInputValue);
    // Quinto: Atualizar o toDo enviando o novo texto criado na nota de edição
  }

  toggleForms();
  // Sexto: Volto a esconder o campo de Edit e mostra a página inicial do form
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  // Quando o alvo do evento é um Input, posso pegar direto dele o target e o value

  getSearchTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();

  searchInput.value = "";

  searchInput.dispatchEvent(new Event("keyup"));
  // Disprando um evento para que seja realizada a volta das notas
});

filter.addEventListener("change", (e) => {
  const filterValue = e.target.value;

  filterTodos(filterValue);
});

// Local Storage
const getTodosLocalStorage = () => {
  const todos = JSON.parse(localStorage.getItem("todos")) || [];
  // JSON para Objeto
  return todos;
};

const loadTodos = () => {
  const todos = getTodosLocalStorage();

  todos.forEach((todo) => {
    saveTodo(todo.text, todo.done, 0);
  });
};

const saveTodoLocalStorage = (todo) => {
  const todos = getTodosLocalStorage();
  // Pegar os toDos ou um Array vazio

  todos.push(todo);
  // Add o novo toDo no Arr atual com o método Push

  localStorage.setItem("todos", JSON.stringify(todos));
  // Salvar na LS, usando o método set Item e Stringify para transformar Objetivo em JSON
};

const removeTodoLocalStorage = (todoText) => {
  // Aqui está o texto da Nota
  const todos = getTodosLocalStorage();
  // Aqui está todas as notas da LocalStorage

  const filteredTodos = todos.filter((todo) => todo.text !== todoText);
  // todo.text, acessando a propriedade do objeto todo(LocalStorage), se for diferente da passado pelo paramêtro fica fora da função, e consequentemente não vai permanecer na localStorage
  // Nessa variável ficam apenas os toDos que eu quero que fiquem na localStorage

  localStorage.setItem("todos", JSON.stringify(filteredTodos));
};

const updateTodosStatusLocalStorage = (todoText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoText ? (todo.done = !todo.done) : null
  );
  //  Se o texto da nota for igual ao que está, o status do Objeto todo.done será invertido. Caso não seja essa opção Null
  // Map não retorna dados, modifica os dados originais, ent não precisa criar novas variaveis

  localStorage.setItem("todos", JSON.stringify(todos));
};

const updateTodoLocalStorage = (todoOldText, todoNewText) => {
  const todos = getTodosLocalStorage();

  todos.map((todo) =>
    todo.text === todoOldText ? (todo.text = todoNewText) : null
  // Mudando o texto da LocalStorage, caso o text da LS seja igual o antigo, vai substituir pelo novo texto que vai ser enviado pelo campo de Imput de edição
  );

  localStorage.setItem("todos", JSON.stringify(todos));
};
loadTodos();
