/**
 * Characters IO CRM Integration
 *
 * This file handles form submissions to the Characters IO CRM.
 * Include this file on any page with booking or contact forms.
 *
 * Configuration:
 * - Set CRM_API_URL to your CRM's URL (with /api/public/leads endpoint)
 * - For local testing: http://localhost:3002/api/public/leads
 * - For production: https://your-crm-domain.com/api/public/leads
 */

// CRM Configuration - Update this URL for production
const CRM_CONFIG = {
  // Uses production URL if not on localhost, otherwise uses local dev URL
  apiUrl: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3002/api/public/leads'
    : 'https://crm.characters.io/api/public/leads', // Update this to your production CRM URL
  source: 'Website - characters.io',
  timeout: 10000 // 10 second timeout for CRM requests
};

/**
 * Submit booking form data to CRM
 * Creates a new contact and deal in the CRM
 */
async function submitToCRM(formData) {
  try {
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CRM_CONFIG.timeout);

    const response = await fetch(CRM_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to submit booking');
    }

    return { success: true, data: result };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('CRM submission timed out, will use fallback');
      return { success: false, error: 'Request timed out', timeout: true };
    }
    console.error('CRM submission error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Parse the booking form and prepare data for CRM
 */
function getBookingFormData() {
  // Get form field values
  const bookedDate = document.getElementById('bookedDate')?.value || '';
  const bookedTime = document.querySelector('input[name="bookedTime"]:checked')?.value || '';
  const characterName = document.getElementById('characterName')?.value || '';
  const firstName = document.getElementById('firstName')?.value || '';
  const lastName = document.getElementById('lastName')?.value || '';
  const emailAddress = document.getElementById('emailAddress')?.value || '';
  const phoneNumber = document.getElementById('phoneNumber')?.value || '';
  const partyAddress = document.getElementById('partyAddress')?.value || '';
  const partyZip = document.getElementById('partyZip')?.value || '';
  const bookingNotes = document.getElementById('bookingNotes')?.value || '';

  // Get selected characters from Select2 dropdown
  const bookedCharactersSelect = document.getElementById('bookedCharacters');
  let selectedCharacters = [];
  if (bookedCharactersSelect) {
    const selectedOptions = bookedCharactersSelect.selectedOptions || bookedCharactersSelect.options;
    for (let i = 0; i < selectedOptions.length; i++) {
      if (selectedOptions[i].selected) {
        selectedCharacters.push(selectedOptions[i].text);
      }
    }
  }

  // Combine character input with selected characters
  let allCharacters = characterName;
  if (selectedCharacters.length > 0) {
    allCharacters = allCharacters
      ? `${allCharacters}, ${selectedCharacters.join(', ')}`
      : selectedCharacters.join(', ');
  }

  // Build special requests including character info
  let specialRequests = bookingNotes;
  if (allCharacters) {
    specialRequests = `Characters requested: ${allCharacters}\n\n${specialRequests || ''}`.trim();
  }

  // Format date for CRM (expects YYYY-MM-DD)
  let eventDate = null;
  if (bookedDate) {
    // bookedDate is in MM/DD/YYYY format from the datepicker
    const parts = bookedDate.split('/');
    if (parts.length === 3) {
      eventDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
    }
  }

  return {
    // Contact info
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: emailAddress.trim(),
    phone: phoneNumber.trim(),

    // Event details
    eventDate: eventDate,
    eventTime: bookedTime,
    eventType: 'Birthday', // Default to Birthday party
    eventAddress: partyAddress.trim(),
    eventZipCode: partyZip.trim(),

    // Additional info
    specialRequests: specialRequests,
    source: CRM_CONFIG.source + ' - Book Now Form'
  };
}

/**
 * Parse contact form and prepare data for CRM
 */
function getContactFormData() {
  const firstName = document.querySelector('.contact-form input[name="firstName"]')?.value || '';
  const lastName = document.querySelector('.contact-form input[name="lastName"]')?.value || '';
  const email = document.querySelector('.contact-form input[name="email"]')?.value || '';
  const phone = document.querySelector('.contact-form input[name="phone"]')?.value || '';
  const subject = document.querySelector('.contact-form select[name="subject"]')?.value || '';
  const message = document.querySelector('.contact-form textarea[name="message"]')?.value || '';

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    eventType: subject || 'General Inquiry',
    specialRequests: message.trim(),
    source: CRM_CONFIG.source + ' - Contact Form'
  };
}

/**
 * Show success message after form submission
 */
function showSuccessMessage(container, message) {
  const successDiv = document.createElement('div');
  successDiv.className = 'crm-success-message';
  successDiv.innerHTML = `
    <div style="background: #d4edda; color: #155724; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0;">Thank You!</h3>
      <p style="margin: 0;">${message}</p>
    </div>
  `;

  // Replace form content with success message
  if (container) {
    container.innerHTML = '';
    container.appendChild(successDiv);
  }
}

/**
 * Initialize CRM integration for booking form
 * This intercepts the submit button click and handles validation + CRM submission
 */
function initBookingFormIntegration() {
  const bookingForm = document.getElementById('bookingForm');
  const submitButton = document.getElementById('submitForm');

  if (!bookingForm || !submitButton) {
    return; // Not on booking page
  }

  // Flag to track if we're handling CRM submission
  let crmSubmissionInProgress = false;

  // Intercept the submit button click BEFORE booking.js handles it
  submitButton.addEventListener('click', async function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    if (crmSubmissionInProgress) {
      return false;
    }

    // Run validation (same as booking.js)
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const emailAddress = document.getElementById('emailAddress');
    const phoneNumber = document.getElementById('phoneNumber');
    const partyAddress = document.getElementById('partyAddress');
    const partyZip = document.getElementById('partyZip');
    const pppDo = document.getElementById('pppDo');

    let invalidForm = false;

    // Reset styles
    document.querySelectorAll('.bookingContact input').forEach(input => {
      input.style.borderColor = '';
    });

    // Basic validation
    if (!firstName?.value?.trim()) { firstName.style.borderColor = 'red'; invalidForm = true; }
    if (!lastName?.value?.trim()) { lastName.style.borderColor = 'red'; invalidForm = true; }
    if (!emailAddress?.value?.trim()) { emailAddress.style.borderColor = 'red'; invalidForm = true; }
    if (!phoneNumber?.value?.trim()) { phoneNumber.style.borderColor = 'red'; invalidForm = true; }
    if (!partyAddress?.value?.trim()) { partyAddress.style.borderColor = 'red'; invalidForm = true; }
    if (!partyZip?.value?.trim()) { partyZip.style.borderColor = 'red'; invalidForm = true; }

    // Honeypot check
    if (pppDo?.value?.trim()) { invalidForm = true; }

    if (invalidForm) {
      const errorDiv = document.querySelector('.bookingError');
      if (errorDiv) {
        errorDiv.innerHTML = 'Please fill in all required fields.';
        errorDiv.style.display = 'block';
        setTimeout(() => { errorDiv.style.display = 'none'; }, 5000);
      }
      return false;
    }

    crmSubmissionInProgress = true;

    // Show processing state
    submitButton.textContent = 'Processing...';
    submitButton.classList.add('stepDisabled');

    // Get form data and submit to CRM
    const formData = getBookingFormData();
    const result = await submitToCRM(formData);

    if (result.success) {
      // CRM submission succeeded - show success message
      showSuccessMessage(
        document.querySelector('.booking-container'),
        "We've received your booking request and will contact you within 24 hours to confirm. Check your email for confirmation details."
      );

      // Track conversion (if analytics is set up)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'booking_submitted', {
          event_category: 'conversion',
          event_label: 'Book Now Form'
        });
      }
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead');
      }
    } else {
      // CRM failed - show user-friendly error
      console.error('CRM submission failed:', result.error);

      const errorDiv = document.querySelector('.bookingError');
      if (errorDiv) {
        errorDiv.innerHTML = 'Unable to process your request right now. Please call us at <a href="tel:856-200-8156" style="color: inherit; text-decoration: underline;">856-200-8156</a> to complete your booking.';
        errorDiv.style.display = 'block';
      }

      // Reset button so user can try again
      submitButton.textContent = 'Request Booking';
      submitButton.classList.remove('stepDisabled');
    }

    crmSubmissionInProgress = false;
    return false;
  }, true); // Use capture phase to run BEFORE other handlers
}

/**
 * Initialize CRM integration for contact form
 */
function initContactFormIntegration() {
  const contactForm = document.querySelector('.contact-form');

  if (!contactForm) {
    return; // Not on contact page
  }

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;
    }

    const formData = getContactFormData();
    const result = await submitToCRM(formData);

    if (result.success) {
      showSuccessMessage(
        contactForm.parentElement,
        "Thank you for contacting us! We'll get back to you within 24 hours."
      );
    } else {
      alert(result.error || 'Something went wrong. Please try again or call us at 856-200-8156.');
      if (submitButton) {
        submitButton.textContent = 'Send Message';
        submitButton.disabled = false;
      }
    }

    return false;
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initBookingFormIntegration();
  initContactFormIntegration();
});

// Also initialize if jQuery is loaded (for compatibility with existing code)
if (typeof jQuery !== 'undefined') {
  jQuery(document).ready(function() {
    // Re-initialize in case DOMContentLoaded already fired
    initBookingFormIntegration();
    initContactFormIntegration();
  });
}
