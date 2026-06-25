const {
    addHours,
    verifyValue,
    errorMessage,
    volunteerRecords,
    valid,
    populateTable,
    updateTable,
    deleteButtonsAction,
    applyBgColor,
    totalHours,
    customizeDateInput
} = require("./volunteerscript");

describe("addHours integration tests", () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <form id="volunteer-form">
                <input id="volunteer-charity-name">
                <input id="hours">
                <input id="volunteer-date">
                <div class="star-rating">
                    <input type="radio" id="star5" name="rating" value="5">
                    <label for="star5">★</label>
                    <input type="radio" id="star4" name="rating" value="4">
                    <label for="star4">★</label>
                    <input type="radio" id="star3" name="rating" value="3">
                    <label for="star3">★</label>
                    <input type="radio" id="star2" name="rating" value="2">
                    <label for="star2">★</label>
                    <input type="radio" id="star1" name="rating" value="1">
                    <label for="star1">★</label>
                </div>
                <button type="submit">Add Hours</button>
            </form>
            <table>
                <tr>
                    <th>Charity Name</th>
                    <th>Hours</th>
                    <th>Date</th>
                    <th>Rating</th>
                    <th>Remove</th>
                </tr>
            </table>
            <h3 style="display: none;"></h3>
            <div id="succes-container" class="hidden"></div>
        `;
        volunteerRecords.length = 0;
    });

    afterEach(() => {
        localStorage.clear();
    });

    test("submitting valid form to update volunteer records succesfully", () => {
        document.getElementById("volunteer-charity-name").value = "Red Cross";
        document.getElementById("hours").value = "5";
        document.getElementById("volunteer-date").value = "2026-06-22";
        document.getElementById("star3").checked = true;

        addHours({ preventDefault: jest.fn() });

        expect(volunteerRecords.length).toBe(1);
        expect(volunteerRecords[0]).toEqual({
            name: "Red Cross",
            hours: "5",
            date: "2026-06-22",
            rating: "3"
        });
    });

    test("submitting with invalid data to show error messages in DOM", () => {
        addHours({ preventDefault: jest.fn() });

        expect(document.getElementById("name-error").textContent)
            .toBe("Please enter a valide charity name.");
        expect(document.getElementById("hours-error").textContent)
            .toBe("Please select a number of hours.");
        expect(document.getElementById("date-error").textContent)
            .toBe("Please select a date.");
        expect(document.getElementById("rating-error").textContent)
            .toBe("Please give a rating.");

        expect(document.getElementById("succes-container")
            .classList.contains("hidden")).toBe(true);
    });

    test("submitting valid form stores data in localStorage and updates the table", () => {
        document.getElementById("volunteer-charity-name").value = "Salvation Army";
        document.getElementById("hours").value = "4";
        document.getElementById("volunteer-date").value = "2026-07-01";
        document.getElementById("star4").checked = true;

        addHours({ preventDefault: jest.fn() });

        // localStorage was updated
        const stored = JSON.parse(localStorage.getItem("volunteer-hours"));
        expect(stored.length).toBe(1);
        expect(stored[0].name).toBe("Salvation Army");

        // Table was updated with the new row
        const rows = document.querySelectorAll(".table-rows");
        expect(rows.length).toBe(1);
        expect(rows[0].cells[0].textContent).toBe("Salvation Army");
    });
});

describe("verifyValue - empty fields test", () => {

    beforeEach(() => {
        document.body.innerHTML = `<input id="test-input">`;
    });

    test("sets variable 'valid' to false and creates error", () => {
        const input = document.getElementById("test-input");
        input.value = "";

        verifyValue(input, "test", "This is a required field.");

        expect(valid.test).toBe(false);
        const error = document.getElementById("test-error");
        expect(error).not.toBeNull();
        expect(error.textContent).toBe("This is a required field.");
    });

    test("sets valid to true and removes error when value is non-empty", () => {
        const input = document.getElementById("test-input");

        // This creates the error
        input.value = "";
        verifyValue(input, "test2", "This is a required field.");
        expect(valid.test2).toBe(false);

        // This removes the error
        input.value = "The input is filled";
        verifyValue(input, "test2", "This is a required field.");
        expect(valid.test2).toBe(true);
        expect(document.getElementById("test2-error")).toBeNull();
    });
});

describe("errorMessage - testing message element creation", () => {

    beforeEach(() => {
        document.body.innerHTML = `<input id="test-field">`;
    });

    test("creates a span with the correct id and message", () => {
        const input = document.getElementById("test-field");

        errorMessage(input, "username", "Username is required.");

        const error = document.getElementById("username-error");
        expect(error).not.toBeNull();
        expect(error.tagName).toBe("SPAN");
        expect(error.textContent).toBe("Username is required.");
    });
});

describe("populateTable - testing rows creation and correct data insertion", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <table>
                <tr>
                    <th>Charity Name</th>
                    <th>Hours</th>
                    <th>Date</th>
                    <th>Rating</th>
                    <th>Remove</th>
                </tr>
            </table>
            <h3 style="display: none;"></h3>
        `;
        volunteerRecords.length = 0;
    });

    test("adds no rows when volunteerRecords is empty", () => {
        populateTable();
        expect(document.querySelectorAll(".table-rows").length).toBe(0);
    });

    test("adds one row for a single record", () => {
        volunteerRecords.push({ name: "Red Cross", hours: "5", date: "2026-06-22", rating: "4" });
        populateTable();
        expect(document.querySelectorAll(".table-rows").length).toBe(1);
    });

    test("renders correct data in each cell", () => {
        volunteerRecords.push({ name: "Red Cross", hours: "5", date: "2026-06-22", rating: "4" });
        populateTable();
        const cells = document.querySelectorAll(".table-rows td");
        expect(cells[0].textContent).toBe("Red Cross");
        expect(cells[1].textContent).toBe("5");
        expect(cells[2].textContent).toBe("2026-06-22");
        expect(cells[3].textContent).toBe("4");
    });

    test("sets correct data-index attribute", () => {
        volunteerRecords.push(
            { name: "A", hours: "1", date: "2026-01-01", rating: "5" },
            { name: "B", hours: "2", date: "2026-01-02", rating: "4" }
        );
        populateTable();
        const rows = document.querySelectorAll(".table-rows");
        expect(rows[0].dataset.index).toBe("0");
        expect(rows[1].dataset.index).toBe("1");
    });

    test("includes a delete button in each row", () => {
        volunteerRecords.push({ name: "Test", hours: "3", date: "2026-01-01", rating: "5" });
        populateTable();
        const button = document.querySelector(".table-rows .delete-btn");
        expect(button).not.toBeNull();
        expect(button.textContent).toBe("Delete");
    });

    test("renders multiple records correctly", () => {
        volunteerRecords.push(
            { name: "Red Cross", hours: "5", date: "2026-06-22", rating: "4" },
            { name: "UNICEF", hours: "3", date: "2026-06-23", rating: "5" },
            { name: "Food Bank", hours: "2", date: "2026-06-24", rating: "3" }
        );
        populateTable();
        const rows = document.querySelectorAll(".table-rows");
        expect(rows.length).toBe(3);
        expect(rows[0].cells[0].textContent).toBe("Red Cross");
        expect(rows[1].cells[0].textContent).toBe("UNICEF");
        expect(rows[2].cells[0].textContent).toBe("Food Bank");
    });
})

describe("updateTable - testing single row append to table", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <table>
                <tr>
                    <th>Charity Name</th>
                    <th>Hours</th>
                    <th>Date</th>
                    <th>Rating</th>
                    <th>Remove</th>
                </tr>
            </table>
            <h3 style="display: none;"></h3>
        `;
        volunteerRecords.length = 0;
    });

    test("renders correct data from the last record", () => {
        volunteerRecords.push(
            { name: "Red Cross", hours: "5", date: "2026-06-22", rating: "4" },
            { name: "UNICEF", hours: "3", date: "2026-06-23", rating: "5" },
            { name: "Food Bank", hours: "2", date: "2026-06-24", rating: "3" }
        );
        updateTable();
        const cells = document.querySelectorAll(".table-rows td");
        expect(cells[0].textContent).toBe("Food Bank");
        expect(cells[1].textContent).toBe("2");
        expect(cells[2].textContent).toBe("2026-06-24");
        expect(cells[3].textContent).toBe("3");
    });

    test("sets data-index to the last index position", () => {
        volunteerRecords.push(
            { name: "A", hours: "1", date: "2026-01-01", rating: "5" },
            { name: "B", hours: "2", date: "2026-01-02", rating: "4" },
            { name: "C", hours: "3", date: "2026-01-03", rating: "3" }
        );
        updateTable();
        expect(document.querySelector(".table-rows").dataset.index).toBe("2");
    });

    test("adds only one row regardless of total records", () => {
        volunteerRecords.push(
            { name: "A", hours: "1", date: "2026-01-01", rating: "5" },
            { name: "B", hours: "2", date: "2026-01-02", rating: "4" }
        );
        updateTable();
        expect(document.querySelectorAll(".table-rows").length).toBe(1);
    });

    test("includes a delete button in the row", () => {
        volunteerRecords.push({ name: "Test", hours: "3", date: "2026-01-01", rating: "5" });
        updateTable();
        const button = document.querySelector(".table-rows .delete-btn");
        expect(button).not.toBeNull();
        expect(button.textContent).toBe("Delete");
    });

    test("appends row without removing existing rows", () => {
        volunteerRecords.push({ name: "First", hours: "1", date: "2026-01-01", rating: "5" });
        updateTable();
        volunteerRecords.push({ name: "Second", hours: "2", date: "2026-01-02", rating: "4" });
        updateTable();
        expect(document.querySelectorAll(".table-rows").length).toBe(2);
        expect(document.querySelectorAll(".table-rows")[0].cells[0].textContent).toBe("First");
        expect(document.querySelectorAll(".table-rows")[1].cells[0].textContent).toBe("Second");
    });
});

describe("deleteButtonsAction - testing deletion of volunteer records", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <table>
                <tr>
                    <th>Charity Name</th>
                    <th>Hours</th>
                    <th>Date</th>
                    <th>Rating</th>
                    <th>Remove</th>
                </tr>
            </table>
            <h3 style="display: none;"></h3>
        `;
        volunteerRecords.length = 0;
        volunteerRecords.push(
            { name: "Red Cross", hours: "5", date: "2026-06-22", rating: "4" },
            { name: "UNICEF", hours: "3", date: "2026-06-23", rating: "5" },
            { name: "Food Bank", hours: "2", date: "2026-06-24", rating: "3" }
        );
        populateTable();             // render rows
        deleteButtonsAction();       // attach listener
    });

    afterEach(() => {
        localStorage.clear();        // clean up between tests
    });

    test("removes the correct record from volunteerRecords", () => {
        document.querySelectorAll(".delete-btn")[1].click(); // delete UNICEF

        expect(volunteerRecords.length).toBe(2);
        expect(volunteerRecords[0].name).toBe("Red Cross");
        expect(volunteerRecords[1].name).toBe("Food Bank");
    });

    test("updates localStorage after deletion", () => {
        document.querySelector(".delete-btn").click(); // delete first row (Red Cross)

        const stored = JSON.parse(localStorage.getItem("volunteer-hours"));
        expect(stored.length).toBe(2);
        expect(stored[0].name).toBe("UNICEF");
    });

    test("re-indexes data-index attributes sequentially after deletion", () => {
        document.querySelectorAll(".delete-btn")[1].click(); // delete UNICEF

        const rows = document.querySelectorAll(".table-rows");
        expect(rows[0].dataset.index).toBe("0");
        expect(rows[1].dataset.index).toBe("1");
    });

    test("removes one row from the table", () => {
        expect(document.querySelectorAll(".table-rows").length).toBe(3);

        document.querySelectorAll(".delete-btn")[0].click();

        expect(document.querySelectorAll(".table-rows").length).toBe(2);
    });

    test("does nothing when clicking outside a delete button", () => {
        document.querySelector("th").click(); // click on table header

        expect(document.querySelectorAll(".table-rows").length).toBe(3);
        expect(volunteerRecords.length).toBe(3);
    });
});

describe("localStorage persistence and table display on page load", () => {
    afterEach(() => {
        localStorage.clear();
    });

    test("loads data from localStorage and displays it in the table", () => {
        localStorage.setItem("volunteer-hours", JSON.stringify([
            { name: "Red Cross", hours: "5", date: "2026-06-22", rating: "4" },
            { name: "UNICEF", hours: "3", date: "2026-06-23", rating: "5" }
        ]));

        document.body.innerHTML = `
            <table>
                <tr>
                    <th>Charity Name</th>
                    <th>Hours</th>
                    <th>Date</th>
                    <th>Rating</th>
                    <th>Remove</th>
                </tr>
            </table>
            <h3 style="display: none;"></h3>
        `;

        jest.isolateModules(() => {
            const mod = require("./volunteerscript");
            const rows = document.querySelectorAll(".table-rows");
            expect(rows.length).toBe(2);
            expect(rows[0].cells[0].textContent).toBe("Red Cross");
            expect(rows[1].cells[0].textContent).toBe("UNICEF");
        });
    });

    test("starts with empty table when localStorage is empty", () => {
        localStorage.removeItem("volunteer-hours");

        document.body.innerHTML = `
            <table>
                <tr>
                    <th>Charity Name</th>
                    <th>Hours</th>
                    <th>Date</th>
                    <th>Rating</th>
                    <th>Remove</th>
                </tr>
            </table>
            <h3 style="display: none;"></h3>
        `;

        jest.isolateModules(() => {
            require("./volunteerscript");
            expect(document.querySelectorAll(".table-rows").length).toBe(0);
        });
    });
});

describe("applyBgColor - background colors are applied on table rows", () => {

    beforeEach(() => {
        document.body.innerHTML = `
        <table>
            <tr>
                <th>Charity Name</th>
                <th>Hours</th>
                <th>Date</th>
                <th>Rating</th>
                <th>Remove</th>
            </tr>
            </table>
            <h3 style="display: none;"></h3>
            `
            
        volunteerRecords.push(
            { name: "Red Cross", hours: "5", date: "2026-06-22", rating: "4" },
            { name: "UNICEF", hours: "3", date: "2026-06-23", rating: "5" },
            { name: "Food Bank", hours: "2", date: "2026-06-24", rating: "3" }
        );
        populateTable()
    })
    
    test("background color is applied on correct rows", () => {
        const rows = document.querySelectorAll(".table-rows")
        expect(rows[0].style.backgroundColor).toBe("rgb(238, 238, 238)")
        expect(rows[1].style.backgroundColor).toBe("")
        expect(rows[2].style.backgroundColor).toBe("rgb(238, 238, 238)")
    })

    test("does not crash when no table rows exist", () => {
        volunteerRecords.length = 0;
        document.querySelectorAll(".table-rows").forEach(r => r.remove());
        expect(() => applyBgColor()).not.toThrow();
    });

    test("calling twice produces the same result", () => {
        applyBgColor();
        const firstPass = [...document.querySelectorAll(".table-rows")].map(r => r.style.backgroundColor);
        applyBgColor();
        const secondPass = [...document.querySelectorAll(".table-rows")].map(r => r.style.backgroundColor);
        expect(secondPass).toEqual(firstPass);
    });
})


// totalHours,
// customizeDateInput


// Unit Tests:
    // Test the function for calculating the total volunteer hours.
    // Test that deleting a record updates the localStorage and table correctly.
    // Test that the total volunteer hours update when a record is deleted.