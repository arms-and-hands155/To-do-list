let myLeads = [];
const parent = document.getElementById("container");
const inputEl = document.getElementById("input-el");


function save(){
    myLeads.push(inputEl.value)
    if(inputEl.value != ""){
        render(inputEl.value)}
    else{
        document.body.classList.add('shake-effect');

        setTimeout(function() {
            document.body.classList.remove('shake-effect');
        }, 500); 
    }
    inputEl.value = ""
}

function reset(){
    parent.innerHTML = "";
}
//displays the activity entered
function render(word) {
    const child = document.createElement('div');
    const trash = document.createElement('img')
    const edit = document.createElement('img')

    trash.className = "trashClass";
    edit.className = "editClass";

    trash.src = "trash.png";
    edit.src = "edit.png";

    child.className = 'childClass';
    child.textContent = word;

    parent.appendChild(child);
    child.appendChild(trash);
    child.appendChild(edit);
}

document.addEventListener("click", function (e) {
    if (e.target.classList.contains("childClass")) {
        e.target.style.background = "red";
    }
    //removes cells that if trash is clicked
    if (e.target.classList.contains("imgClass")){ 
        const p_Node = e.target.parentNode; 
        p_Node.remove();
    }
});