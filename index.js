let myLeads =  []
const parent = document.getElementById("container");
const inputEl = document.getElementById("input-el");
const saver = document.getElementById("save-btn");
const date = document.getElementById("date-el")
const inputs = document.getElementById("inputs");

const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

if(leadsFromLocalStorage){ //Rendering the data and display from before the refresh
    myLeads = leadsFromLocalStorage;
    for (let i = 0; i < myLeads.length; i++) {

        render(myLeads[i].text, myLeads[i].due, i);
        const divs = document.querySelectorAll(".childClass");

        if(myLeads[i].status === "Done"){divs[i].style.background = "#70DA25";}
        else if(myLeads[i].status === "In Progress"){divs[i].style.background = "#FFEA00";}
        else if(myLeads[i].status === "Not Started"){divs[i].style.background = "#EE1411";}
      }      
}

inputs.addEventListener("keydown", function(event){
    if(event.key == "Enter"){
        event.preventDefault();
        save();
    }
})

function save(){
    if(inputEl.value != "" && date.value != ""){
        let newActivity = {
            text: inputEl.value,
            due: date.value,
            status: null}

        myLeads.push(newActivity);
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
        render(inputEl.value, date.value, myLeads.length -1)
        inputEl.value = ""
        date.value = ""
    }
    else if(inputEl.value == "" && date.value == ""){
        document.getElementById("error-msg").style.display = "block";
        document.body.classList.add('shake-effect');

        setTimeout(function() {
            document.body.classList.remove('shake-effect');
        }, 500); 
        setTimeout(function() {
            document.getElementById("error-msg").style.display = "none";
        }, 750); 
    }
    else if(date.value == ""){
        document.getElementById("error-msg-dat").style.display = "block";
        document.body.classList.add('shake-effect');

        setTimeout(function() {
            document.body.classList.remove('shake-effect');
        }, 500); 
        setTimeout(function() {
            document.getElementById("error-msg-dat").style.display = "none";
        }, 750); 
    }
    else{
        document.getElementById("error-msg-act").style.display = "block";
        document.body.classList.add('shake-effect');

        setTimeout(function() {
            document.body.classList.remove('shake-effect');
        }, 500); 
        setTimeout(function() {
            document.getElementById("error-msg-act").style.display = "none";
        }, 750); 
    }
}

function reset(){
    parent.innerHTML = "";
    myLeads = []
    localStorage.clear();
}
//displays the activity entered
function render(word, date, index) {
    const child = document.createElement('div');
    //icons
    const activityText = document.createElement('div');
    const dateText = document.createElement('div');

    const dueLabel = document.createElement("span");
    const dueValue = document.createElement("span");


    const trash = document.createElement('img')
    const edit = document.createElement('img')
    const calendar = document.createElement('img')

    trash.className = "trashClass";
    edit.className = "editClass";
    calendar.className = "dateClass";

    trash.src = "trash.png";
    edit.src = "edit.png";
    calendar.src = "calendar.png"

    child.className = 'childClass';
    dateText.className = 'dateText';
    activityText.className = 'activityText';

    activityText.textContent = word;

    dueLabel.className = "dueLabel";
    dueLabel.textContent = "Due: ";
    dueLabel.contentEditable = "false";

    dueValue.className = "dueValue";
    dueValue.textContent = date;

    dateText.appendChild(dueLabel);
    dateText.appendChild(dueValue);

    child.dataset.index = index;

    parent.appendChild(child);

    child.appendChild(trash);
    child.appendChild(edit);
    child.appendChild(calendar);

    child.appendChild(activityText);
    child.appendChild(dateText);

    startCountdownForCard(child, date);
}

document.addEventListener("click", function (e) { //Event listener for childClass
    const pick = e.target;

    if (pick.classList.contains("trashClass")){ //Deletes specific activities
        const p_Node = pick.parentNode; 
        p_Node.remove();
        console.log(p_Node.dataset.index);
        const index = p_Node.dataset.index;
        myLeads.splice(index,1);
        localStorage.setItem("myLeads", JSON.stringify(myLeads));

    }
    if (pick.classList.contains("editClass")) {
        const clicked = pick.parentNode;
        const activityText = clicked.querySelector(".activityText");

        const i = clicked.dataset.index;
    
        activityText.contentEditable = true;
        activityText.classList.add("editable");
        activityText.focus();
    
        activityText.addEventListener("keydown", function(event){
            if(event.key === "Enter"){
                activityText.contentEditable = false;
                event.preventDefault();
                clicked.blur(); // triggers blur listener below
            }
        });
    
        activityText.addEventListener("blur", function () {
            activityText.contentEditable = false;
            activityText.classList.remove("editable");
    
            const newText = activityText.textContent.trim("Due: ");
            myLeads[i].text = newText;
            localStorage.setItem("myLeads", JSON.stringify(myLeads));
        }, { once: true });
    }
    if (pick.classList.contains("dateClass")) {
        const clicked = pick.parentNode;
        const i = clicked.dataset.index;
        const dateText = clicked.querySelector(".dueValue");

        dateText.contentEditable = true;
        dateText.classList.add("editable");
        dateText.focus();
    
        dateText.addEventListener("keydown", function(event){
            if(event.key === "Enter"){
                dateText.contentEditable = false;
                event.preventDefault();
                clicked.blur(); // triggers blur listener below
            }
        });
    
        dateText.addEventListener("blur", function () {
            dateText.contentEditable = false;
            dateText.classList.remove("editable");
    
            const newDate = dateText.textContent.trim();
            myLeads[i].due = newDate;
            localStorage.setItem("myLeads", JSON.stringify(myLeads));
        }, { once: true });
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

function endOfDayLocal(yyyy_mm_dd) {
    const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
    return new Date(y, m - 1, d, 23, 59, 59, 999); // local time end of day
}

function formatRemaining(ms) {
    if (ms <= 0) return "Past due";
  
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
  
    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    return `${hours}h ${mins}m ${secs}s`;
  }

  function startCountdownForCard(cardEl, dueDateStr) {
    const dueValue = cardEl.querySelector(".dueValue"); // where countdown text goes
    if (!dueValue) return;
    const dueEnd = endOfDayLocal(dueDateStr);
  
    const tick = () => {
      const msLeft = dueEnd - new Date();
      dueValue.textContent = `${formatRemaining(msLeft)}`;
    };
  
    tick(); 
    cardEl._countdownId = setInterval(tick, 1000);
  }
  
  



