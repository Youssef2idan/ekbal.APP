document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const loggedInStudent = JSON.parse(localStorage.getItem('loggedInStudent'));
    if (!loggedInStudent) {
        window.location.href = '../login.html';
        return;
    }

    const modal = document.getElementById('registrationModal');
    const joinButtons = document.querySelectorAll('.join-btn');
    const closeModal = document.querySelector('.close-modal');
    const registrationForm = document.getElementById('registrationForm');
    const activityNameInput = document.getElementById('activityName');
    
    // Dark mode handler
    const modeToggle = document.querySelector('.mode-toggle');
    const body = document.querySelector('body');
    
    let getMode = localStorage.getItem("mode");
    if(getMode && getMode === "dark") {
        body.classList.toggle("dark");
    }

    modeToggle.addEventListener("click", () => {
        body.classList.toggle("dark");
        localStorage.setItem("mode", body.classList.contains("dark") ? "dark" : "light");
    });

    // More menu functionality
    const moreButton = document.getElementById('moreBtn');
    const moreMenu = document.getElementById('moreMenu');
    const closeMenu = document.getElementById('closeMenu');

    moreButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        moreMenu.classList.add('active');
    });

    closeMenu.addEventListener('click', () => {
        moreMenu.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
        if (!moreMenu.contains(e.target) && !moreButton.contains(e.target)) {
            moreMenu.classList.remove('active');
        }
    });

    // Modal handlers
    joinButtons.forEach(button => {
        button.addEventListener('click', () => {
            const activityName = button.dataset.activity;
            activityNameInput.value = activityName;
            modal.classList.add('active');
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Form submission
    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            activityName: activityNameInput.value,
            studentName: document.getElementById('studentName').value,
            studentCode: document.getElementById('studentCode').value,
            phoneNumber: document.getElementById('phoneNumber').value
        };

        // Email template
        const emailBody = `
            New Activity Registration:
            
            Activity: ${formData.activityName}
            Student Name: ${formData.studentName}
            Student Code: ${formData.studentCode}
            Phone Number: ${formData.phoneNumber}
        `;

        try {
            // Send email using SMTP.js
            await Email.send({
                SecureToken: "YOUR_SMTP_SECURE_TOKEN", // Get this from SMTP.js
                To: 'zidan2dev@gmail.com',
                From: "your-email@domain.com", // Your sender email
                Subject: `New Registration for ${formData.activityName}`,
                Body: emailBody
            });

            alert('Registration submitted successfully!');
            modal.classList.remove('active');
            registrationForm.reset();
        } catch (error) {
            console.error('Error sending email:', error);
            alert('There was an error submitting your registration. Please try again.');
        }
    });

    // Add this inside your DOMContentLoaded event listener
    const getMyDataBtn = document.getElementById('getMyData');

    getMyDataBtn.addEventListener('click', () => {
        const loggedInStudent = JSON.parse(localStorage.getItem('loggedInStudent'));
        if (!loggedInStudent) {
            alert('Please log in first');
            return;
        }

        // Auto-fill the form
        document.getElementById('studentName').value = loggedInStudent.name;
        document.getElementById('studentCode').value = loggedInStudent.id;
        document.getElementById('phoneNumber').value = loggedInStudent.mobile;
    });
});
