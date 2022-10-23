// This file handles the taskbar update stuff

import { TIMEZONE_OFFSET } from "./Settings.js";
import { F } from "./Util.js";


// Returns an array with the current time [0] and date [1]
function getCurrentTimeAndDate(){


}

// Starts the timer that refreshes the displaytime and date every second
function startTimeAndDateRefresher(){

    // HTML-Elements that hold the time and date
    const timeDisp = F("#dateTime");

    // Names of the day's and month's
    const DAY_NAMES = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    const MONTH_NAMES = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

    const makeLeading = x=>x.length <= 1 ? ("0"+x) : x;

    function updateTime() {
        // Gets the current date with the given timezone-offset (Please just ignore this hacky solution)
        var date = new Date(new Date(new Date().getTime() + TIMEZONE_OFFSET * 3600 * 1000).toUTCString().replace( / GMT$/, "" ));
    
        // Formats and updates the value
        timeDisp.textContent = `${DAY_NAMES[date.getDay()]}, ${date.getDate()}. ${MONTH_NAMES[date.getMonth()]} - ${makeLeading(date.getHours().toString())}:${makeLeading(date.getMinutes().toString())}`;
    }

    // Start the timeout
    setInterval(updateTime, 1000);
    updateTime();
}

// Initalizes the taskbar
function initTaskbar(){
    // Starts the time/date refresher
    startTimeAndDateRefresher();
}

export const Taskbar = {
    initTaskbar
}