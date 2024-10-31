// Load API paths from api_loader.js before proceeding
let apiPaths = {};

// Function to load the API paths from the JSON file (api_loader)
async function loadApiPaths() {
    try {
        const response = await fetch('../../config/api_paths.json'); // Adjust the path if necessary
        if (!response.ok) {
            throw new Error('Failed to load API paths');
        }
        apiPaths = await response.json(); // Store the API paths for later use
    } catch (error) {
        console.error('Error loading API paths:', error);
    }
}
async function uploadProfilePicture() {
    const fileInput = document.getElementById('profilePictureInput');
    const formData = new FormData();
    formData.append('profile_picture', fileInput.files[0]);

    try {
        const response = await fetch(apiPaths.upload_profile_picture, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            // Update the profile picture display
            document.getElementById('profileImage').src = `../../uploads/profile_pictures/${result.filename}`;
            alert('Profile picture updated successfully!');
        } else {
            throw new Error(result.message || 'Failed to upload profile picture');
        }
    } catch (error) {
        console.error('Error uploading profile picture:', error);
    }
}

// Function to load the profile picture on page load
async function loadProfilePicture() {
    try {
        const response = await fetch(apiPaths.get_personal_info, { credentials: 'include' });
        const data = await response.json();
        
        if (data.profile_picture) {
            document.getElementById('profileImage').src = `../../uploads/profile_pictures/${data.profile_picture}`;
        }
    } catch (error) {
        console.error('Error loading profile picture:', error);
    }
}

// Load profile and personal information when the page loads
window.onload = async function() {
    await loadApiPaths();  // Load API paths first

    // Load user information
    await loadUsername();
    await loadProfileInfo();
    await loadPersonalInfo();
    await loadProfilePicture();
    await loadCVLink();  // Load CV link dynamically
};

// Load the username and surname
async function loadUsername() {
    try {
        const response = await fetch(apiPaths.get_user); // Use dynamic API path from api_paths.json
        const userData = await response.json();
        document.getElementById('name').textContent = userData.name || "N/A";
        document.getElementById('surname').textContent = userData.surname || "N/A";
    } catch (error) {
        console.error('Error loading name surname:', error);
    }
}

// Fetch profile information
async function loadProfileInfo() {
    try {
        const response = await fetch(apiPaths.get_profile); // Use dynamic API path from api_paths.json
        const profileData = await response.json();
        
        // Use fallback values for undefined fields
        document.getElementById('educationLevel').textContent = profileData.education_level || "N/A";
        document.getElementById('field').textContent = profileData.field || "N/A";
        document.getElementById('currentSituation').textContent = profileData.current_situation || "N/A";
        document.getElementById('experienceLevel').textContent = profileData.experience_level || "N/A";
        document.getElementById('handicap').textContent = profileData.handicap ? "Yes" : "No";
        document.getElementById('currentDegree').textContent = profileData.current_degree || "N/A";
        document.getElementById('graduationYear').textContent = profileData.expected_graduation_year || "N/A";
    } catch (error) {
        console.error('Error loading profile info:', error);
    }
}


// Fetch personal information including profile picture
async function loadPersonalInfo() {
    try {
        const response = await fetch(apiPaths.get_personal_info);
        const personalData = await response.json();

        document.getElementById('phone').textContent = personalData.phone || "N/A";
        document.getElementById('birthdate').textContent = personalData.birthdate || "N/A";
        document.getElementById('country').textContent = personalData.country || "N/A";

        // Set the profile picture if it exists
        const profilePicture = document.getElementById('profilePicture');
        profilePicture.src = personalData.profile_picture_url || "profile-placeholder.png";
    } catch (error) {
        console.error('Error loading personal info:', error);
    }
}

async function loadCVLink() {
    try {
        const response = await fetch(apiPaths.get_cv);
        
        if (response.ok) {
            // Set the link to the CV file download path
            const cvDownloadLink = document.getElementById('cvDownloadLink');
            cvDownloadLink.href = apiPaths.get_cv; // Set to direct download
            cvDownloadLink.textContent = "Download CV";
        } else {
            // If not OK, check if it’s a JSON error message
            const errorData = await response.json();
            console.error("Error loading CV link:", errorData.message);
        }
    } catch (error) {
        console.error("Error loading CV link:", error);
    }
}

