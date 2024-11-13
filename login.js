// Function to switch between tabs
function openTab(event, tabName) {
    let tabLinks = document.getElementsByClassName("tab-link");
    let tabContents = document.getElementsByClassName("tab-content");

    // Hide all tab contents and remove active class from tabs
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].classList.remove("active");
    }

    // Show the selected tab content and add active class to the clicked tab
    document.getElementById(tabName).classList.add("active");
    event.currentTarget.classList.add("active");
}

// Function to simulate login
function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username && password) {
        alert("Logged in successfully!");
    } else {
        alert("Please enter both username and password.");
    }
}

// Function to simulate signup
function signup() {
    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (username && email && password) {
        alert("Signup successful!");
    } else {
        alert("Please fill in all fields.");
    }
}
