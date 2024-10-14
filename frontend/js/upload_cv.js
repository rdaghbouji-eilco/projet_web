document.getElementById('cvUploadForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form from submitting the default way

    const formData = new FormData();
    const fileInput = document.getElementById('cv');

    // Append the selected file to the FormData object
    formData.append('cv', fileInput.files[0]);

    try {
        const response = await fetch('/projet_web/api/profile/upload_cv.php', {
            method: 'POST',
            body: formData // FormData object to handle file upload
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('uploadStatus').textContent = 'CV uploaded successfully!';
        } else {
            throw new Error(result.message || 'Failed to upload CV.');
        }
    } catch (error) {
        document.getElementById('uploadStatus').textContent = `Error: ${error.message}`;
    }
});
