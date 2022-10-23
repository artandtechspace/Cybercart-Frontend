import { IS_DEBUGGING } from "./Settings.js";

function initSplitters(){
   
   // Inits the options/map split view
   Split(['#optionSpacer', '#options'],{
       direction: 'vertical',
       minSize: 50,
       snapOffset: 50
   });
   
   // Adds a children to every gutter
   // This is used to spread the area that the gutter can be dragged
   // from without making a bigger gutter. Useful for touch-screen devices
   for(var gutter of document.querySelectorAll(".gutter")){
       gutter.appendChild(document.createElement("div"));
   
       // Appends a debugging class if debugging is enabled
       if(IS_DEBUGGING)
           gutter.classList.add("debug");
   }
}


export const Splitters = {
    initSplitters
};