function openForm() {
    document.getElementById("popupForm").style.display = "flex";
}

function closeForm() {
    document.getElementById("popupForm").style.display = "none";
}

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById("yatraForm");
    const submitBtn = form.querySelector('.submit-btn');

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = "Submitting...";

        const scriptURL = 'https://script.google.com/macros/s/AKfycbxODUeFAAlMg19pvPZhYxLJ619rmpkEbzfDNrysXksCE3jygg-ZHfMpFf6_lZhI57Qa/exec';


        const formData = new FormData(form);
        const params = new URLSearchParams(formData);

        fetch(scriptURL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString()
        })
            .then(() => {
                alert("✅ Application submitted successfully! We'll get back to you soon.");
                form.reset();
                closeForm();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert("❌ Something went wrong. Please try again or contact us directly.");
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit Application";
            });
    });
});
