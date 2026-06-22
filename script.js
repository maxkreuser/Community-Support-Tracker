const eventForm = document.getElementById("event-signup-form");

eventForm.addEventListener("submit", handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault();

    console.log("Event signup form submitted");
}