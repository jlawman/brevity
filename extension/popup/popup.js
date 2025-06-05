document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('saveButton');
  const statusDiv = document.getElementById('status');
  const statusMessage = statusDiv.querySelector('.status-message');
  const spinner = statusDiv.querySelector('.spinner');

  saveButton.addEventListener('click', async () => {
    try {
      // Show loading state
      saveButton.classList.add('saving');
      saveButton.disabled = true;
      statusDiv.classList.remove('hidden', 'success', 'error');
      statusMessage.textContent = 'Extracting article content...';
      spinner.classList.remove('hidden');

      // Get current tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Send message to content script
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractArticle' });
      
      if (response.error) {
        throw new Error(response.error);
      }

      // Update status
      statusMessage.textContent = 'Saving to Brevity...';

      // Send to API endpoint
      const apiUrl = 'http://localhost:3000/api/articles'; // Use production URL in manifest
      const apiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: response.url,
          title: response.title,
          textContent: response.textContent,
          author: response.author,
          publishDate: response.publishDate,
          description: response.description,
          featuredImage: response.featuredImage,
          wordCount: response.wordCount,
        }),
      });

      if (!apiResponse.ok) {
        const error = await apiResponse.json();
        throw new Error(error.error || 'Failed to save article');
      }

      const result = await apiResponse.json();

      // Show success
      statusDiv.classList.add('success');
      spinner.classList.add('hidden');
      statusMessage.textContent = 'Article saved successfully!';

      // Reset after 3 seconds
      setTimeout(() => {
        statusDiv.classList.add('hidden');
        saveButton.classList.remove('saving');
        saveButton.disabled = false;
      }, 3000);

    } catch (error) {
      // Show error
      statusDiv.classList.add('error');
      spinner.classList.add('hidden');
      statusMessage.textContent = error.message || 'Failed to save article';
      
      // Reset after 3 seconds
      setTimeout(() => {
        statusDiv.classList.add('hidden');
        saveButton.classList.remove('saving');
        saveButton.disabled = false;
      }, 3000);
    }
  });
});