const eventForm = document.getElementById("event-signup-form");

eventForm.addEventListener("submit", saveEventSignup);

function saveEventSignup(event) {
    event.preventDefault();

    console.log("Form submitted");
}