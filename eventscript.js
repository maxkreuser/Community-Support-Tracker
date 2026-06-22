const eventForm = document.getElementById("event-signup-form");

eventForm.addEventListener("submit", saveEventSignup);

function saveEventSignup(event) {
    event.preventDefault();

    const eventName = document.getElementById("eventName").value.trim();
    const representativeName = document.getElementById("representativeName").value.trim();
    const representativeEmail = document.getElementById("representativeEmail").value.trim();
    const role = document.getElementById("role").value;

    if (
        eventName === "" ||
        representativeName === "" ||
        representativeEmail === "" ||
        role === ""
    ) {
        alert("Please complete all fields.");
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(representativeEmail)) {
        alert("Please enter a valid email address.");
        return;
    }
}