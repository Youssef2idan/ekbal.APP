// Dark mode handler
const body = document.querySelector("body");
const modeToggle = document.querySelector(".mode-toggle");

// Check saved mode preference
let getMode = localStorage.getItem("mode");
if(getMode && getMode === "dark") {
    body.classList.toggle("dark");
}

// Toggle dark mode
modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("mode", body.classList.contains("dark") ? "dark" : "light");
});

// Add this at the start of the file
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});

function checkLoginStatus() {
    const loader = document.getElementById('loader');
    const loginContainer = document.querySelector('.login-container');
    
    // Simulate loading delay (you can remove setTimeout if not needed)
    setTimeout(() => {
        const loggedInStudent = JSON.parse(localStorage.getItem('loggedInStudent'));
        
        if (loggedInStudent) {
            // User is already logged in, redirect to index page
            window.location.href = 'index.html';
        } else {
            // User is not logged in, show login form
            loader.style.display = 'none';
            loginContainer.style.display = 'block';
        }
    }, 1500); // 1.5 seconds delay, adjust as needed
}

async function login() {
    const gradeSelect = document.getElementById("gradeSelect");
    const classSelect = document.getElementById("classSelect");
    const studentName = document.getElementById("studentName").value.trim();
    const studentCode = document.getElementById("studentCode").value.trim();
    const mobileNumber = document.getElementById("mobileNumber").value.trim();
    const errorMessage = document.getElementById("errorMessage");
    
    // Clear previous error message
    errorMessage.textContent = "";

    // Validate inputs
    if (!studentName) {
        errorMessage.textContent = "يرجى إدخال اسم الطالب";
        return;
    }

    if (!studentCode) {
        errorMessage.textContent = "يرجى إدخال كود الطالب";
        return;
    }

    if (!mobileNumber || !/^[0-9]{11}$/.test(mobileNumber)) {
        errorMessage.textContent = "يرجى إدخال رقم موبايل صحيح (11 رقم)";
        return;
    }

    if (!gradeSelect.value) {
        errorMessage.textContent = "يرجى اختيار الصف";
        return;
    }

    if (!classSelect.value) {
        errorMessage.textContent = "يرجى اختيار الفصل";
        return;
    }

    try {
        // Load student data based on selected grade
        const response = await fetch(`./Marks/Control/${gradeSelect.value}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const students = await response.json();
        
        // Determine which field to use for student ID based on grade
        const idField = gradeSelect.value === 'm2' ? 'رقم جاوس' : 'كود الطالب';

        // Find student
        const student = students.find(s => String(s[idField]) === String(studentCode));

        if (student) {
            // Store student info and grade in localStorage
            localStorage.setItem("loggedInStudent", JSON.stringify({
                id: student[idField],
                name: studentName, // Use the entered name instead of the one from database
                grade: gradeSelect.value,
                class: classSelect.value,
                mobile: mobileNumber
            }));
            
            // Redirect to index page
            window.location.href = "index.html";
        } else {
            errorMessage.textContent = "كود الطالب غير صحيح";
        }
    } catch (error) {
        console.error("Error during login:", error);
        errorMessage.textContent = "حدث خطأ أثناء تسجيل الدخول. يرجى المحاولة مرة أخرى";
    }
}

// Add this after the dark mode toggle code
document.addEventListener('DOMContentLoaded', () => {
    const getMyDataBtn = document.getElementById('getMyData');
    
    getMyDataBtn.addEventListener('click', () => {
        const loggedInStudent = JSON.parse(localStorage.getItem('loggedInStudent'));
        if (!loggedInStudent) {
            alert('لا توجد بيانات محفوظة');
            return;
        }

        // Auto-fill the form
        document.getElementById('studentName').value = loggedInStudent.name;
        document.getElementById('studentCode').value = loggedInStudent.id;
        document.getElementById('mobileNumber').value = loggedInStudent.mobile;
        document.getElementById('gradeSelect').value = loggedInStudent.grade;
        document.getElementById('classSelect').value = loggedInStudent.class;
    });
});
