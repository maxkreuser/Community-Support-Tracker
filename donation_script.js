document.addEventListener("DOMContentLoaded", function () {
    
    const donationForm = document.getElementById("donationForm");
    const messageDiv = document.getElementById("message");

    
    const donations = [];

    
    donationForm.addEventListener("submit", function (event) {
        
        event.preventDefault();

        
        const charityNameInput = document.getElementById("charityName");
        const donationAmountInput = document.getElementById("donationAmount");
        const donationDateInput = document.getElementById("donationDate");
        const commentInput = document.getElementById("comment");

        const charityName = charityNameInput.value.trim();
        const donationAmount = donationAmountInput.value.trim();
        const donationDate = donationDateInput.value;
        const comment = commentInput.value.trim();

        
        const errors = [];

        
        if (!charityName) {
            errors.push("Charity Name is required.");
        }

        
        if (!donationAmount) {
            errors.push("Donation Amount is required.");
        } else if (isNaN(donationAmount)) {
            errors.push("Donation Amount must be a number.");
        } else if (Number(donationAmount) <= 0) {
            errors.push("Donation Amount must be greater than 0.");
        }

        
        if (!donationDate) {
            errors.push("Date of Donation is required.");
        }

        
        if (errors.length > 0) {
            messageDiv.innerHTML = `
                <ul class="error-messages">
                    ${errors.map(err => `<li>${err}</li>`).join("")}
                </ul>
            `;
            messageDiv.style.color = "red";
            return; 
        }

        
        const donationData = {
            charityName: charityName,
            donationAmount: Number(donationAmount),
            donationDate: donationDate,
            comment: comment
        };

        
        donations.push(donationData);

        
        console.log("Current donations:", donations);

        
        messageDiv.textContent = "Donation successfully recorded!";
        messageDiv.style.color = "green";

        
        donationForm.reset();
    });
});
