"use strict";


/*

Functions Created/Completed:

    Alex Merino:
        function dateFilter();      Finished
        function titleFilter();     Finished
        function filterEvents();    Finished
        function intersection();    Finished
        function applyFilter();     Finished
        function hideEvents();      Finished
        function updateCount();     Finished

    Scott Troi:
        function learnMore();       Need to do
    Anthony Ciero:
        function descFilter();    Complete
        function clearFilter();    Created/In Progress

    T'Avion Rodgers:


*/

function dateFilter(eventObjs, date) {
    let valid = [];
    let day = Math.floor(date.getTime() / 86400000);
    eventObjs.forEach((event) => {
        // console.log()
        if (day === Math.floor(event.start.getTime() / 86400000)) {
            valid.push(event)
        }

    });

    return valid;
}


function titleFilter(eventObjs, title) {
    // Creates array and loops through the eventObj array
    let valid = [];
    eventObjs.forEach((event) => {
        // Checks to see if the given title is in the list of titles
        if (event.title.toLowerCase().includes(title.toLowerCase())) {
            valid.push(event); // if true then add to valid
        }  
    });
    return valid; // Return
}


function descFilter(eventObjs, desc) {
    // Create empty array
    let valid = [];
    // Searches through each event
    eventObjs.forEach((event) => {
        // Checks to see if the description inoputted is in the description of any of the events
        if (event.desc.toLowerCase().includes(desc.toLowerCase())) {
            // Pushes event to array
            valid.push(event);
        }  
    });
    return valid; // Return
}


function filterEvents(eventObjs, value, filter) {
    // If no input given for search then return nothing
    if (value === "") {
        return new Set();
    }

    // Get filtered lists
    const filtered = filter(eventObjs, value);
    if (filtered.length === 0) {
        return "None";
    }
    return new Set(filtered); // Return
}




function intersection(dates, titles, descs) {
    // if not in data then return error code
    if (dates === "None" || titles === "None" || descs === "None") {
        return 1;
    // if all are empty, keep all displayed
    } else if (dates.size === 0 && titles.size === 0 && descs.size === 0) {
        return 0;
    } else if (dates.size === 0 && titles.size === 0) {
        return descs;
    } else if (descs.size === 0 && titles.size === 0) {
        return dates;
    } else if (dates.size === 0 && descs.size === 0) {
        return titles;
    } else if (dates.size === 0) { // interestion between title and desc
        return new Set([...titles].filter(x => new Set(descs).has(x)));
    } else if (titles.size === 0) {// interestion between date and desc
        return new Set([...dates].filter(x => new Set(descs).has(x)));
    } else if (descs.size === 0) {// interestion between title and date
        return new Set([...titles].filter(x => new Set(dates).has(x)));
    } else { // if all fields are filled
        let temp = new Set([...titles].filter(x => new Set(descs).has(x)));
        return new Set([...temp].filter(x => new Set(dates).has(x)));
    }
}



function applyFilter() {

    // Collects the value from the date input box and
    // formats it into a Date object
    const dateIN = document.querySelector('#formDate').value;
    let date = new Date(dateIN);
    // Checks to see if the date that was inputted is valid
    // Then checks if the input is within the range of the dataset
    if (dateIN === "") {
        date = "";
    } else if (date.toString() === "Invalid Date") {
        date = "";
    } else if (date.getFullYear() == 2001) {
        date.setFullYear(2024);
    }

    // Grab the inputs from the title and description fields
    const title = document.querySelector('#formTitle').value;
    const desc = document.querySelector('#formDesc').value;

    // Creates a dictionary of filters
    let filterObj = {
        'title' : title,
        'startDate' : date,
        'desc' : desc,

    };


    // Filter by Date
    let filteredByDate = filterEvents(eventObjs, filterObj.startDate, dateFilter);
    // Filter by Title
    let filteredByTitle = filterEvents(eventObjs, filterObj.title, titleFilter);
    // Filter by Description
    let filteredByDesc = filterEvents(eventObjs, filterObj.desc, descFilter);
    let filtered = intersection(filteredByDate, filteredByTitle, filteredByDesc);

    // If no filter was put or if filter put
    // was not in dataset return all or nothing, respectively
    if (filtered !== 0 && filtered !== 1) {
        hideEvents(filtered);
    } else if (filtered === 1) {
        hideEvents([]); 
    }

}

function clearFilter() {
    // Uses empty data to restore all cards instead of pulling from input fields
    let date;
    let title;
    let desc;
    
    // Filter by date
    let filteredByDate = filterEvents(eventObjs, "", dateFilter);
    // Filter by title
    let filteredByTitle = filterEvents(eventObjs, "", titleFilter);
    // Filter by desc
    let filteredByDesc = filterEvents(eventObjs, "", descFilter);
    
    let filtered = intersection(filteredByDate, filteredByTitle, filteredByDesc);
    console.log("Cleared the filter");
}

function hideEvents(filtered) {
    // Modify class name to match cards class
    // puts all cards to display as none
    cards = document.getElementsByClassName("cards");
    for (let i = cards.length - 1; i >= 0; i--) {
        cards[i].style.display = 'none';
    }
    // Modify css style to inline-block or whatever needed
    // sets all filtered events to be shown
    filtered.forEach((event) => {
        document.querySelector(`#${event.id}`).style.display = "block";
    });
    updateCount([...filtered]);
}


// Takes in either the eventObjs list
// or the filtered list and changes the count
function updateCount(aList) {
    document.querySelector('#showCount').innerHTML = `Showing: ${aList.length}/${eventObjs.length}`;

}



// T'Avion's

let eventObjs = [];
let count = 1;
let cards = ``;

const getData = () => {
    /*
    Note from Alex:
    Would reccomend using this function to parse from a 
    string to xml format for iteration
        window.DOMParser().parseFromString(NAME_OF_STR_VARIABLE, "text/xml")
    */

}


// Scott

// learn more button
getData();
