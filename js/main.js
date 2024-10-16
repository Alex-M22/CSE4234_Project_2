"use strict";


/*

Functions Created/Completed:

    Alex Merino:
        ALL Debugging and and variable renaming to match
        different people's code 

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
        function clearFilter();    Complete

    T'Avion Rodgers:
        const getData()             Finished

*/

function dateFilter(eventObjs, date) {
    let valid = [];
    let day = Math.floor(date.getTime() / 86400000);
    eventObjs.forEach((event) => {
        console.log(event.start)
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

    console.log(filtered)
    // If no filter was put or if filter put
    // was not in dataset return all or nothing, respectively
    if (filtered !== 0 && filtered !== 1) {
        hideEvents(filtered);
    } else if (filtered === 1) {
        hideEvents([]);
    }

}

function clearFilter() {
    // Erases the values in the date, title, and description input boxes when the clear button is clicked
    document.querySelector('#formDate').value = "";
    document.querySelector('#formTitle').value = "";
    document.querySelector('#formDesc').value = "";

    // Restores all the cards to the screen since no filters are applied
    hideEvents(eventObjs);
}

function hideEvents(filtered) {
    // Modify class name to match cards class
    // puts all cards to display as none
    let cards = document.getElementsByClassName("card");
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


// learn more button
function learnMore(button, cardid){
    // Get the parent card of the clicked button
    const card = document.getElementById(cardid);
    // get current description. if empty or is it  not empty
    const description = card.querySelector('.description');

    // Toggle display
    if (description.style.display === "none") {
        description.style.display = "block";
    } else {
        description.style.display = "none";
    }
}




// Card object creation
let eventObjs = [];
let eventsHTML = '';

let index = 0;
const getData = () => {
    return fetch('media/events.rss')
    .then(function(resp) {
        return resp.text();
    })
    .then(function(data) {
        // Provided by mozilla link in hw pdf
        let parser = new DOMParser(),
            eventsXml = parser.parseFromString(data, 'text/xml');

        // Gets list of all events, separated by 'item' tag
        let eventsEach = eventsXml.getElementsByTagName('item');
        let eventsEachXML = Array.from(eventsEach)
        eventsEachXML.forEach((event, index) =>{

            // Parse times beforehand
            let desc = event.getElementsByTagName('description')[0].textContent;
            let descriptionParsed = parser.parseFromString(desc, 'text/html');
            let sTime = descriptionParsed.getElementsByTagName('time')[0];

            // Start date string parsing
            let sDateObj = new Date(sTime.getAttribute('datetime'));
            let sFormat = {weekday: 'long', month:'long', day: 'numeric', year: 'numeric'};
            let start = sDateObj.toLocaleDateString('en-US', sFormat);

            // Times for each event
            let timeFormat = {hour: 'numeric', minute: 'numeric'};
            let time1 = sDateObj.toLocaleTimeString('en-US', timeFormat);
            let time2 = descriptionParsed.getElementsByTagName('time')[1].textContent;

            // Some enclosure tags nonexistent so conditional statement :/
            let enclosure = event.getElementsByTagName('enclosure')[0]
            let imgUrl = enclosure ? enclosure.getAttribute('url') : '../media/default_img.jpg';

            // Build html for tag
            eventsHTML +=`
                    <article class="card" id="event-${index+1}">
                       <img src="${imgUrl}" alt="${event.getElementsByTagName('title')[0].textContent}">
                       <h2>${event.getElementsByTagName('title')[0].textContent}</h2>
                       <p class="event-date">${start}</p>
                       <p class="event-loc">${event.getElementsByTagName('location')[0].textContent}</p>
                       <button class="learn-more-btn" data-index="${index}" onclick="learnMore(this, 'event-${index+1}')">Learn More</button>
                       <div class="description">
                                  <p>${event.getElementsByTagName('description')[0].textContent}</p>
                              </div>
                    </article>
                `;

            // Store as object
            let eventObj = {
                "id": `event-${index+1}`,
                "img": imgUrl,
                "title": event.getElementsByTagName('title')[0].textContent,
                "date": start,
                "location": event.getElementsByTagName('location')[0].textContent,
                "learn-more": `From ${start} ${time1} to ${time2} at ${event.getElementsByTagName('location')[0].textContent}`,
                "desc": desc,
                "start": new Date(start)
            }

            eventObjs.push(eventObj);

        })
        // Injects the articles into the html file
        let cardContainter = document.querySelector("main");
        cardContainter.innerHTML = eventsHTML;
        // Updates the count of cards showing
        updateCount(eventObjs);
        index +=1;
    })
}

getData();
