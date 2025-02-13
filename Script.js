// Add this at the start of your DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const loggedInStudent = JSON.parse(localStorage.getItem('loggedInStudent'));
    if (!loggedInStudent) {
        // If not logged in, redirect to login page
        window.location.href = 'login.html';
        return;
    }

    // Set initial random quote
    setRandomQuote();

    // Setup timer controls
    document.getElementById('start-timer').addEventListener('click', startTimer);
    document.getElementById('reset-timer').addEventListener('click', resetTimer);

    // Setup timer mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const minutes = parseInt(e.target.dataset.time);
            timeLeft = minutes * 60;
            totalTime = timeLeft; // Update total time when changing modes
            updateTimer();
            clearInterval(timerId);
            timerId = null;
            document.getElementById('start-timer').textContent = 'Start';
        });
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Show confirmation dialog
            const confirmLogout = confirm('Are you sure you want to logout?');
            
            if (confirmLogout) {
                // Clear the logged in student data
                localStorage.removeItem('loggedInStudent');
                
                // Redirect to login page
                window.location.href = 'login.html';
            }
        });
    }

    // Add handlers for other menu items
    const challengesBtn = document.querySelector('.menu-item:nth-child(4)');
    if (challengesBtn) {
        challengesBtn.addEventListener('click', () => {
            alert('Challenges feature coming soon!');
        });
    }

    const howToUseBtn = document.querySelector('.menu-item:nth-child(5)');
    if (howToUseBtn) {
        howToUseBtn.addEventListener('click', () => {
            alert('Welcome to our app! Navigate through different sections using the bottom menu. Access your personal data using the "My Data" button. For more help, please contact support.');
        });
    }
});

const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle");

let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}

modeToggle.addEventListener("click", () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
});

// Quotes Array
const quotes = [
    { text: "Education is not preparation for life; education is life itself.", author: "John Dewey" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
    { text: "Learning is not attained by chance, it must be sought for with ardor and attended to with diligence.", author: "Abigail Adams" }
];

// Set Random Quote
function setRandomQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote-text').textContent = `"${randomQuote.text}"`;
    document.getElementById('quote-author').textContent = `- ${randomQuote.author}`;
}

// Pomodoro Timer
let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let totalTime = 25 * 60; // Keep track of total time for progress

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer-display').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Update the progress circle
    const progress = (timeLeft / totalTime) * 100;
    const timerCircle = document.querySelector('.timer-circle');
    timerCircle.style.background = `conic-gradient(var(--secondary-color) ${100 - progress}%, transparent ${100 - progress}%)`;
}

function startTimer() {
    if (timerId === null) {
        timerId = setInterval(() => {
            timeLeft--;
            updateTimer();
            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                document.getElementById('start-timer').textContent = 'Start';
                // Play notification sound or vibrate
                if ('vibrate' in navigator) {
                    navigator.vibrate([200, 100, 200]);
                }
                alert('Time is up!');
            }
        }, 1000);
        document.getElementById('start-timer').textContent = 'Pause';
    } else {
        clearInterval(timerId);
        timerId = null;
        document.getElementById('start-timer').textContent = 'Start';
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    timeLeft = totalTime;
    updateTimer();
    document.getElementById('start-timer').textContent = 'Start';
}

// More Menu Functionality
const moreButton = document.querySelector('.nav-link:last-child');
const moreMenu = document.getElementById('moreMenu');
const closeMenu = document.getElementById('closeMenu');

moreButton.addEventListener('click', () => {
    moreMenu.classList.add('active');
});

closeMenu.addEventListener('click', () => {
    moreMenu.classList.remove('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!moreMenu.contains(e.target) && !moreButton.contains(e.target)) {
        moreMenu.classList.remove('active');
    }
});