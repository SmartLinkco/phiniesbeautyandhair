// Fixed Header Navigation
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu functionality
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const headerNav = document.querySelector('.header-nav');
  const body = document.body;
  
  if (mobileMenuToggle && headerNav) {
    mobileMenuToggle.addEventListener('click', function() {
      headerNav.classList.toggle('mobile-nav-open');
      mobileMenuToggle.classList.toggle('menu-open');
      body.classList.toggle('menu-open');
    });
    
    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        headerNav.classList.remove('mobile-nav-open');
        mobileMenuToggle.classList.remove('menu-open');
        body.classList.remove('menu-open');
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.fixed-header')) {
        headerNav.classList.remove('mobile-nav-open');
        mobileMenuToggle.classList.remove('menu-open');
        body.classList.remove('menu-open');
      }
    });
  }
  
  // Smooth scrolling for navigation links
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('.fixed-header').offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Header scroll effect
  const header = document.querySelector('.fixed-header');
  let lastScrollY = window.scrollY;
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      header.style.background = 'linear-gradient(135deg, rgba(243, 193, 84, 0.95) 0%, rgba(191, 160, 106, 0.95) 100%)';
      header.style.backdropFilter = 'blur(15px)';
    } else {
      header.style.background = 'linear-gradient(135deg, #f3c154 0%, #bfa06a 100%)';
      header.style.backdropFilter = 'blur(10px)';
    }
    
    lastScrollY = currentScrollY;
  });
});

// Slideshow Functionality
const slides = document.querySelectorAll('.slide');
const prevBtn = document.getElementById('prevSlide');
const nextBtn = document.getElementById('nextSlide');
let currentSlide = 0;

function showSlide(idx) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === idx);
  });
}
function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}
function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showSlide(currentSlide);
}
if (nextBtn && prevBtn) {
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
}
showSlide(currentSlide);
let slideInterval = setInterval(nextSlide, 4000);
document.querySelector('.slideshow-container').addEventListener('mouseenter', () => clearInterval(slideInterval));
document.querySelector('.slideshow-container').addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 4000));

// Countdown Timer Implementation
const eventDate = new Date('2025-09-15T09:00:00');
let registrationClosed = false;

function updateCountdown() {
  const now = new Date();
  let diff = eventDate - now;
  
  // Check if event has started or passed
  if (diff <= 0) {
    diff = 0;
    if (!registrationClosed) {
      closeRegistration();
      registrationClosed = true;
    }
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  
  if (document.getElementById('days')) document.getElementById('days').textContent = String(days).padStart(2, '0');
  if (document.getElementById('hours')) document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  if (document.getElementById('minutes')) document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  if (document.getElementById('seconds')) document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

function closeRegistration() {
  // Hide registration form and related elements
  const registrationForm = document.getElementById('registrationForm');
  const confirmationForm = document.getElementById('confirmationForm');
  const registrationTitle = document.getElementById('registrationTitle');
  const awardCta = document.querySelector('.award-cta');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  
  if (registrationForm) registrationForm.classList.add('hidden');
  if (confirmationForm) confirmationForm.classList.add('hidden');
  if (successMessage) successMessage.classList.add('hidden');
  if (errorMessage) errorMessage.classList.add('hidden');
  
  // Hide award CTA button
  if (awardCta) {
    awardCta.style.display = 'none';
  }
  
  // Update title and show closed notification
  if (registrationTitle) {
    registrationTitle.innerHTML = 'Registration Closed';
  }
  
  // Show the registration closed notification
  const closedNotification = document.getElementById('registrationClosed');
  if (closedNotification) {
    closedNotification.classList.remove('hidden');
  }
  
  // Update countdown label to show event status
  const countdownLabel = document.querySelector('.countdown-label');
  if (countdownLabel) {
    countdownLabel.textContent = 'Event In Progress';
  }
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Modern course selection functionality
const courseCards = document.querySelectorAll('.course-card');
const selectedCoursesDiv = document.getElementById('selectedCourses');
const totalFeeSpan = document.getElementById('totalFee');
let selectedCourses = [];

function updateSelectedCoursesDisplay() {
  selectedCoursesDiv.innerHTML = '';
  selectedCoursesDiv.className = 'modern-selected-courses';
  
  if (selectedCourses.length === 0) {
    const emptyMsg = document.createElement('span');
    emptyMsg.textContent = 'No courses selected yet';
    emptyMsg.className = 'empty-selection-msg';
    selectedCoursesDiv.appendChild(emptyMsg);
  } else {
    selectedCourses.forEach((course, index) => {
      const chip = document.createElement('div');
      chip.className = 'modern-course-chip';
      chip.innerHTML = `
        <span>${course.name} (GH₵${course.fee})</span>
        <span class="chip-remove" data-index="${index}">×</span>
      `;
      selectedCoursesDiv.appendChild(chip);
    });
  }
  
  // Update total fee
  const total = selectedCourses.reduce((sum, course) => sum + course.fee, 0);
  totalFeeSpan.textContent = `GH₵${total}`;
  
  // Update payment instructions when courses change
  updatePaymentInstructions();
  
  // Add event listeners to remove buttons
  document.querySelectorAll('.chip-remove').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const index = parseInt(btn.dataset.index);
      removeCourse(selectedCourses[index].name);
    });
  });
}

function addCourse(courseName, courseFee) {
  if (!selectedCourses.find(c => c.name === courseName)) {
    selectedCourses.push({ name: courseName, fee: courseFee });
    updateSelectedCoursesDisplay();
    updateCourseSelection();
    updateTotalFee();
    updateCourseCardState(courseName, true);
  }
}

function removeCourse(courseName) {
  selectedCourses = selectedCourses.filter(c => c.name !== courseName);
  updateSelectedCoursesDisplay();
  updateCourseSelection();
  updateTotalFee();
  updateCourseCardState(courseName, false);
}

function updateCourseCardState(courseName, isSelected) {
  const card = document.querySelector(`[data-course="${courseName}"]`);
  if (card) {
    const btn = card.querySelector('.course-select-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnIcon = btn.querySelector('.btn-icon');
    
    if (isSelected) {
      card.classList.add('selected');
      btnText.textContent = 'Select';
      btnIcon.textContent = '✓';
    } else {
      card.classList.remove('selected');
      btnText.textContent = 'Select Course';
      btnIcon.textContent = '+';
    }
  }
}

// Function to update course selection in hidden field
function updateCourseSelection() {
  const coursesValue = selectedCourses.map(c => c.name).join(',');
  document.getElementById('coursesInput').value = coursesValue;
}

// Function to update total fee in hidden field
function updateTotalFee() {
  const total = selectedCourses.reduce((sum, course) => sum + course.fee, 0);
  totalFeeSpan.textContent = `GH₵${total}`;
  document.getElementById('totalFeeInput').value = total;
  
  // Update payment instructions when total changes
  updatePaymentInstructions();
}

// Function to update payment instructions based on selected payment method
function updatePaymentInstructions() {
  const paymentMethod = document.getElementById('paymentMethod').value;
  const totalAmount = totalFeeSpan.textContent;
  const instructionsDiv = document.getElementById('paymentInstructions');
  
  if (!paymentMethod || selectedCourses.length === 0) {
    instructionsDiv.classList.add('hidden');
    return;
  }
  
  let instructions = '';
  
  if (paymentMethod === 'Mobile Money') {
    instructions = `
      <div class="payment-instructions">
        <h3><span class="instruction-icon">📱</span> Mobile Money Payment Instructions</h3>
        <div class="instruction-steps">
          <div class="step">
            <span class="step-number">1</span>
            <p>Dial <strong>*170#</strong> on your mobile phone</p>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <p>Select <strong>"Send Money"</strong> option</p>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            <p>Enter recipient number: <strong class="highlight">0245950898</strong></p>
          </div>
          <div class="step">
            <span class="step-number">4</span>
            <p>Enter amount: <strong class="highlight">${totalAmount.replace('GH₵', '')}</strong></p>
          </div>
          <div class="step">
            <span class="step-number">5</span>
            <p>Enter your <strong>PIN</strong> to confirm</p>
          </div>
          <div class="step">
            <span class="step-number">6</span>
            <p>You will receive a confirmation SMS with <strong>Transaction ID</strong></p>
          </div>
        </div>
        <div class="payment-details">
          <p><strong>Recipient Name:</strong> PHINES empire</p>
          <p><strong>Business Number:</strong> 0546862331</p>
        </div>
        <div class="instruction-note">
          <strong>Important:</strong> After successful payment, copy the Transaction ID from your SMS and enter it in the field below before submitting your registration.
        </div>
      </div>
    `;
  } else if (paymentMethod === 'Bank Transfer') {
    instructions = `
      <div class="payment-instructions">
        <h3><span class="instruction-icon">🏦</span> Bank Transfer Payment Instructions</h3>
        <div class="instruction-steps">
          <div class="step">
            <span class="step-number">1</span>
            <p>Visit your nearest Stanbic Bank branch or use mobile banking</p>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <p>Request to transfer money to the account below</p>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            <p>Provide the following details:</p>
            <ul>
              <li><strong>Account Number:</strong> <span class="highlight">9040012371572</span></li>
              <li><strong>Bank:</strong> Stanbic Bank</li>
              <li><strong>Branch:</strong> Spintex branch</li>
              <li><strong>Amount:</strong> <span class="highlight">${totalAmount.replace('GH₵', '')}</span></li>
            </ul>
          </div>
          <div class="step">
            <span class="step-number">4</span>
            <p>Complete the transfer and collect your receipt</p>
          </div>
          <div class="step">
            <span class="step-number">5</span>
            <p>Note the <strong>Transaction Reference Number</strong> on your receipt</p>
          </div>
        </div>
        <div class="instruction-note">
          <strong>Important:</strong> After successful transfer, enter the Transaction Reference Number from your receipt in the field below before submitting your registration.
        </div>
      </div>
    `;
  } else if (paymentMethod === 'Cash') {
    instructions = `
      <div class="payment-instructions">
        <h3><span class="instruction-icon">💵</span> Cash Payment Instructions</h3>
        <div class="instruction-steps">
          <div class="step">
            <span class="step-number">1</span>
            <p>Call <strong class="highlight">0546862331</strong> to schedule an appointment</p>
          </div>
          <div class="step">
            <span class="step-number">2</span>
            <p>Arrange a convenient time and location for payment</p>
          </div>
          <div class="step">
            <span class="step-number">3</span>
            <p>Bring the exact amount: <strong class="highlight">${totalAmount}</strong></p>
          </div>
          <div class="step">
            <span class="step-number">4</span>
            <p>Meet with our representative at the agreed location</p>
          </div>
          <div class="step">
            <span class="step-number">5</span>
            <p>Make payment and collect your receipt</p>
          </div>
          <div class="step">
            <span class="step-number">6</span>
            <p>Note the <strong>Receipt Number</strong> for your records</p>
          </div>
        </div>
        <div class="payment-details">
          <p><strong>Contact:</strong> 0546862331</p>
        </div>
        <div class="instruction-note">
          <strong>Important:</strong> After payment, enter the Receipt Number provided by our representative in the field below before submitting your registration.
        </div>
      </div>
    `;
  }
  
  instructionsDiv.innerHTML = instructions;
  instructionsDiv.classList.remove('hidden');
}

// Add click event listeners to course cards
courseCards.forEach(card => {
  const selectBtn = card.querySelector('.course-select-btn');
  const courseName = card.dataset.course;
  const courseFee = parseInt(card.dataset.fee);
  
  selectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isSelected = selectedCourses.find(c => c.name === courseName);
    
    if (isSelected) {
      removeCourse(courseName);
    } else {
      addCourse(courseName, courseFee);
    }
  });
  
  // Also allow clicking the entire card
  card.addEventListener('click', (e) => {
    if (!e.target.closest('.course-select-btn')) {
      selectBtn.click();
    }
  });
});

// Update payment instructions when payment method changes
document.getElementById('paymentMethod').addEventListener('change', updatePaymentInstructions);

// Initialize display
updateSelectedCoursesDisplay();

// Registration form logic
// Registration form logic
const registrationForm = document.getElementById('registrationForm');
const formErrorDiv = document.getElementById('formError');

// Update form submission to use JSONP
registrationForm.addEventListener('submit', function(e) {
  e.preventDefault();
  formErrorDiv.style.display = 'none';
  formErrorDiv.textContent = '';
  
  if (selectedCourses.length === 0) {
    formErrorDiv.textContent = 'Please select at least one course.';
    formErrorDiv.style.display = 'block';
    return;
  }
  
  const paymentMethod = document.getElementById('paymentMethod').value;
  if (!paymentMethod) {
    formErrorDiv.textContent = 'Please select a payment method.';
    formErrorDiv.style.display = 'block';
    return;
  }
  
  const transactionId = document.getElementById('transactionId').value;
  if (!transactionId) {
    formErrorDiv.textContent = 'Please enter your transaction ID.';
    formErrorDiv.style.display = 'block';
    return;
  }
  
  // Show loading state
  const submitBtn = registrationForm.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = 'Submitting...';
  submitBtn.disabled = true;
  
  // Prepare form data as URL parameters (not JSON)
  const formData = {
    action: 'submitRegistration',
    fullName: document.getElementById('fullName').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    courses: document.getElementById('coursesInput').value,
    paymentMethod: paymentMethod,
    totalFee: document.getElementById('totalFeeInput').value,
    transactionId: transactionId
  };
  
  // Create script tag for JSONP request
  const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
  const script = document.createElement('script');
  
  // Define callback function
  window[callbackName] = function(data) {
    delete window[callbackName];
    document.body.removeChild(script);
    
    // Restore button state
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
    
    if (data.success) {
      // Show success message with pending verification note
      showResponse('success', 'Registration Submitted Successfully!', 
        'Your payment is being verified. You will receive a confirmation email with your course details and tickets within 24 hours.', 
        { 
          'Transaction ID': transactionId,
          'Event ID Number': "Pending Approval..." || 'N/A'
        });
    } else {
      // Show error message
      showResponse('error', 'Registration Failed', data.error || 'An unknown error occurred');
    }
  };
  
  // Build URL with parameters (not as JSON string)
  const baseUrl = "https://script.google.com/macros/s/AKfycbz48Y8M7tBs7ClhjCRQ436cZ7QNX_6AYB9dyPC9gUxZyR7rZ1TXP08P5tcQ1yoCs2df/exec";
  let url = baseUrl + '?callback=' + encodeURIComponent(callbackName);
  
  // Add all form data as URL parameters
  for (const key in formData) {
    if (formData.hasOwnProperty(key)) {
      url += '&' + encodeURIComponent(key) + '=' + encodeURIComponent(formData[key]);
    }
  }
  
  script.src = url;
  document.body.appendChild(script);
  
  // Handle script load errors
  script.onerror = function() {
    delete window[callbackName];
    document.body.removeChild(script);
    
    // Restore button state
    submitBtn.textContent = originalBtnText;
    submitBtn.disabled = false;
    
    // Show error message
    showResponse('error', 'Network Error', 'There was a problem submitting your registration. Please check your connection and try again.');
  };
});

// Function to show response modal
function showResponse(type, title, message, details) {
  const container = document.getElementById('responseContainer');
  const icon = container.querySelector('.response-icon');
  const titleEl = container.querySelector('.response-title');
  const messageEl = container.querySelector('.response-message');
  const detailsEl = container.querySelector('.response-details');
  const successActions = container.querySelector('.success-actions');
  const errorActions = container.querySelector('.error-actions');
  
  // Set content based on type
  container.className = `response-modal response-${type}`;
  icon.textContent = type === 'success' ? '✓' : '⚠';
  titleEl.textContent = title;
  messageEl.textContent = message;
  
  // Show appropriate action buttons
  if (type === 'success') {
    successActions.style.display = 'flex';
    errorActions.style.display = 'none';
  } else {
    successActions.style.display = 'none';
    errorActions.style.display = 'flex';
  }
  
  // Add details if provided
  if (details && Object.keys(details).length > 0) {
    detailsEl.innerHTML = Object.entries(details)
      .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
      .join('');
    detailsEl.classList.remove('hidden');
  } else {
    detailsEl.classList.add('hidden');
  }
  
  // Show the modal
  container.classList.remove('hidden');
  
  // Hide the form
  document.getElementById('registrationForm').classList.add('hidden');
  
  // Also hide any existing messages
  document.getElementById('successMessage').classList.add('hidden');
  document.getElementById('errorMessage').classList.add('hidden');
}

// Add event listeners for modal buttons

// Success action buttons
document.getElementById('registerAnotherBtn').addEventListener('click', function() {
  resetFormAndShowNew();
});

document.getElementById('doneBtn').addEventListener('click', function() {
  document.getElementById('responseContainer').classList.add('hidden');
  document.getElementById('registrationTitle').innerHTML = 'Thank You for Registering!';
  // Optionally scroll to top or another section
  // window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Error action buttons
document.getElementById('goBackBtn').addEventListener('click', function() {
  // Hide modal and show form again with existing data
  document.getElementById('responseContainer').classList.add('hidden');
  document.getElementById('registrationForm').classList.remove('hidden');
});

document.getElementById('newRegistrationBtn').addEventListener('click', function() {
  resetFormAndShowNew();
});

// Helper function to reset form and start new registration
function resetFormAndShowNew() {
  // Reset form and show it again
  registrationForm.reset();
  selectedCourses = [];
  updateSelectedCoursesDisplay();
  updateCourseSelection();
  updateTotalFee();
  
  // Remove selected class from all course cards
  document.querySelectorAll('.course-card').forEach(card => {
    card.classList.remove('selected');
    const btn = card.querySelector('.course-select-btn');
    const btnText = btn.querySelector('.btn-text');
    const btnIcon = btn.querySelector('.btn-icon');
    btnText.textContent = 'Select Course';
    btnIcon.textContent = '+';
  });
  
  // Hide modal and show form
  document.getElementById('responseContainer').classList.add('hidden');
  document.getElementById('registrationForm').classList.remove('hidden');
  
  // Scroll to registration section
  document.getElementById('registration').scrollIntoView({ 
    behavior: 'smooth', 
    block: 'start' 
  });
}

// Add CSS for the payment instructions
const paymentInstructionsStyle = document.createElement('style');
paymentInstructionsStyle.textContent = `
  .payment-instructions {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
    margin: 20px 0;
    border: 1px solid #e9ecef;
  }
  
  .payment-instructions h3 {
    margin-top: 0;
    color: #1e3c72;
    border-bottom: 2px solid #e7cfa7;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .instruction-icon {
    font-size: 24px;
  }
  
  .instruction-steps {
    margin: 20px 0;
  }
  
  .step {
    display: flex;
    align-items: flex-start;
    margin-bottom: 15px;
    gap: 15px;
  }
  
  .step-number {
    background: #1e3c72;
    color: white;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    font-weight: bold;
  }
  
  .step p {
    margin: 0;
    line-height: 1.5;
  }
  
  .step ul {
    margin: 10px 0;
    padding-left: 20px;
  }
  
  .step li {
    margin-bottom: 5px;
  }
  
  .payment-details {
    background: white;
    padding: 15px;
    border-radius: 6px;
    margin: 15px 0;
    border-left: 4px solid #1e3c72;
  }
  
  .payment-details p {
    margin: 5px 0;
  }
  
  .instruction-note {
    background: #fff3cd;
    padding: 15px;
    border-radius: 6px;
    border-left: 4px solid #ffc107;
    margin-top: 15px;
    font-size: 0.95em;
  }
  
  .highlight {
    background: #e7f3ff;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid #b8daff;
    color: #004085;
    font-weight: bold;
  }
  
  .transaction-id-group {
    margin-top: 20px;
  }
  
  @media (max-width: 768px) {
    .step {
      flex-direction: column;
      gap: 8px;
    }
    
    .step-number {
      align-self: flex-start;
    }
  }
`;
document.head.appendChild(paymentInstructionsStyle);