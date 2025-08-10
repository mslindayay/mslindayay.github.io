document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('feedbackForm');
  const success = document.getElementById('formSuccess');
  const error = document.getElementById('formError');

  const show = (el) => { el.hidden = false; };
  const hide = (el) => { el.hidden = true; };

  function serializeForm(formEl) {
    const formData = new FormData(formEl);
    return Object.fromEntries(formData.entries());
  }

  function saveSubmissionLocally(submission) {
    try {
      const key = 'feedbackSubmissions';
      const existingRaw = localStorage.getItem(key);
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      existing.push({ ...submission, submittedAt: new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(existing));
      return true;
    } catch (e) {
      return false;
    }
  }

  function validateSubmission({ name, email, rating, comments }) {
    if (!name || !email || !rating || !comments) return false;
    const emailOk = /.+@.+\..+/.test(email);
    return emailOk;
  }

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    hide(success);
    hide(error);

    const submission = serializeForm(form);

    if (!validateSubmission(submission)) {
      show(error);
      return;
    }

    const saved = saveSubmissionLocally(submission);

    if (saved) {
      show(success);
      form.reset();
      const ratingSelect = document.getElementById('rating');
      if (ratingSelect) ratingSelect.selectedIndex = 0; // Reset to placeholder option
    } else {
      show(error);
    }
  });
});