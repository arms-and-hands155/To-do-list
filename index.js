let myLeads = [];
const parent = document.getElementById("container");

const inputEl = document.getElementById("input-el");

function save(){
    myLeads.push(inputEl.value)
    render(inputEl.value)
    inputEl.value = ""
}

function render(word){

    const child = document.createElement('div');

    child.className='childClass';
    child.textContent += word;
    parent.appendChild(child);
}

