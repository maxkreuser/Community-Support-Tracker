const volunteerForm = document.getElementById("volunteer-form")

volunteerForm.addEventListener("submit", addHours)

const valid = {name: false, hours: false, date: false, rating: false}

function addHours(event) {
    event.preventDefault()

    const name = document.getElementById("volunteer-charity-name")
    const hours = document.getElementById("hours")
    const date = document.getElementById("volunteer-date")
    const rating = document.querySelector(".star-rating")
    const ratingChecked = document.querySelector('input[name="rating"]:checked')

    verifyValue(name, "name", "Please enter a valide charity name.")
    verifyValue(hours, "hours", "Please select a number of hours.")
    verifyValue(date, "date", "Please select a date.")
    if (!ratingChecked){
        valid.rating = false
        if (!document.getElementById("rating-error"))
            errorMessage(rating, "rating", "Please give a rating.")
    }
    if (ratingChecked) {
        valid.rating = true
        if (document.getElementById("rating-error")) {
            document.getElementById("rating-error").remove()
        }
    }

    console.log(valid)
    if (Object.values(valid).every(value => value)) {
        const formValues = {name: name.value, hours: hours.value, date: date.value, rating: ratingChecked.value}
        console.log(formValues)
        // volunteerForm.submit()
        // submitMessage()
    }
}

function verifyValue(element, name, message) {
    if (element.value === "") {
        valid[name] = false
        if (!document.getElementById(`${name}-error`))
            errorMessage(element, name, message)
    }
    if (element.value !== "") {
        valid[name] = true
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
