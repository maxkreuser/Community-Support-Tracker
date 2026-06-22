const {
    validateEventSignup,
    createSignupObject
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

});