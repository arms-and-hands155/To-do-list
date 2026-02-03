let myLeads =  []
const parent = document.getElementById("container");
const inputEl = document.getElementById("input-el");
const saver = document.getElementById("save-btn");

const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

if(leadsFromLocalStorage){ //Rendering the data and display from before the refresh
    myLeads = leadsFromLocalStorage;
    for (let i = 0; i < myLeads.length; i++) {
        render(myLeads[i].text, i);
        const divs = document.querySelectorAll(".childClass");

        if(myLeads[i].status === "Done"){divs[i].style.background = "#70DA25";}
        else if(myLeads[i].status === "In Progress"){divs[i].style.background = "#FFEA00";}
        else if(myLeads[i].status === "Not Started"){divs[i].style.background = "#EE1411";}
      }      
}

inputEl.addEventListener("keydown", function(event){
    if(event.key == "Enter"){
        event.preventDefault();
        save();
    }
})

function save(){
    let newActivity = {
        text: inputEl.value,
        status: null
    };
    myLeads.push(newActivity);
    localStorage.setItem("myLeads", JSON.stringify(myLeads))

    if(inputEl.value != ""){
        render(inputEl.value, myLeads.length -1)
    }
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
    myLeads = []
    localStorage.clear();
}
//displays the activity entered
function render(word, index) {
    const child = document.createElement('div');
    const trash = document.createElement('img')
    const edit = document.createElement('img')

    trash.className = "trashClass";
    edit.className = "editClass";

    trash.src = "trash.png";
    edit.src = "edit.png";

    child.className = 'childClass';
    child.textContent = word;
    child.dataset.index = index;

    parent.appendChild(child);
    child.appendChild(trash);
    child.appendChild(edit);
}

document.addEventListener("click", function (e) { //Event listener for childClass
    const pick = e.target;

    if (pick.classList.contains("trashClass")){ //Deletes specific activities
        const p_Node = pick.parentNode; 
        p_Node.remove();
    }
    if (pick.classList.contains("editClass")){ //Allows to edit text
            document.querySelectorAll(".childClass").forEach(child => {
                child.addEventListener("click", function(event){
                    const clicked = event.currentTarget;
                    const i = clicked.dataset.index;
                    clicked.contentEditable = true;
                    clicked.classList.add('editable');
                    clicked.focus();

                clicked.addEventListener("keydown", function(event){
                    if(event.key == "Enter"){
                        event.preventDefault();
                        clicked.contentEditable = false;
                        clicked.classList.remove('editable');
                        clicked.blur();
                    }
                },{ once: true });

                clicked.addEventListener("blur", function () {
                    clicked.contentEditable = "false";
                    clicked.classList.remove("editable");
            
                    const newText = clicked.textContent.trim();
                    myLeads[i].text = newText;
                    localStorage.setItem("myLeads", JSON.stringify(myLeads));
                  }, { once: true });

                })
                
            })
    }
})


const customMenu = document.getElementById('customMenu');
let current = null;

// Right-click on a childClass
document.addEventListener("contextmenu", function(e){
    const pick = e.target;
    if (pick.classList.contains("childClass")) {
        e.preventDefault();
        current = pick; // store the clicked element
        customMenu.style.top = `${e.clientY}px`;
        customMenu.style.left = `${e.clientX}px`;
        customMenu.style.display = 'block';
    }
});

document.addEventListener('click', (e) => {
    if (!customMenu.contains(e.target)) {
        customMenu.style.display = 'none';
    }
});

// Menu item clicks
const menuOptions = customMenu.querySelectorAll('li');

menuOptions.forEach(option => {
    option.addEventListener('click', (e) => {
        const optionText = option.textContent.trim();

        i = current.dataset.index;

        if (!current) return; // safety check

        if(optionText === "Done"){
            current.style.background = "#70DA25";
            myLeads[i].status = "Done";}
        else if(optionText === "In Progress"){
            current.style.background = "#FFEA00";
            myLeads[i].status = "In Progress";}
        else if(optionText === "Not Started"){
            current.style.background = "#EE1411";
            myLeads[i].status = "Not Started";
        }

        localStorage.setItem("myLeads", JSON.stringify(myLeads));
        customMenu.style.display = 'none'; // hide menu after selection
    });
});



