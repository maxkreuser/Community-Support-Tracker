const {
    addHours,
    verifyValue,
    errorMessage,
    volunteerRecords,
    valid
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
            <div id="succes-container" class="hidden"></div>
        `;
        volunteerRecords.length = 0;  // reset between tests
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