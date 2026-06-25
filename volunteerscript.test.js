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

describe("module-level initialization", () => {
    test("attaches submit listener to form when present in DOM", () => {
        document.body.innerHTML = `
            <form id="volunteer-form">
                <input id="volunteer-charity-name">
                <input id="hours">
                <input id="volunteer-date">
                <div class="star-rating">
                    <input type="radio" id="star5" name="rating" value="5">
                </div>
            </form>
            <div id="succes-container"></div>
        `;

        jest.isolateModules(() => {
            require("./volunteerscript");
            // Dispatch submit — addHours should fire and create validation errors
            document.getElementById("volunteer-form").dispatchEvent(new Event("submit"));
            expect(document.getElementById("name-error")).not.toBeNull();
        });
    });
});

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

    test("removes rating error when a star is selected after invalid submission", () => {
        addHours({ preventDefault: jest.fn() });
        expect(document.getElementById("rating-error")).not.toBeNull();

        document.getElementById("star4").checked = true;
        addHours({ preventDefault: jest.fn() });
        expect(document.getElementById("rating-error")).toBeNull();
    });

    test("hides success message after 4 seconds", () => {
        jest.useFakeTimers();

        document.getElementById("volunteer-charity-name").value = "Red Cross";
        document.getElementById("hours").value = "5";
        document.getElementById("volunteer-date").value = "2026-06-22";
        document.getElementById("star3").checked = true;

        addHours({ preventDefault: jest.fn() });

        expect(document.getElementById("succes-container")
            .classList.contains("hidden")).toBe(false);

        jest.advanceTimersByTime(4000);

        expect(document.getElementById("succes-container")
            .classList.contains("hidden")).toBe(true);

        jest.useRealTimers();
    });

    test("does not duplicate rating error if one already exists", () => {
        // First invalid submission creates the error
        addHours({ preventDefault: jest.fn() });
        const errorSpans = document.querySelectorAll('[id$="-error"]').length;

        // Second invalid submission — guard should prevent duplicates
        addHours({ preventDefault: jest.fn() });
        expect(document.querySelectorAll('[id$="-error"]').length).toBe(errorSpans);
    });

    test("unchecks the rating star after successful submission", () => {
        document.getElementById("volunteer-charity-name").value = "Red Cross";
        document.getElementById("hours").value = "5";
        document.getElementById("volunteer-date").value = "2026-06-22";
        document.getElementById("star3").checked = true;

        addHours({ preventDefault: jest.fn() });

        expect(document.getElementById("star3").checked).toBe(false);
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

    test("applies red styling to the error span", () => {
        const input = document.getElementById("test-field");
        errorMessage(input, "email", "Invalid email.");
        const error = document.getElementById("email-error");
        expect(error.style.color).toBe("red");
        expect(error.style.fontWeight).toBe("600");
        expect(error.style.marginLeft).toBe("20px");
    });

    test("inserts the error span immediately after the target element", () => {
        const input = document.getElementById("test-field");
        errorMessage(input, "field", "Error.");
        const error = document.getElementById("field-error");
        expect(error.previousElementSibling).toBe(input);
    });

    test("creates independent error spans for different elements", () => {
        document.body.innerHTML = `
            <input id="name-input">
            <input id="email-input">
        `;
        const nameInput = document.getElementById("name-input");
        const emailInput = document.getElementById("email-input");

        errorMessage(nameInput, "name", "Name is required.");
        errorMessage(emailInput, "email", "Email is required.");

        expect(document.getElementById("name-error").textContent).toBe("Name is required.");
        expect(document.getElementById("email-error").textContent).toBe("Email is required.");
    });

    test("works with different element types like select", () => {
        document.body.innerHTML = `<select id="test-select"><option value="">Choose</option></select>`;
        const select = document.getElementById("test-select");
        errorMessage(select, "role", "Select a role.");
        const error = document.getElementById("role-error");
        expect(error).not.toBeNull();
        expect(error.textContent).toBe("Select a role.");
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

    test("populateTable writes rows into the table element", () => {
        volunteerRecords.length = 0;
        volunteerRecords.push({ name: "Red Cross", hours: "5", date: "2026-06-22", rating: "4" });
        populateTable();
        const table = document.querySelector("table");
        expect(table.innerHTML).toContain("table-rows");
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

    test("updateTable exits early when volunteerRecords is empty", () => {
        volunteerRecords.length = 0;
        expect(() => updateTable()).not.toThrow();
        expect(document.querySelectorAll(".table-rows").length).toBe(0);
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

describe("totalHours - testing return output to display", () => {

    beforeEach(() => {
        document.body.innerHTML = `
            <section id="table-section">
                <h3 style="display: none;"></h3>
            </section>
            `
        volunteerRecords.length = 0
    })
    
    test("verify sum of hours is accurate", () => {
        volunteerRecords.push(
            { name: "Red Cross", hours: "5", date: "2026-06-22", rating: "4" },
            { name: "UNICEF", hours: "3", date: "2026-06-23", rating: "5" },
            { name: "Food Bank", hours: "2", date: "2026-06-24", rating: "3" }
        );
        totalHours()
        const h3 = document.querySelector("#table-section > h3")
        expect(h3.textContent).toBe("Total Voluntered Hours - 10H")
    })

    test("verify h3 element stays hidden if no hours recorded", () => {
        volunteerRecords.push({ name: "Red Cross", hours: "5", date: "2026-06-22", rating: "4" })
        volunteerRecords.length = 0
        totalHours()
        const h3 = document.querySelector("#table-section > h3")
        expect(h3.style.display).toBe("none")
    })

    test("returns 0 when no records exist", () => {
        totalHours();
        const h3 = document.querySelector("#table-section > h3");
        expect(h3.textContent).toBe("Total Voluntered Hours - 0H");
    });

    test("returns 0 when all records have 0 hours", () => {
        volunteerRecords.push(
            { name: "A", hours: "0", date: "2026-01-01", rating: "5" },
            { name: "B", hours: "0", date: "2026-01-02", rating: "4" }
        );
        totalHours();
        const h3 = document.querySelector("#table-section > h3");
        expect(h3.textContent).toBe("Total Voluntered Hours - 0H");
    });

    test("sums hours from a single record", () => {
        volunteerRecords.push({ name: "Red Cross", hours: "5", date: "2026-06-22", rating: "4" });
        totalHours();
        const h3 = document.querySelector("#table-section > h3");
        expect(h3.textContent).toBe("Total Voluntered Hours - 5H");
    });

    test("shows the element when total is greater than 0", () => {
        volunteerRecords.push({ name: "Red Cross", hours: "3", date: "2026-06-22", rating: "5" });
        totalHours();
        const h3 = document.querySelector("#table-section > h3");
        expect(h3.style.display).toBe("block");
    });

    test("does not crash when the h3 element is missing", () => {
        document.body.innerHTML = ``;
        expect(() => totalHours()).not.toThrow();
    });
})

describe("customizeDateInput", () => {
    beforeEach(() => {
        document.body.innerHTML = `<input type="date" id="volunteer-date">`;
    });

    test("sets the max attribute on the date input to today's date", () => {
        customizeDateInput();
        const input = document.getElementById("volunteer-date");
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        expect(input.max).toBe(`${yyyy}-${mm}-${dd}`);
    });

    test("does not crash when the date input element is missing", () => {
        document.body.innerHTML = ``;
        expect(() => customizeDateInput()).not.toThrow();
    });

    test("`customizeDateInput` adds click listener that calls showPicker on module init", () => {
        document.body.innerHTML = `<input type="date" id="volunteer-date">`;

        jest.isolateModules(() => {
            require("./volunteerscript");
            const input = document.getElementById("volunteer-date");
            expect(input.max).toBeTruthy(); // verify customizeDateInput ran

            const showPickerMock = jest.fn();
            input.showPicker = showPickerMock;
            const event = new MouseEvent("click", { bubbles: true });
            const preventDefaultSpy = jest.spyOn(event, "preventDefault");
            input.dispatchEvent(event);

            expect(showPickerMock).toHaveBeenCalled();
            expect(preventDefaultSpy).toHaveBeenCalled();
        });
    });
});

describe("total volunteer hours update after record deletion", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <section id="table-section">
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
            </section>
        `;
        volunteerRecords.length = 0;
        volunteerRecords.push(
            { name: "Red Cross", hours: "5", date: "2026-06-22", rating: "4" },
            { name: "UNICEF", hours: "3", date: "2026-06-23", rating: "5" },
            { name: "Food Bank", hours: "2", date: "2026-06-24", rating: "3" }
        );
        populateTable();
        deleteButtonsAction();
        // Initial total should be 10
    });

    afterEach(() => localStorage.clear());

    test("decreases total after deleting a record", () => {
        document.querySelectorAll(".delete-btn")[1].click(); // delete UNICEF (3h)

        const h3 = document.querySelector("#table-section > h3");
        expect(h3.textContent).toBe("Total Voluntered Hours - 7H"); // 5 + 2 = 7
    });

    test("shows correct total after deleting the first record", () => {
        document.querySelector(".delete-btn").click(); // delete Red Cross (5h)

        const h3 = document.querySelector("#table-section > h3");
        expect(h3.textContent).toBe("Total Voluntered Hours - 5H"); // 3 + 2 = 5
    });

    test("shows correct total after deleting the last record", () => {
        document.querySelectorAll(".delete-btn")[2].click(); // delete Food Bank (2h)

        const h3 = document.querySelector("#table-section > h3");
        expect(h3.textContent).toBe("Total Voluntered Hours - 8H"); // 5 + 3 = 8
    });

    test("shows 0H and hides element when the only record is deleted", () => {
        // Keep only one record
        volunteerRecords.length = 0;
        volunteerRecords.push({ name: "Solo", hours: "4", date: "2026-01-01", rating: "5" });
        // Re-render and re-attach listener
        document.body.innerHTML = `
            <section id="table-section">
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
            </section>
        `;
        volunteerRecords.length = 0;
        volunteerRecords.push({ name: "Solo", hours: "4", date: "2026-01-01", rating: "5" });
        populateTable();
        deleteButtonsAction();

        document.querySelector(".delete-btn").click();

        const h3 = document.querySelector("#table-section > h3");
        expect(h3.textContent).toBe("Total Voluntered Hours - 0H");
        expect(h3.style.display).toBe("none");
    });

    test("total updates correctly after multiple deletions", () => {
        document.querySelectorAll(".delete-btn")[0].click(); // delete Red Cross (5h) → total 5
        document.querySelectorAll(".delete-btn")[1].click(); // delete Food Bank (2h) → total 3

        const h3 = document.querySelector("#table-section > h3");
        expect(h3.textContent).toBe("Total Voluntered Hours - 3H"); // only UNICEF left
    });
});

describe("deleting a record updates localStorage and table correctly", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <section id="table-section">
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
            </section>
        `;
        volunteerRecords.length = 0;
        volunteerRecords.push(
            { name: "Red Cross", hours: "5", date: "2026-06-22", rating: "4" },
            { name: "UNICEF", hours: "3", date: "2026-06-23", rating: "5" },
            { name: "Food Bank", hours: "2", date: "2026-06-24", rating: "3" }
        );
        populateTable();
        deleteButtonsAction();
    });

    afterEach(() => localStorage.clear());

    test("localStorage removes the deleted record", () => {
        document.querySelectorAll(".delete-btn")[1].click(); // delete UNICEF

        const stored = JSON.parse(localStorage.getItem("volunteer-hours"));
        expect(stored.length).toBe(2);
        expect(stored[0].name).toBe("Red Cross");
        expect(stored[1].name).toBe("Food Bank");
    });

    test("table row count matches localStorage after deletion", () => {
        document.querySelectorAll(".delete-btn")[0].click();

        const stored = JSON.parse(localStorage.getItem("volunteer-hours"));
        const rows = document.querySelectorAll(".table-rows");
        expect(rows.length).toBe(stored.length);
    });

    test("table cell data matches localStorage after deletion", () => {
        document.querySelectorAll(".delete-btn")[2].click(); // delete Food Bank

        const stored = JSON.parse(localStorage.getItem("volunteer-hours"));
        const rows = document.querySelectorAll(".table-rows");
        stored.forEach((record, i) => {
            const rowCells = rows[i].querySelectorAll("td");
            expect(rowCells[0].textContent).toBe(record.name);
            expect(rowCells[1].textContent).toBe(record.hours);
            expect(rowCells[3].textContent).toBe(record.rating);
        });
    })

    test("data-index is re-sequenced after deletion to match array order", () => {
        document.querySelectorAll(".delete-btn")[0].click(); // delete Red Cross

        const stored = JSON.parse(localStorage.getItem("volunteer-hours"));
        const rows = document.querySelectorAll(".table-rows");
        rows.forEach((row, i) => {
            expect(row.dataset.index).toBe(String(i));
            expect(row.cells[0].textContent).toBe(stored[i].name);
        });
    });

    test("deleting the last remaining record clears the table and localStorage", () => {
        volunteerRecords.length = 0;
        volunteerRecords.push({ name: "Solo", hours: "4", date: "2026-01-01", rating: "5" });
        document.body.innerHTML = `
            <section id="table-section">
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
            </section>
        `;
        populateTable();
        deleteButtonsAction();

        document.querySelector(".delete-btn").click();

        expect(JSON.parse(localStorage.getItem("volunteer-hours"))).toEqual([]);
        expect(document.querySelectorAll(".table-rows").length).toBe(0);
    });

    test("deleting all records one by one keeps localStorage and table in sync", () => {
        // Delete all three records sequentially
        document.querySelectorAll(".delete-btn")[0].click();
        let stored = JSON.parse(localStorage.getItem("volunteer-hours"));
        expect(stored.length).toBe(2);
        expect(document.querySelectorAll(".table-rows").length).toBe(2);

        document.querySelectorAll(".delete-btn")[0].click();
        stored = JSON.parse(localStorage.getItem("volunteer-hours"));
        expect(stored.length).toBe(1);
        expect(document.querySelectorAll(".table-rows").length).toBe(1);

        document.querySelectorAll(".delete-btn")[0].click();
        stored = JSON.parse(localStorage.getItem("volunteer-hours"));
        expect(stored.length).toBe(0);
        expect(document.querySelectorAll(".table-rows").length).toBe(0);
    });
})