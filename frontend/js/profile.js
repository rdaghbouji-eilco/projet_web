let apiPaths = {}; // Global variable to store the API paths

// Function to load the API paths from the JSON file
async function loadApiPaths() {
    try {
        const response = await fetch('../../config/api_paths.json');
        if (!response.ok) {
            throw new Error('Failed to load API paths');
        }
        apiPaths = await response.json();
    } catch (error) {
        console.error('Error loading API paths:', error);
    }
}

// Function to upload a new profile picture
async function uploadProfilePicture() {
    const fileInput = document.getElementById('profilePictureInput');
    if (!fileInput.files[0]) {
        alert("Please select a file to upload.");
        return;
    }

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
            document.getElementById('profilePicture').src = `../../uploads/profile_pictures/${result.filename}`;
            alert('Profile picture updated successfully!');
        } else {
            throw new Error(result.message || 'Failed to upload profile picture');
        }
    } catch (error) {
        console.error('Error uploading profile picture:', error);
    }
}

// Load the profile picture on page load
async function loadProfilePicture() {
    try {
        const response = await fetch(apiPaths.get_personal_info, { credentials: 'include' });
        const data = await response.json();
        
        if (data.profile_picture) {
            document.getElementById('profilePicture').src = `../../uploads/profile_pictures/${data.profile_picture}`;
        } else {
            document.getElementById('profilePicture').src = "profile-placeholder.png";
        }
    } catch (error) {
        console.error('Error loading profile picture:', error);
    }
}

// Load profile and personal information when the page loads
window.onload = async function() {
    await loadApiPaths();
    await loadUsername();
    await loadProfileInfo();
    await loadPersonalInfo();
    await loadProfilePicture();
    await loadCVLink();
};

// Load the username and surname
async function loadUsername() {
    try {
        const response = await fetch(apiPaths.get_user);
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
        const response = await fetch(apiPaths.get_profile);
        const profileData = await response.json();
        
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
        profilePicture.src = personalData.profile_picture_url 
            ? `../../uploads/profile_pictures/${personalData.profile_picture_url}` 
            : "profile-placeholder.png";
    } catch (error) {
        console.error('Error loading personal info:', error);
    }
}

// Load CV link
async function loadCVLink() {
    try {
        const response = await fetch(apiPaths.get_cv);
        
        if (response.ok) {
            const cvDownloadLink = document.getElementById('cvDownloadLink');
            cvDownloadLink.href = apiPaths.get_cv;
            cvDownloadLink.textContent = "Download CV";
        } else {
            const errorData = await response.json();
            console.error("Error loading CV link:", errorData.message);
        }
    } catch (error) {
        console.error("Error loading CV link:", error);
    }
}
