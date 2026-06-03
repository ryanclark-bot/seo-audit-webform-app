const form = document.getElementById('auditForm');
const statusDiv = document.getElementById('status');

// Use your production n8n webhook URL here
const WEBHOOK_URL = 'https://scorpionoperations.app.n8n.cloud/webhook/seo-audit';

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerText;

  submitButton.disabled = true;
  submitButton.innerText = 'Generating...';

  statusDiv.innerHTML = `
    <div class="status-card">
      <strong>Generating audit...</strong><br>
      This may take 30-90 seconds. Please keep this page open.
    </div>
  `;

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
      statusDiv.innerHTML = `
        <div class="status-card success">
          <strong>Audit generated successfully.</strong>
          <p>Your audit URL is ready:</p>
          <a href="${result.auditUrl}" target="_blank" rel="noopener noreferrer">
            Open Audit
          </a>
          <button type="button" id="copyAuditLink">
            Copy Link
          </button>
        </div>
      `;

      const copyButton = document.getElementById('copyAuditLink');

      copyButton.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(result.auditUrl);
          copyButton.innerText = 'Copied';
        } catch (err) {
          copyButton.innerText = 'Copy failed';
        }
      });
    } else {
      statusDiv.innerHTML = `
        <div class="status-card error">
          <strong>Audit finished, but no URL was returned.</strong>
          <p>Please check the final n8n response node.</p>
        </div>
      `;
    }

  } catch (err) {
    console.error(err);

    statusDiv.innerHTML = `
      <div class="status-card error">
        <strong>Something went wrong while generating the audit.</strong>
        <p>Please try again or check the n8n execution log.</p>
      </div>
    `;
  } finally {
    submitButton.disabled = false;
    submitButton.innerText = originalButtonText;
  }
});
