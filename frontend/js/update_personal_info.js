// Function to load user's current personal info
async function loadFormPersonalInfo() {
    try {
        const response = await fetch(apiPaths.get_personal_info, {
            method: 'GET',
            credentials: 'include' // Ensure the session cookie is sent with the request
        });

        if (response.ok) {
            const personalInfo = await response.json();

            // Populate the form fields with current data
            document.getElementById('form-phone').value = personalInfo.phone || '';
            document.getElementById('form-birthdate').value = personalInfo.birthdate || '';
            
            
            // Set profile picture if available
            if (personalInfo.profile_picture) {
                document.getElementById('profileImage').src = "../../uploads/profile_pictures/" + personalInfo.profile_picture;
            }
        } else {
            throw new Error('Failed to load personal info');
        }
    } catch (error) {
        console.error('Error loading personal info:', error);
        document.getElementById('errorMessage').textContent = `Error: ${error.message}`;
    }
}

// Function to populate the country dropdown
async function populateCountryDropdown() {
    try {
        const response = await fetch(apiPaths.get_countries, { method: 'GET' });
        const data = await response.json();
        const dropdown = document.getElementById('countryDropdown');

        // Empty the dropdown first
        dropdown.innerHTML = '';

        // Add a default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Sélectionnez un pays';
        dropdown.appendChild(defaultOption);

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.ID;
            option.textContent = item.country;
            dropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching countries:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Handle form submission with profile picture
    document.getElementById('personalInfoForm').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
        
        // Collect values
        const phone = document.getElementById('form-phone').value || '';
        const birthdate = document.getElementById('form-birthdate').value || '';
        const country = document.getElementById('countryDropdown').value || '';

        console.log('Phone:', phone);
        console.log('Birthdate:', birthdate);
        console.log('Country:', country);

        // Prepare FormData
        const formData = new FormData();
        formData.append('phone', phone);
        formData.append('birthdate', birthdate);
        formData.append('country', country);

        // Add the profile picture if a file is selected
        const profilePictureInput = document.getElementById('profilePictureInput');
        console.log('Profile Picture Input Element:', profilePictureInput);

        if (profilePictureInput.files.length > 0) {
            formData.append('profile_picture', profilePictureInput.files[0]);
        }

        try {
            const response = await fetch(apiPaths.update_personal_info, {
                method: 'POST',
                credentials: 'include', // Ensure the session is linked to the user
                body: formData // Send form data, including the file
            });

            const result = await response.json();

            if (response.ok) {
                alert('Personal information updated successfully');
                location.reload();
                // Update profile picture preview if available
                if (result.profile_picture_url) {
                    document.getElementById('FormprofilePicture').src = result.profile_picture_url;
                }
            } else {
                throw new Error(result.message || 'Error updating personal info');
            }
        } catch (error) {
            console.error('Error updating personal info:', error);
            document.getElementById('errorMessage').textContent = error.message;
        }
    });
});


function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

async function loadPersonalInfoModal() {
    try {
        console.log('Loading personal info modal...');
        await loadFormPersonalInfo(); // Load personal info
        await populateCountryDropdown(); // Populate country dropdown
        console.log('Personal info modal loaded successfully.');
    } catch (error) {
        console.error('Error loading personal info modal:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const updateProfileBtn = document.getElementById('update-info-btn'); // Ensure the button ID is correct
    const popupProfile = document.getElementById('popup-info'); // The modal element
    const overlayProfile = document.getElementById('overlay-info'); // The overlay element
    const closeProfileBtn = document.querySelector('#popup-info .close-button'); // The close button inside the modal

    // Function to open the modal
    function openPopup() {
        console.log('Opening modal');
        popupProfile.classList.add('active'); // Add the "active" class to show the modal
        overlayProfile.classList.add('active'); // Add the "active" class to show the overlay
    }

    // Function to close the modal
    function closePopup() {
        console.log('Close function triggered');
        popupProfile.classList.remove('active'); // Remove the "active" class to hide the modal
        overlayProfile.classList.remove('active'); // Remove the "active" class to hide the overlay
    }
    console.log('Update Profile button found with ID:', updateProfileBtn.id);

    // Add event listeners
    if (updateProfileBtn) {
        updateProfileBtn.addEventListener('click', async function () {
            await loadApiPaths(); // Ensure API paths are loaded
            await loadPersonalInfoModal(); // Load modal data lazily
            document.getElementById('popup-info').classList.add('active'); // Show modal
        });
    } else {
        console.error('Update Profile button not found!');
    }

    if (overlayProfile) {
        overlayProfile.addEventListener('click', closePopup); // Close modal when clicking on the overlay
    } else {
        console.error('Overlay not found!');
    }

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', closePopup); // Close modal when clicking the close button
    } else {
        console.error('Close button not found!');
    }


});


// Close modal when clicking outside the content
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
};
