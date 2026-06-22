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

});