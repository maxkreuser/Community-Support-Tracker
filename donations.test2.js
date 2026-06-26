const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");

// Load HTML for DOM-based tests
const html = fs.readFileSync(
    path.resolve(__dirname, "../index.html"),
    "utf8"
);

let window;
let document;
let donationsModule;

beforeEach(() => {
    // Create DOM environment
    window = new JSDOM(html, { url: "http://localhost" }).window;
    document = window.document;

    // Mock global objects
    global.window = window;
    global.document = document;
    global.localStorage = window.localStorage;

    // Require module after globals are set
    donationsModule = require("../donations.js");
});

afterEach(() => {
    // Clear localStorage between tests
    localStorage.clear();
});

// Unit Test: calculateTotalDonations

test("calculateTotalDonations correctly sums donation amounts", () => {
    const { calculateTotalDonations } = donationsModule;

    const sampleDonations = [
        { donationAmount: 50 },
        { donationAmount: 100 },
        { donationAmount: 25.5 }
    ];

    const total = calculateTotalDonations(sampleDonations);
    expect(total).toBe(175.5);
});

// Integration: table updates after localStorage data

test("donation table updates correctly after data is added to localStorage", () => {
    const { initDonationsFeature } = donationsModule;

    // Seed localStorage with donations
    const seedDonations = [
        {
            charityName: "Charity A",
            donationAmount: 100,
            donationDate: "2026-06-01",
            comment: "Great cause"
        },
        {
            charityName: "Charity B",
            donationAmount: 50,
            donationDate: "2026-06-02",
            comment: "Happy to help"
        }
    ];

    localStorage.setItem("donations", JSON.stringify(seedDonations));

    // Initialize feature (should load and render table)
    initDonationsFeature();

    const rows = document.querySelectorAll("table tr.table-rows");
    expect(rows.length).toBe(2);
    expect(rows[0].children[0].textContent).toBe("Charity A");
    expect(rows[1].children[0].textContent).toBe("Charity B");
});

// Integration: data persisted is displayed in table

test("data persisted in localStorage is correctly retrieved and displayed", () => {
    const { initDonationsFeature } = donationsModule;

    const seedDonations = [
        {
            charityName: "Charity C",
            donationAmount: 200,
            donationDate: "2026-06-03",
            comment: "Important work"
        }
    ];

    localStorage.setItem("donations", JSON.stringify(seedDonations));

    initDonationsFeature();

    const row = document.querySelector("table tr.table-rows");
    expect(row.children[0].textContent).toBe("Charity C");
    expect(row.children[1].textContent).toBe("200");
});

// Unit/Integration: deletion updates localStorage and table


test("deleting a record updates localStorage and table correctly", () => {
    const { initDonationsFeature } = donationsModule;

    const seedDonations = [
        {
            charityName: "Charity D",
            donationAmount: 75,
            donationDate: "2026-06-04",
            comment: "Nice"
        }
    ];

    localStorage.setItem("donations", JSON.stringify(seedDonations));

    initDonationsFeature();

    // Click delete button
    const deleteBtn = document.querySelector(".delete-btn");
    deleteBtn.click();

    // Table should have no data rows
    const rows = document.querySelectorAll("table tr.table-rows");
    expect(rows.length).toBe(0);

    // localStorage should be updated
    const stored = JSON.parse(localStorage.getItem("donations"));
    expect(stored.length).toBe(0);
});


// Unit/Integration: total updates when record deleted


test("total donation amount updates when a record is deleted", () => {
    const { initDonationsFeature } = donationsModule;

    const seedDonations = [
        {
            charityName: "Charity E",
            donationAmount: 100,
            donationDate: "2026-06-05",
            comment: "First"
        },
        {
            charityName: "Charity F",
            donationAmount: 50,
            donationDate: "2026-06-06",
            comment: "Second"
        }
    ];

    localStorage.setItem("donations", JSON.stringify(seedDonations));

    initDonationsFeature();

    // Initial total should be 150
    let totalSpan = document.getElementById("total-donations");
    expect(totalSpan.textContent).toBe("$150");

    // Delete one record
    const deleteBtn = document.querySelectorAll(".delete-btn")[0];
    deleteBtn.click();

    // Total should update to 50
    totalSpan = document.getElementById("total-donations");
    expect(totalSpan.textContent).toBe("$50");
});
