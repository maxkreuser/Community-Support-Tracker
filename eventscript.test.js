const {
    validateEventSignup,
    createSignupObject,
    saveEventSignup,
    getSignupRecord
} = require("./eventscript");

describe("Event Signup Unit Tests", () => {

    test("returns false when event name is empty", () => {
        expect(
            validateEventSignup(
                "",
                "Ben",
                "ben@email.com",
                "Sponsor"
            )
        ).toBe(false);
    });

    test("returns false when representative name is empty", () => {
        expect(
            validateEventSignup(
                "Food Drive",
                "",
                "ben@email.com",
                "Sponsor"
            )
        ).toBe(false);
    });

    test("returns false when email is invalid", () => {
        expect(
            validateEventSignup(
                "Food Drive",
                "Ben",
                "invalid-email",
                "Sponsor"
            )
        ).toBe(false);
    });

    test("returns false when role is empty", () => {
        expect(
            validateEventSignup(
                "Food Drive",
                "Ben",
                "ben@email.com",
                ""
            )
        ).toBe(false);
    });

    test("returns true for valid data", () => {
        expect(
            validateEventSignup(
                "Food Drive",
                "Ben",
                "ben@email.com",
                "Sponsor"
            )
        ).toBe(true);
    });

    test("creates correct signup object", () => {
        expect(
            createSignupObject(
                "Food Drive",
                "Ben",
                "ben@email.com",
                "Sponsor"
            )
        ).toEqual({
            eventName: "Food Drive",
            representativeName: "Ben",
            representativeEmail: "ben@email.com",
            role: "Sponsor"
        });
    });

    test("form submission updates temporary data object", () => {
        const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});
        document.body.innerHTML = `
            <form id="event-signup-form"></form>
            <input id="eventName" value="Food Drive">
            <input id="representativeName" value="Ben">
            <input id="representativeEmail" value="ben@email.com">
            <select id="role">
                <option value="Sponsor" selected>Sponsor</option>
            </select>
        `;

        saveEventSignup({
            preventDefault: jest.fn()
        });

        expect(getSignupRecord()).toEqual({
            eventName: "Food Drive",
            representativeName: "Ben",
            representativeEmail: "ben@email.com",
            role: "Sponsor"
        });
        alertSpy.mockRestore();
    });

    test("invalid form submission triggers validation feedback", () => {
        const alertSpy = jest.spyOn(window, "alert").mockImplementation(() => {});

        document.body.innerHTML = `
            <form id="event-signup-form"></form>
            <input id="eventName" value="">
            <input id="representativeName" value="">
            <input id="representativeEmail" value="">
            <select id="role">
                <option value=""></option>
            </select>
        `;

        saveEventSignup({
            preventDefault: jest.fn()
        });

        expect(alertSpy).toHaveBeenCalled();

        alertSpy.mockRestore();
    });

    test("summary section updates based on roles", () => {
    localStorage.setItem("eventSignups", JSON.stringify([
        { eventName: "Event 1", representativeName: "Ben", representativeEmail: "ben@email.com", role: "Sponsor" },
        { eventName: "Event 2", representativeName: "John", representativeEmail: "john@email.com", role: "Participant" },
        { eventName: "Event 3", representativeName: "Mary", representativeEmail: "mary@email.com", role: "Organizer" }
    ]));

    document.body.innerHTML = `
        <span id="sponsor-count">0</span>
        <span id="participant-count">0</span>
        <span id="organizer-count">0</span>
    `;

    jest.resetModules();

    const { updateSummary } = require("./eventscript");

    updateSummary();

    expect(document.getElementById("sponsor-count").textContent).toBe("1");
    expect(document.getElementById("participant-count").textContent).toBe("1");
    expect(document.getElementById("organizer-count").textContent).toBe("1");
});

    test("deleting a record updates localStorage and table", () => {
        localStorage.setItem("eventSignups", JSON.stringify([
            { eventName: "Food Drive", representativeName: "Ben", representativeEmail: "ben@email.com", role: "Sponsor" }
        ]));

        document.body.innerHTML = `
            <table>
                <tbody id="event-table-body"></tbody>
            </table>
            <span id="sponsor-count">0</span>
            <span id="participant-count">0</span>
            <span id="organizer-count">0</span>
        `;

        jest.resetModules();

        const { deleteSignup } = require("./eventscript");

        deleteSignup(0);

        expect(JSON.parse(localStorage.getItem("eventSignups"))).toEqual([]);
        expect(document.getElementById("event-table-body").textContent).not.toContain("Food Drive");
    });

    test("summary updates when a record is deleted", () => {
        localStorage.setItem("eventSignups", JSON.stringify([
            { eventName: "Food Drive", representativeName: "Ben", representativeEmail: "ben@email.com", role: "Sponsor" }
        ]));

        document.body.innerHTML = `
            <table>
                <tbody id="event-table-body"></tbody>
            </table>
            <span id="sponsor-count">0</span>
            <span id="participant-count">0</span>
            <span id="organizer-count">0</span>
        `;

        jest.resetModules();

        const { deleteSignup, updateSummary } = require("./eventscript");

        updateSummary();
        expect(document.getElementById("sponsor-count").textContent).toBe("1");

        deleteSignup(0);

        expect(document.getElementById("sponsor-count").textContent).toBe("0");
    });

    test("table updates after data is added to localStorage", () => {
    localStorage.setItem("eventSignups", JSON.stringify([
        {
            eventName: "Food Drive",
            representativeName: "Ben",
            representativeEmail: "ben@email.com",
            role: "Sponsor"
        }
    ]));

    document.body.innerHTML = `
        <table>
            <tbody id="event-table-body"></tbody>
        </table>
    `;

    jest.resetModules();

    const { populateTable } = require("./eventscript");

    populateTable();

    expect(document.getElementById("event-table-body").textContent)
        .toContain("Food Drive");
});

    test("saved localStorage data is displayed in the table", () => {
        localStorage.setItem("eventSignups", JSON.stringify([
            {
                eventName: "Community Cleanup",
                representativeName: "Ben",
                representativeEmail: "ben@email.com",
                role: "Participant"
            }
        ]));

        document.body.innerHTML = `
            <table>
                <tbody id="event-table-body"></tbody>
            </table>
        `;

        jest.resetModules();

        const { populateTable } = require("./eventscript");

        populateTable();

        expect(document.getElementById("event-table-body").textContent)
            .toContain("Community Cleanup");
    });

});
