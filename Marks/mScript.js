// Dark mode and menu handlers
const body = document.querySelector("body");
const modeToggle = document.querySelector(".mode-toggle");
const moreButton = document.getElementById('moreBtn');
const moreMenu = document.getElementById('moreMenu');
const closeMenu = document.getElementById('closeMenu');
const resultsContainer = document.getElementById('resultsContainer');

// Check saved mode preference
let getMode = localStorage.getItem("mode");
if(getMode && getMode === "dark") {
    body.classList.add("dark");
}

// Toggle dark mode
modeToggle.addEventListener("click", () => {
    body.classList.toggle("dark");
    localStorage.setItem("mode", body.classList.contains("dark") ? "dark" : "light");
});

// More menu handlers
moreButton?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    moreMenu.classList.add('active');
});

closeMenu?.addEventListener('click', () => {
    moreMenu.classList.remove('active');
});

document.addEventListener('click', (e) => {
    if (!moreMenu?.contains(e.target) && !moreButton?.contains(e.target)) {
        moreMenu?.classList.remove('active');
    }
});

// Marks functionality
document.addEventListener('DOMContentLoaded', () => {
    const gradeSelect = document.getElementById('gradeSelect');
    const studentCode = document.getElementById('studentCode');
    const getMarksBtn = document.getElementById('getMarks');
    const getMyDataBtn = document.getElementById('getMyData');

    // Get marks handler
    getMarksBtn.addEventListener('click', async () => {
        const grade = gradeSelect.value;
        const code = studentCode.value.trim();

        if (!grade || !code) {
            alert('Please select a grade and enter a student code');
            return;
        }

        fetchAndDisplayMarks(grade, code);
    });

    // My Data handler
    getMyDataBtn.addEventListener('click', () => {
        const loggedInStudent = JSON.parse(localStorage.getItem('loggedInStudent'));
        if (!loggedInStudent) {
            alert('Please log in first');
            return;
        }

        // Auto-select the grade
        gradeSelect.value = loggedInStudent.grade;
        // Auto-fill the student code
        studentCode.value = loggedInStudent.id;
        // Fetch the marks
        fetchAndDisplayMarks(loggedInStudent.grade, loggedInStudent.id);
    });
});

async function fetchAndDisplayMarks(grade, code) {
    try {
        const response = await fetch(`./Control/${grade}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        const idField = grade === 'm2' ? 'رقم جاوس' : 'كود الطالب';
        const student = data.find(s => String(s[idField]) === String(code));

        if (!student) {
            alert('Student not found. Please check your student code.');
            return;
        }

        displayResults(student);
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching student data. Please try again.');
    }
}

function displayResults(student) {
    const subjects = [
        'Arabic', 'English', 'Math', 'Science', 
        'Social studies', 'H.L', 'ART', 'Computer', 
        'Religion', 'French'
    ];

    let html = `
        <div class="student-info">
            <h2>${student.اسم}</h2>
            <button id="downloadBtn" class="download-btn">
                <svg class="download-icon" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Download Results
            </button>
        </div>
        <div class="marks-grid">
    `;

    subjects.forEach(subject => {
        html += `
            <div class="mark-item">
                <span class="subject">${subject}</span>
                <span class="mark ${getMarkClass(student[subject])}">${student[subject]}</span>
            </div>
        `;
    });

    html += '</div>';
    
    resultsContainer.innerHTML = html;
    resultsContainer.classList.add('active');

    // Add download functionality
    document.getElementById('downloadBtn')?.addEventListener('click', () => {
        // Create a clone of the results container for capturing
        const elementToCapture = resultsContainer.cloneNode(true);
        elementToCapture.style.padding = '2rem';
        elementToCapture.style.background = getComputedStyle(document.body).getPropertyValue('--panel-color');
        elementToCapture.style.position = 'absolute';
        elementToCapture.style.left = '-9999px';
        elementToCapture.style.display = 'block';
        document.body.appendChild(elementToCapture);

        // Use html2canvas to capture the element
        html2canvas(elementToCapture, {
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--panel-color'),
            scale: 2
        }).then(canvas => {
            // Remove the cloned element
            document.body.removeChild(elementToCapture);

            // Convert to image and download
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.download = `marks_${student.اسم}.png`;
            link.href = image;
            link.click();
        });
    });
}

function getMarkClass(mark) {
    const numMark = parseFloat(mark);
    if (isNaN(numMark)) return '';
    if (numMark >= 14) return 'excellent';
    if (numMark >= 12) return 'very-good';
    if (numMark >= 10) return 'good';
    return 'needs-improvement';
}
