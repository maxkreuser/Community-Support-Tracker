// persistence for stage 2
const myObj = {};

myObj["amount"] = 100;
localStorage.setItem('myData', JSON.stringify(myObj));

// Retrieving the object
const retrievedData = JSON.parse(localStorage.getItem('myData'));       
    function initDonationForm() {
        const donationForm = document.getElementById("donationForm");
        const messageDiv = document.getElementById("message");

        const donations = [];

        donationForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const charityName = document.getElementById("charityName").value.trim();
            const donationAmount = document.getElementById("donationAmount").value.trim();
            const donationDate = document.getElementById("donationDate").value;
            const comment = document.getElementById("comment").value.trim();

            const errors = [];

            if (!charityName) errors.push("Charity Name is required.");
            if (!donationAmount) {
                errors.push("Donation Amount is required.");
            } else if (isNaN(donationAmount)) {
                errors.push("Donation Amount must be a number.");
            } else if (Number(donationAmount) <= 0) {
                errors.push("Donation Amount must be greater than 0.");
            }

            if (!donationDate) errors.push("Date of Donation is required.");

            if (errors.length > 0) {
                messageDiv.innerHTML = `
                    <ul class="error-messages">
                        ${errors.map(err => `<li>${err}</li>`).join("")}
                    </ul>
                `;
                messageDiv.style.color = "red";
                return;
            }

            donations.push({
                charityName,
                donationAmount: Number(donationAmount),
                donationDate,
                comment
            });

            messageDiv.textContent = "Donation successfully recorded!";
            messageDiv.style.color = "green";

            donationForm.reset();
        });

        return { donations };
    }

    module.exports = { initDonationForm };
