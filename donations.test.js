/**
 * @jest-environment jsdom
 */

const { initDonationForm } = require("./donation");

describe("Donation Form Unit Tests", () => {

    let donationForm, messageDiv, donationsRef;

    beforeEach(() => {
        document.body.innerHTML = `
            <form id="donationForm">
                <input id="charityName" />
                <input id="donationAmount" />
                <input id="donationDate" type="date" />
                <textarea id="comment"></textarea>
                <button type="submit">Submit</button>
            </form>
            <div id="message"></div>
        `;

        // Initialize form logic AFTER DOM is ready
        donationsRef = initDonationForm();

        donationForm = document.getElementById("donationForm");
        messageDiv = document.getElementById("message");
    });

    test("shows errors when required fields are empty", () => {
        donationForm.dispatchEvent(new Event("submit"));

        expect(messageDiv.innerHTML).toContain("Charity Name is required.");
        expect(messageDiv.innerHTML).toContain("Donation Amount is required.");
        expect(messageDiv.innerHTML).toContain("Date of Donation is required.");
        expect(messageDiv.style.color).toBe("red");
    });

    test("shows error when donation amount is not a number", () => {
        document.getElementById("charityName").value = "Red Cross";
        document.getElementById("donationAmount").value = "abc";
        document.getElementById("donationDate").value = "2024-01-01";

        donationForm.dispatchEvent(new Event("submit"));

        expect(messageDiv.innerHTML).toContain("Donation Amount must be a number.");
    });

    test("shows error when donation amount is zero or negative", () => {
        document.getElementById("charityName").value = "Red Cross";
        document.getElementById("donationAmount").value = "-10";
        document.getElementById("donationDate").value = "2024-01-01";

        donationForm.dispatchEvent(new Event("submit"));

        expect(messageDiv.innerHTML).toContain("Donation Amount must be greater than 0.");
    });

    test("successful submission displays success message", () => {
        document.getElementById("charityName").value = "Red Cross";
        document.getElementById("donationAmount").value = "50";
        document.getElementById("donationDate").value = "2024-01-01";
        document.getElementById("comment").value = "Keep up the good work";

        donationForm.dispatchEvent(new Event("submit"));

        expect(messageDiv.textContent).toBe("Donation successfully recorded!");
        expect(messageDiv.style.color).toBe("green");
    });

    test("form resets after successful submission", () => {
        const charity = document.getElementById("charityName");
        const amount = document.getElementById("donationAmount");
        const date = document.getElementById("donationDate");
        const comment = document.getElementById("comment");

        charity.value = "Red Cross";
        amount.value = "100";
        date.value = "2024-01-01";
        comment.value = "Nice";

        donationForm.dispatchEvent(new Event("submit"));

        expect(charity.value).toBe("");
        expect(amount.value).toBe("");
        expect(date.value).toBe("");
        expect(comment.value).toBe("");
    });

    test("donation is added to donations array", () => {
        document.getElementById("charityName").value = "UNICEF";
        document.getElementById("donationAmount").value = "75";
        document.getElementById("donationDate").value = "2024-02-10";
        document.getElementById("comment").value = "Blessings";

        donationForm.dispatchEvent(new Event("submit"));

        expect(donationsRef.donations.length).toBe(1);
        expect(donationsRef.donations[0]).toEqual({
            charityName: "UNICEF",
            donationAmount: 75,
            donationDate: "2024-02-10",
            comment: "Blessings"
        });
    });

});
