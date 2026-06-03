const form = document.getElementById('auditForm');
const statusDiv = document.getElementById('status');

// Replace later with your production webhook URL
const WEBHOOK_URL = 'https://YOUR-N8N-URL/webhook/seo-audit';

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  statusDiv.innerText = 'Generating audit... This may take 30-90 seconds.';

  const formData = Object.fromEntries(new FormData(form));

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.auditUrl) {
      window.location.href = result.auditUrl;
    } else {
      statusDiv.innerText = 'Audit generated, but no URL was returned.';
    }

  } catch (err) {
    console.error(err);
    statusDiv.innerText = 'Something went wrong while generating the audit.';
  }
});
