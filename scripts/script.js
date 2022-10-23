import { CarObject } from "./carcontrols/CarRenderer.js";
import { Splitters } from "./SplitIntegration.js";
import { Taskbar } from "./Taskbar.js";
import { UserSelect } from "./UserSelect.js";
import { FA } from "./Util.js";



// Binds the buttons
function bindButtons(){

    function onBtnClicked(evt){
        var coords = evt.target.getAttribute("pos").split(",").map(parseFloat);

        CarObject.moveTo(...coords);
    }

    // Binds the events
    for(var btn of FA(".buttonPersp"))
        btn.onclick = onBtnClicked;
}

window.onload = async() => {
    // Awaits until the car has loaded
    await CarObject.initCarRender();
    
    UserSelect.init();

    Splitters.initSplitters();

    // Starts the taskbar refresher
    Taskbar.initTaskbar();

    // Fires the first resize callback to update everything
    CarObject.resizeScene();

    // Binds the button events
    bindButtons();

    // Appends for every window-resize
    window.onresize = CarObject.resizeScene;
};