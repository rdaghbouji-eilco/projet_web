

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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to upload profile picture');
        }

        const result = await response.json();
        document.getElementById('profilePicture').src = `../../uploads/profile_pictures/${result.filename}`;
        alert('Profile picture updated successfully!');
    } catch (error) {
        console.error('Error uploading profile picture:', error);
    }
}

// Load the profile picture on page load
async function loadProfilePicture() {
    if (!apiPaths.get_personal_info) return; // Early return if API path isn't loaded
    try {
        const response = await fetch(apiPaths.get_personal_info, { credentials: 'include' });
        if (!response.ok) throw new Error("Failed to fetch personal info");

        const data = await response.json();
        document.getElementById('profilePicture').src = data.profile_picture 
            ? `../../uploads/profile_pictures/${data.profile_picture}` 
            : "profile-placeholder.png";
    } catch (error) {
        console.error('Error loading profile picture:', error);
    }
}




// Load the username and surname
async function loadUsername() {
    if (!apiPaths.get_user) return; // Early return if API path isn't loaded
    try {
        const response = await fetch(apiPaths.get_user);
        if (!response.ok) throw new Error("Failed to fetch user data");

        const userData = await response.json();
        document.getElementById('name').textContent = userData.name || "N/A";
        document.getElementById('surname').textContent = userData.surname || "N/A";
    } catch (error) {
        console.error('Error loading name surname:', error);
    }
}

// Fetch profile information
async function loadProfileInfo() {
    if (!apiPaths.get_profile) return; // Early return if API path isn't loaded
    try {
        const response = await fetch(apiPaths.get_profile);
        if (!response.ok) throw new Error("Failed to fetch profile info");

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
    if (!apiPaths.get_personal_info) return; // Early return if API path isn't loaded
    try {
        const response = await fetch(apiPaths.get_personal_info);
        if (!response.ok) throw new Error("Failed to fetch personal info");

        const personalData = await response.json();
        document.getElementById('phone').textContent = personalData.phone || "N/A";
        document.getElementById('birthdate').textContent = personalData.birthdate || "N/A";
        document.getElementById('country').textContent = personalData.country || "N/A";
        document.getElementById('profilePicture').src = personalData.profile_picture 
            ? `../../uploads/profile_pictures/${personalData.profile_picture}` 
            : "profile-placeholder.png";
    } catch (error) {
        console.error('Error loading personal info:', error);
    }
}

// Load CV link
async function loadCVLink() {
    if (!apiPaths.get_cv) return; // Early return if API path isn't loaded
    try {
        const response = await fetch(apiPaths.get_cv);
        if (!response.ok) throw new Error("Failed to fetch CV");

        const cvDownloadLink = document.getElementById('cvDownloadLink');
        cvDownloadLink.href = apiPaths.get_cv;
        cvDownloadLink.textContent = "Download CV";
    } catch (error) {
        console.error("Error loading CV link:", error);
    }
}



function openModal(formId) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modal-form-content');
    const formElement = document.getElementById(formId);

    if (!formElement) {
        console.error(`Form with ID "${formId}" not found.`);
        modalContent.innerHTML = '<p>Error: Form not found.</p>';
        return;
    }

    const formClone = formElement.cloneNode(true);
    formClone.style.display = 'block';
    console.log("Cloned form:", formClone); // Check if the form is correctly cloned

    modalContent.innerHTML = '';
    modalContent.appendChild(formClone);

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.type = 'button';
    cancelButton.className = 'custom-button';
    cancelButton.onclick = closeModal;
    formClone.appendChild(cancelButton);

    modal.style.display = 'flex';
}


