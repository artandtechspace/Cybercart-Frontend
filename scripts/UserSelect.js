// Reference to the dom-binding

import { F } from "./Util.js";
import { USERS } from "./Settings.js";

// Will be set after init got called
var dbCloseBtn, dbOverlay, dbUserList, dbUserPreview;

/**
 * Binds the users to the ui
 */
function bindUsersToUi(){
    // Clears
    dbUserList.innerHTML = "";

    // Adds the objects
    for(var id in USERS){
        var elm = document.createElement("li");
        elm.textContent = USERS[id];
        elm.dataset.id = id;

        if(dbUserPreview.dataset.id === id)
            elm.classList.add("selected");

        elm.onclick = evt=>onUserSelected(evt.target.dataset.id);

        dbUserList.appendChild(elm);
    }
}

// Inits the user-selection
function init(){
    // Finds the bindings
    dbOverlay = F("#userSelectOverlay");
    dbCloseBtn = F(".closeBtn", dbOverlay);
    dbUserList = F("ul", dbOverlay);
    dbUserPreview = F("#user");

    // Binds the events
    dbUserPreview.onclick=open;
    dbCloseBtn.onclick = close;
    dbOverlay.onclick = evt=>{
        if(evt.target === dbOverlay)
            close();
    }
    

    // Selects the first users by default
    onUserSelected(Object.keys(USERS)[0]);
}

// Event: When the user selects an account
function onUserSelected(id){
    // Gets the username
    var uname = USERS[id];

    // Updates the preview
    dbUserPreview.textContent = uname;
    dbUserPreview.dataset.id = id;

    close();
}

// Opens the user-selection
function open(){
    bindUsersToUi();
    dbOverlay.classList.add("open");
}

// Closes the user-selection
function close(){
    dbOverlay.classList.remove("open");
}

export const UserSelect = {
    init,
    close,
    open
}