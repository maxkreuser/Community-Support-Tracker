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

    console.log("Signup Saved:", signupRecord);

    alert("Event signup submitted successfully!");

document.getElementById("event-signup-form").reset();
    }

if (typeof module !== "undefined") {
    module.exports = {
        validateEventSignup,
        createSignupObject,
        saveEventSignup,
        getSignupRecord: () => signupRecord
    };
}