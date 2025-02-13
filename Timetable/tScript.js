// Add this at the top of the file, outside any other functions
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

document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.querySelector('.mode-toggle');
    const body = document.querySelector('body');
    const gradeSelect = document.getElementById('gradeSelect');
    const classSelect = document.getElementById('classSelect');
    const defaultText = document.getElementById('default-text');
    const getMyDataBtn = document.getElementById('getMyData');

    // Dark mode handler
    let getMode = localStorage.getItem("mode");
    if(getMode && getMode === "dark") {
        body.classList.toggle("dark");
    }

    modeToggle.addEventListener("click", () => {
        body.classList.toggle("dark");
        localStorage.setItem("mode", body.classList.contains("dark") ? "dark" : "light");
    });

    // Enable class select when grade is selected
    gradeSelect.addEventListener('change', () => {
        classSelect.disabled = !gradeSelect.value;
        if (!gradeSelect.value) {
            classSelect.value = '';
            hideAllTimetables();
            defaultText.style.display = 'block';
        }
    });

    // Show timetable when both grade and class are selected
    function updateTimetable() {
        const grade = gradeSelect.value;
        const classLetter = classSelect.value;

        if (grade && classLetter) {
            const timetableId = `${grade}${classLetter}-timetable`;
            hideAllTimetables();
            const selectedTimetable = document.getElementById(timetableId);
            if (selectedTimetable) {
                selectedTimetable.style.display = 'block';
                defaultText.style.display = 'none';
            }
        }
    }

    function hideAllTimetables() {
        const timetables = document.querySelectorAll('.timetable-image');
        timetables.forEach(timetable => {
            timetable.style.display = 'none';
        });
    }

    // Event listeners for select changes
    gradeSelect.addEventListener('change', updateTimetable);
    classSelect.addEventListener('change', updateTimetable);

    // Initialize with all timetables hidden
    hideAllTimetables();

    // Add My Data button handler
    getMyDataBtn.addEventListener('click', () => {
        const loggedInStudent = JSON.parse(localStorage.getItem('loggedInStudent'));
        if (!loggedInStudent) {
            alert('Please log in first');
            return;
        }

        // Auto-select the grade
        gradeSelect.value = loggedInStudent.grade;
        // Enable class select
        classSelect.disabled = false;
        // Auto-select the class
        classSelect.value = loggedInStudent.class;
        // Update timetable display
        updateTimetable();
    });
});
