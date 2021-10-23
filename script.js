const ipAdress_elem = document.querySelector("#ipAddress");
const location_elem = document.getElementById("location");
const timeZone_elem = document.getElementById("timeZone");
const isp_elem = document.getElementById("isp");

const form = document.querySelector("form");
const input_elem = form.elements["ip"];

const IP_REQUIRED = "Please enter a IP Address";
const IP_INVALID = "Please enter a correct IP address format";

// -------- LOAD MAP Tiles -------- //
var mymap = L.map("mapid");

L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
            "pk.eyJ1IjoibW9uZGFyYSIsImEiOiJja3YzYmo2b3EwazIwMzFvNjBkZjc0eTVwIn0.cDRmKTJazPXQPRi46X-UfA",
    }
).addTo(mymap);

// -------- LOAD IP IN INFO -------- //
function handleData({ ip, location, isp }) {
    console.log(ip, location, isp);
    console.log(location.lat, location.lng);

    ipAdress_elem.innerText = ip;
    location_elem.innerText = `${location.city}, ${location.country}`;
    timeZone_elem.innerText = `UTC${location.timezone}`;
    isp_elem.innerText = isp;

    mymap.setView([location.lat, location.lng], 14);
    const marker = L.marker([location.lat,  location.lng]).addTo(mymap);
    marker.bindPopup(`<b>Hey Look, Its You!</b><br><b>Lat:</b> ${location.lat}, <b>Lng:</b> ${location.lng}.`).openPopup();

}


// -------- FETCH IP -------- //

function fetchIP(ip = "") {
    if (ip) {
        fetch(
            `https://geo.ipify.org/api/v2/country,city?apiKey=at_fz3e43ym5SC8fMxsDzwHC6PxBLzab&ipAddress=${ip}`
        )
            .then((response) => response.json())
            .then(handleData);
    } else {

        fetch(
            "https://geo.ipify.org/api/v2/country,city?apiKey=at_fz3e43ym5SC8fMxsDzwHC6PxBLzab"
        )
            .then((response) => response.json())
            .then(handleData);
    }
}


// -------- FORM VALIDATION -------- //

// show a message with a type of the input
function showMessage(input, message, type) {
    // get the small element and set the message
    const msg = form.querySelector("small");
    msg.innerText = message;
    // update the class for the input
    form.classList.add(type ? "success" : "error");
    form.classList.remove(!type ? "success" : "error");
    return type;
}

function showError(input, message) {
    return showMessage(input, message, false);
}

function showSuccess(input) {
    return showMessage(input, "", true);
}

function hasValue(input, message) {
    if (input.value.trim() === "") {
        return showError(input, message);
    }
    return showSuccess(input);
}

function validateIP(input, requiredMsg, invalidMsg) {
    // check if the value is not empty
    if (!hasValue(input, requiredMsg)) {
        return false;
    }
    // validate ip format
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

    const ip = input.value.trim();
    if (!ipRegex.test(ip)) {
        return showError(input, invalidMsg);
    }
    return true;
}


// -------- FORM SUBMISION EVEN LISTERNER -------- //
form.addEventListener("submit", (e) => {
    // stop form submission
    e.preventDefault();

    // validate the form
    let ipValid = validateIP(input_elem, IP_REQUIRED, IP_INVALID);
    // if valid, submit the form.
    if (ipValid) {
        fetchIP(input_elem.value);
    }
});

fetchIP()

