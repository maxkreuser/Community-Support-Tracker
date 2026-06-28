const eventForm = document.getElementById("event-signup-form");

let signupRecord = {};

let eventSignups =
    JSON.parse(localStorage.getItem("eventSignups")) || [];

function validateEventSignup(eventName, representativeName, representativeEmail, role) {
    if (
        eventName === "" ||
        representativeName === "" ||
        representativeEmail === "" ||
        role === ""
    ) {
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(representativeEmail);
}

function createSignupObject(eventName, representativeName, representativeEmail, role) {
    return {
        eventName: eventName,
        representativeName: representativeName,
        representativeEmail: representativeEmail,
        role: role
    };
} 

function populateTable() {

    const tableBody =
    document.getElementById("event-table-body");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    eventSignups.forEach(function (signup, index) {

        tableBody.innerHTML += `
            <tr>
                <td>${signup.eventName}</td>
                <td>${signup.representativeName}</td>
                <td>${signup.representativeEmail}</td>
                <td>${signup.role}</td>
                <td>
                    <button onclick="deleteSignup(${index})">Delete</button>
                </td>
            </tr>
        `;

    });

}

function updateSummary() {

    if (
        !document.getElementById("sponsor-count") ||
        !document.getElementById("participant-count") ||
        !document.getElementById("organizer-count")
    ) {
        return;
    }

    let sponsors = 0;
    let participants = 0;
    let organizers = 0;

    eventSignups.forEach(function (signup) {
        if (signup.role === "Sponsor") {
            sponsors++;
        } else if (signup.role === "Participant") {
            participants++;
        } else if (signup.role === "Organizer") {
            organizers++;
        }
    });

    document.getElementById("sponsor-count").textContent = sponsors;
    document.getElementById("participant-count").textContent = participants;
    document.getElementById("organizer-count").textContent = organizers;
}

function deleteSignup(index) {
    eventSignups.splice(index, 1);

    localStorage.setItem(
        "eventSignups",
        JSON.stringify(eventSignups)
    );

    populateTable();
    updateSummary();
}

if (eventForm) {
    eventForm.addEventListener("submit", saveEventSignup);
}

function saveEventSignup(event) {
    event.preventDefault();

    const eventName = document.getElementById("eventName").value.trim();
    const representativeName = document.getElementById("representativeName").value.trim();
    const representativeEmail = document.getElementById("representativeEmail").value.trim();
    const role = document.getElementById("role").value;

    if (
        !validateEventSignup(
            eventName,
            representativeName,
            representativeEmail,
            role
        )
    ) {
        alert("Please complete all fields and enter a valid email.");
        return;
    }

    signupRecord = createSignupObject(
        eventName,
        representativeName,
        representativeEmail,
        role
    );

    eventSignups.push(signupRecord);

    localStorage.setItem(
        "eventSignups",
        JSON.stringify(eventSignups)
    );

    populateTable();
    updateSummary();
    

    console.log("Signup Saved:", signupRecord);

    alert("Event signup submitted successfully!");

    document.getElementById("event-signup-form").reset();
}

if (typeof window !== "undefined") {
    window.deleteSignup = deleteSignup;
}

if (typeof module !== "undefined") {
    module.exports = {
        validateEventSignup,
        createSignupObject,
        saveEventSignup,
        populateTable,
        updateSummary,
        deleteSignup,
        getSignupRecord: () => signupRecord
    };
}

if (document.getElementById("event-table-body")) {
    populateTable();
    updateSummary();
}

