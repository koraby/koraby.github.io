const checkList = document.querySelector("#checkList")
const addButton = document.querySelector("#addButton")
const addListInput = document.querySelector("#input")
let now = new Date();
let year = now.getFullYear();
let month = (now.getMonth() + 1).toString().padStart(2, "0");
let date = now.getDate().toString().padStart(2, "0");
const nowDate = `\tComplete time:${year}-${month}-${date}`

addButton.addEventListener("click",()=>{
    const index = Date.now();
    appendList(addListInput.value,checkState=false,index)
    addListInput.value = ""
    storageNewList()
})

window.onload = function () {
    const todoData = getTodoFromStorage();
    todoData.forEach((todo) => {
        appendList(todo.input, todo.checkBox,todo.index);
    });
};

function appendList(inputText,checkState,index){
    const listItem = document.createElement("div");
    listItem.setAttribute("class","input-group mb-3 border p-3 ListItem")

    const checkBoxDiv = document.createElement("div")
    checkBoxDiv.setAttribute("class","input-group-text")

    const checkBox = document.createElement("input")
    checkBox.classList.add("form-check-input", "mt-0", "checkBoxClass");
    checkBox.type = "checkbox"
    checkBox.setAttribute("aria-label", "Checkbox for following text input")
    checkBox.checked = checkState

    const input = document.createElement("input")
    input.classList.add("form-control", "inputClass")
    input.type = "text"
    input.setAttribute("aria-label", "Text input with checkbox")
    input.value = `${inputText}`
    input.disabled  = true
    
    checkBox.addEventListener("change", function () {
        if (checkBox.checked) {
            input.value += nowDate
            editButton.style.display = "none"
            saveButton.style.display = "none"
            input.disabled  = true
            updateCheckState(index, true );
        } else {
            input.value = input.value.substring(0, input.value.length - 25); 
            editButton.style.display = "block"
            updateCheckState(index, false);
        }
    });
    
    const editButton = document.createElement('button')
    editButton.setAttribute("class","btn btn-warning list-button")
    editButton.textContent = 'Edit'
    if(checkState){
        editButton.style.display = "none"
    }
    editButton.addEventListener("click",()=>{
        saveButton.style.display = "block"
        editButton.style.display = "none"
        input.disabled = false
    })

    const saveButton = document.createElement('button')
    saveButton.setAttribute("class","btn btn-success list-button")
    saveButton.setAttribute("style","display: none;")
    saveButton.textContent = 'Save'
    saveButton.addEventListener("click",()=>{
        editButton.style.display = "block"
        saveButton.style.display = "none"
        input.disabled  = true
        updateEditText(index,input.value);
    })

    const deleteButton = document.createElement('button');
    deleteButton.setAttribute("class","btn btn-danger list-button")
    deleteButton.textContent = 'Remove';
    deleteButton.addEventListener('click', function () {
        listItem.remove()
        removeFromLocalStorage(inputText)
    });

        checkBoxDiv.appendChild(checkBox)
        listItem.appendChild(checkBoxDiv)
        listItem.appendChild(input)
        listItem.appendChild(editButton)
        listItem.appendChild(saveButton)
        listItem.appendChild(deleteButton)
        checkList.appendChild(listItem)

}

function saveToLocalStorage(todoList){
    localStorage.setItem('todoKey', JSON.stringify(todoList))
}

function getTodoFromStorage(){
    const todoData =JSON.parse(localStorage.getItem('todoKey'))
    return Array.isArray(todoData) ? todoData : [];
}

function removeFromLocalStorage(inputText) {
    const todoData = getTodoFromStorage();
    const updatedTodoData = todoData.filter(todo => todo.input !== inputText);
    localStorage.setItem('todoKey', JSON.stringify(updatedTodoData));
}

function updateCheckState(index,checkState) {
    const todoData = getTodoFromStorage();
    const updatedTodoData = todoData.map(todo => {
        if (todo.index === index) {
            let updatedInput = checkState ? todo.input + nowDate : todo.input.substring(0, todo.input.length - 25);
            return { ...todo, checkBox: checkState, input: updatedInput };
        }
        return todo;
    });
    localStorage.setItem('todoKey', JSON.stringify(updatedTodoData));
}

function updateEditText(index, newContent) {
    const todoData = getTodoFromStorage();
    const updatedTodoData = todoData.map(todo => {
        if (todo.index === index) {
            return { ...todo, input: newContent };
        }
        return todo;
    });
    localStorage.setItem('todoKey', JSON.stringify(updatedTodoData));
}

function storageNewList(){
    const newCheckbox = document.querySelector('.ListItem:last-of-type .checkBoxClass').checked
    const newEventInput = document.querySelector('.ListItem:last-of-type .inputClass').value
    const index = Date.now();
    let storageData = getTodoFromStorage()
    let newToDo = {
        "index":index,
        "input": newEventInput,
        "checkBox": newCheckbox
    }   
    storageData.push(newToDo)
    saveToLocalStorage(storageData)
}
