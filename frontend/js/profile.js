// Function to load user's profile information
async function loadProfile() {
    try {
        const response = await fetch('/projet_web/api/profile/get_profile_pro.php', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const profileData = await response.json();

            // Populate the profile section
            document.getElementById('educationLevel').textContent = profileData.education_level;
            document.getElementById('field').textContent = profileData.field;
            document.getElementById('currentSituation').textContent = profileData.current_situation;
            document.getElementById('experienceLevel').textContent = profileData.experience_level;
            document.getElementById('handicap').textContent = profileData.handicap;
            document.getElementById('currentDegree').textContent = profileData.current_degree;
            document.getElementById('graduationYear').textContent = profileData.expected_graduation_year;
        } else {
            throw new Error('Failed to load profile');
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Function to load personal information
async function loadPersonalInfo() {
    try {
        const response = await fetch('/projet_web/api/profile/get_personal_info.php', {
            method: 'GET',
            credentials: 'include'
        });

        if (response.ok) {
            const personalInfo = await response.json();

            // Populate the personal info section
            document.getElementById('phone').textContent = personalInfo.phone;
            document.getElementById('birthdate').textContent = personalInfo.birthdate;
            document.getElementById('country').textContent = personalInfo.country;
        } else {
            throw new Error('Failed to load personal info');
        }
    } catch (error) {
        console.error('Error loading personal info:', error);
    }
}

// Function to load CV information
async function loadCV() {
    const cvDownloadLink = document.getElementById('cvDownloadLink');
    const userID = 1; // You can dynamically set this from session or user context
    cvDownloadLink.href = `/projet_web/api/cv/get_cv.php?user_id=${userID}`;
}

// Function to handle section switching (tabs functionality)
function setupTabs() {
    const tabs = document.querySelectorAll('#tabs li a');
    const sections = document.querySelectorAll('.tabContent');

    tabs.forEach(tab => {
        tab.addEventListener('click', function(event) {
            event.preventDefault();

            // Hide all sections
            sections.forEach(section => section.style.display = 'none');

            // Show the section related to the clicked tab
            const sectionToShow = document.getElementById(this.dataset.section);
            sectionToShow.style.display = 'block';
        });
    });
}

// Load all the information when the page loads and setup tabs
window.onload = async function() {
    await loadProfile();
    await loadPersonalInfo();
    await loadCV();
    setupTabs(); // Initialize the tab functionality
};
