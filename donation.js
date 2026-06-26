// State and Persistence

// In-memory array of donations
let donations = [];

/**
 * Load donations from localStorage into memory.
 */
function loadDonations() {
    const saved = localStorage.getItem("donations");
    donations = saved ? JSON.parse(saved) : [];
}

/**
 * Save current donations array to localStorage.
 */
function saveDonations() {
    localStorage.setItem("donations", JSON.stringify(donations));
}


// Form Initialization and Handling

/**
 * Initialize the donation form: validation, submission, and feedback.
 */
function initDonationForm() {
    const donationForm = document.getElementById("donationForm");
    const messageDiv = document.getElementById("message");

    donationForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const charityName = document.getElementById("charityName").value.trim();
        const donationAmount = document.getElementById("donationAmount").value.trim();
        const donationDate = document.getElementById("donationDate").value;
        const comment = document.getElementById("comment").value.trim();

        const errors = [];

        // Basic validation
        if (!charityName) errors.push("Charity Name is required.");
        if (!donationAmount) {
            errors.push("Donation Amount is required.");
        } else if (isNaN(donationAmount)) {
            errors.push("Donation Amount must be a number.");
        } else if (Number(donationAmount) <= 0) {
            errors.push("Donation Amount must be greater than 0.");
        }

        if (!donationDate) errors.push("Date of Donation is required.");

        // Show any errors if any occur
        if (errors.length > 0) {
            messageDiv.innerHTML = `
                <ul class="error-messages">
                    ${errors.map(err => `<li>${err}</li>`).join("")}
                </ul>
            `;
            messageDiv.style.color = "red";
            return;
        }

        // Build new donation object
        const newDonation = {
            charityName,
            donationAmount: Number(donationAmount),
            donationDate,
            comment
        };

        // Add to array and persist
        donations.push(newDonation);
        saveDonations();

        // Re-render table and summary
        populateTable();
        updateSummary();

        // Success message
        messageDiv.textContent = "Donation successfully recorded!";
        messageDiv.style.color = "green";

        // Reset form
        donationForm.reset();
    });
}


// Table Rendering and Summary Calculation

/**
 * Populate the donation table from the donations array.
 */
function populateTable() {
    const table = document.querySelector("table");

    // Reset table header
    table.innerHTML = `
        <tr>
            <th>Charity Name</th>
            <th>Donation<br>Amount</th>
            <th>Date</th>
            <th>Comment<br>Experience</th>
            <th>Remove Donation</th>
        </tr>
    `;

    // Add rows for each donation
    donations.forEach((donation, index) => {
        const row = document.createElement("tr");
        row.classList.add("table-rows");
        row.dataset.index = index;

        row.innerHTML = `
            <td>${donation.charityName}</td>
            <td>${donation.donationAmount}</td>
            <td>${donation.donationDate}</td>
            <td>${donation.comment}</td>
            <td><button class="delete-btn">Delete</button></td>
        `;

        table.appendChild(row);
    });

    // Attach delete handlers after rendering
    attachDeleteHandlers();
}

// Summary Calculation

/**
 * Calculate total donation amount from donations array.
 * Exported for unit testing.
 */
function calculateTotalDonations(donationsArray) {
    return donationsArray.reduce(
        (sum, donation) => sum + Number(donation.donationAmount || 0),
        0
    );
}

/**
 * Update the summary section with the total donation amount.
 */
function updateSummary() {
    const totalSpan = document.getElementById("total-donations");
    const total = calculateTotalDonations(donations);
    totalSpan.textContent = `$${total}`;
}

// Deletion Logic

/**
 * Attach click handlers to all delete buttons in the table.
 */
function attachDeleteHandlers() {
    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            const row = this.closest("tr");
            const index = row.dataset.index;

            // Remove from array
            donations.splice(index, 1);

            // Persist updated array
            saveDonations();

            // Re-render table and summary
            populateTable();
            updateSummary();
        });
    });
}

// Initialization on Page Load

/**
 * Initialize donations feature on page load.
 */
function initDonationsFeature() {
    loadDonations();
    initDonationForm();
    populateTable();
    updateSummary();
}

// Run initialization when script loads
initDonationsFeature();

// Export functions for Jest tests (Node environment)
if (typeof module !== "undefined") {
    module.exports = {
        loadDonations,
        saveDonations,
        populateTable,
        calculateTotalDonations,
        updateSummary,
        initDonationsFeature
    };
}
