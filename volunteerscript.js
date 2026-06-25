const volunteerForm = document.getElementById("volunteer-form")

/**
 * Event listener for the form's submission event
 */
if (volunteerForm) {
    volunteerForm.addEventListener("submit", addHours)
}

// Gets volunteering data from storage
let volunteerRecords = JSON.parse(localStorage.getItem("volunteer-hours")) || []

// Object to hold form's input fields validity values
const valid = {name: false, hours: false, date: false, rating: false}

/**
 * Collects input values from form, verifies if the values are valid,
 * inputs an error message if invalid values, if all values are good,
 * stores the values as object in localStorage, add the data to the
 * UI table for display, and outputs a succes message for the user.
 * @param {Event} event - takes the submission event from the form
 */
function addHours(event) {
    event.preventDefault()

    // Querying input fields
    const name = document.getElementById("volunteer-charity-name")
    const hours = document.getElementById("hours")
    const date = document.getElementById("volunteer-date")
    const rating = document.querySelector(".star-rating")
    const ratingChecked = document.querySelector('input[name="rating"]:checked')

    // Verify is values are valid and displaying if necessary an error message.
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

    // Collecting values into an object if all values are valid
    if (Object.values(valid).every(value => value)) {
        const formValues = {name: name.value, hours: hours.value, date: date.value, rating: ratingChecked.value}

        // Updating record of all volunteer data objects
        volunteerRecords.push(formValues)

        // Storing record in local storage and getting it back "to update the local record", forgot why...
        localStorage.setItem("volunteer-hours", JSON.stringify(volunteerRecords))
        volunteerRecords = JSON.parse(localStorage.getItem("volunteer-hours"))

        // Updating the UI table with the lastest volunteering object
        updateTable()

        // Clearing form inputs
        name.value = ""
        hours.value = ""
        date.value = ""
        if (ratingChecked) ratingChecked.checked = false

        // Displaying a succes message
        document.getElementById("succes-container").classList.remove("hidden")
        setTimeout(() => {
            document.getElementById("succes-container").classList.add("hidden")
        }, 4000)

        // volunteerForm.submit()
    }
}

/**
 * Verifies that the input field is not empty and displays an
 * error message beside it if empty. Removes error message if
 * value is finally valid.
 * @param {object / node} element - object of input field
 * @param {string} name - name to verify id of error message
 * @param {string} message - the error message to display to user
 */
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

/**
 * Constructs the element to display the error message to the
 * user diplayed beside the input field with the incorrect value.
 * @param {object / node} element - object of input field
 * @param {*} name - name to assign to id of error message
 * @param {*} message - the error message to display to user
 */
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

/**
 * Creates the row elements for the volunteer data table and populates
 * it with the objects stored locally in the volunteer record.
 */
function populateTable() {
    const table = document.querySelector("table")
    for (const [index, value] of Object.entries(volunteerRecords)) {
        const markup = `
            <tr class="table-rows" data-index="${index}">
                <td>${value.name}</td>
                <td>${value.hours}</td>
                <td>${value.date}</td>
                <td>${value.rating}</td>
                <td><button class="delete-btn">Delete</button></td>
            </tr>
        `
        if (table) table.innerHTML += markup
    }
    applyBgColor()
    totalHours()
}

/**
 * Creates a single table row for the latest volunteer data object, and
 * displays it (adds it) at the bottom of the volunteer table on the UI.
 */
function updateTable() {
    const table = document.querySelector("table")
    const lastRecord = volunteerRecords[volunteerRecords.length - 1]    
    const markup = `
        <tr class="table-rows" data-index="${volunteerRecords.length - 1}">
            <td>${lastRecord.name}</td>
            <td>${lastRecord.hours}</td>
            <td>${lastRecord.date}</td>
            <td>${lastRecord.rating}</td>
            <td><button class="delete-btn">Delete</button></td>
        </tr>
    `
    if (table) table.innerHTML += markup
    applyBgColor()
    totalHours()
}

/**
 * Listeners installed on 'delete' buttons of volunteer table, listening for click events.
 * Tasked with removing related table row from table and removing related data object
 * from the script storage (volunteerRecord) and setting new value to the localStorage.
 * Clears rows from table and repopulates it with fresh copy coming from localStorage, so
 * dataset-index of volunteerRecords are in continuous order.
 */
function deleteButtonsAction() {
    // Setting up table listeners on buttons
    const table = document.querySelector("table")
    if (table) {
        table.addEventListener("click", (event) => {
            if (event.target.classList.contains("delete-btn")) {
                const button = event.target
                const row = button.closest("tr")
                const rowId = row.dataset.index
                
                // Deleting record and storing updated record in localStorage
                volunteerRecords.splice(rowId, 1)
                localStorage.setItem("volunteer-hours", JSON.stringify(volunteerRecords))

                // Delete table content and repopulate to reorder elements with new data-index to match volunteerRecords indexes.
                const tableRows = document.querySelectorAll(".table-rows")
                tableRows.forEach((row) => row.remove())
                populateTable()
            }
        })
    }
}

/**
 * Applies the alternating background color to the table's row on the UI.
 */
function applyBgColor() {
    const rows = document.querySelectorAll(".table-rows")
    for (const [index, row] of rows.entries()) {
        if (index % 2 === 0) {
            row.style.backgroundColor = "#eee"
        }
    }
}

/**
 * Calculates the total volunteer hours found the volunteerRecord and displays
 * it below the volunteer table.
 */
function totalHours() {
    const totalEl = document.querySelector("#table-section > h3")
    let total = 0
    for (const value of Object.values(volunteerRecords)) total += Number(value.hours)
    totalEl.textContent = `Total Voluntered Hours - ${total}H`
    if (total === 0) {
        totalEl.style.display = "none"
    } else {
        totalEl.style.display = "block"
    }
}

// Event listener on the date input element that enables clicking
// anywhere on the element to select a date.
const volunteerDateInput = document.getElementById("volunteer-date")
if (volunteerDateInput) {
    document.getElementById("volunteer-date").addEventListener("click", function(e) {
        this.showPicker();
        e.preventDefault();
    });
}

// Limit max date selection to today in date input element
// Get today's date
const today = new Date();
today.setDate(today.getDate());

// Format as YYYY-MM-DD (local time)
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');

if (volunteerDateInput) volunteerDateInput.max = `${yyyy}-${mm}-${dd}`;

// On load, populates the volunteer table with the data from localStorage
// and adds event listener on table's 'deletion buttons'.
populateTable()
deleteButtonsAction()

// Export objects and values needed for the jest tests.
if (typeof module !== "undefined") {
    module.exports = {
        addHours,
        verifyValue,
        errorMessage,
        volunteerRecords,
        valid
    };
}