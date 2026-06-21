const volunteerForm = document.getElementById("volunteer-form")

volunteerForm.addEventListener("submit", addHours)

function addHours(event) {
    event.preventDefault()

    const name = document.getElementById("volunteer-charity-name")
    const hours = document.getElementById("hours")
    const date = document.getElementById("volunteer-date")
    const rating = document.querySelector(".star-rating")
    const ratingChecked = document.querySelector('input[name="rating"]:checked')

    // if (name.value === "") {
    //     if (!document.getElementById("name-error"))
    //         errorMessage(name, "name", "Please enter a valide charity name.")
    // }
    // if (name.value !== "") {
    //     if (document.getElementById("name-error"))
    //         document.getElementById("name-error").remove()
    // }

    // if (hours.value === "") {
    //     if (!document.getElementById("hours-error"))
    //         errorMessage(hours, "hours", "Please select a number of hours.")
    // }
    // if (hours.value !== "") {
    //     if (document.getElementById("hours-error")) {
    //         document.getElementById("hours-error").remove()
    //     }
    // }

    verifyValue(name, "name", "Please enter a valide charity name.")
    verifyValue(hours, "hours", "Please select a number of hours.")
    verifyValue(date, "date", "Please select a date.")
    console.log(ratingChecked)
    if (!ratingChecked){
        if (!document.getElementById("rating-error"))
            errorMessage(rating, "rating", "Please give a rating.")
    }
    if (ratingChecked) {
        if (document.getElementById("rating-error")) {
            document.getElementById("rating-error").remove()
        }
    }
}

function verifyValue(element, name, message) {
    if (element.value === "") {
        if (!document.getElementById(`${name}-error`))
            errorMessage(element, name, message)
    }
    if (element.value !== "") {
        if (document.getElementById(`${name}-error`)) {
            document.getElementById(`${name}-error`).remove()
        }
    }
}

function errorMessage(element, name, message) {
    const errorElement = document.createElement("span")
    errorElement.setAttribute("id", `${name}-error`)
    errorElement.textContent = message
    const styles = `
        color: red;
        font-weight: 600;
        margin-left: 20px;
    `
    errorElement.style = styles
    element.after(errorElement)
}