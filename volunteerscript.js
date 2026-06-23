const volunteerForm = document.getElementById("volunteer-form")

if (volunteerForm) {
    volunteerForm.addEventListener("submit", addHours)
}

const volunteerRecords = []
const valid = {name: false, hours: false, date: false, rating: false}

/**
 * The invokes on
 * @param {Event} event - 
 */
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

    if (Object.values(valid).every(value => value)) {
        const formValues = {name: name.value, hours: hours.value, date: date.value, rating: ratingChecked.value}
        volunteerRecords.push(formValues)

        document.getElementById("succes-container").classList.remove("hidden")
        setTimeout(() => {
            document.getElementById("succes-container").classList.add("hidden")
        }, 5000)

        // volunteerForm.submit()
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

function applyBgColor() {
    const rows = document.querySelectorAll(".table-rows")
    for (const [index, row] of rows.entries()) {
        if (index % 2 === 0) {
            console.log(index)
            row.style.backgroundColor = "#eee"
        }
    }
}

applyBgColor()

if (typeof module !== "undefined") {
    module.exports = {
        addHours,
        verifyValue,
        errorMessage,
        volunteerRecords,
        valid
    };
}