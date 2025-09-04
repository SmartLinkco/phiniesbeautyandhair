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
// Set your event date/time here (e.g., September 15, 2025, 09:00:00)
const eventDate = new Date('2025-09-15T09:00:00');
function updateCountdown() {
  const now = new Date();
  let diff = eventDate - now;
  if (diff < 0) diff = 0;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  if (document.getElementById('days')) document.getElementById('days').textContent = String(days).padStart(2, '0');
  if (document.getElementById('hours')) document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  if (document.getElementById('minutes')) document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  if (document.getElementById('seconds')) document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}
setInterval(updateCountdown, 1000);
updateCountdown();
// Back button logic for payment confirmation
const backToFormBtn = document.getElementById('backToFormBtn');
if (backToFormBtn) {
  backToFormBtn.addEventListener('click', function() {
    paymentInstructionsDiv.classList.add('hidden');
    confirmationForm.classList.add('hidden');
    registrationForm.classList.remove('hidden');
    formErrorDiv.style.display = 'none';
    formErrorDiv.textContent = '';
  });
}
// Dynamic course selection and fee calculation
const courseCheckboxes = document.querySelectorAll('.course-card input[type="checkbox"]');
const selectedCoursesDiv = document.getElementById('selectedCourses');
const totalFeeSpan = document.getElementById('totalFee');
let selectedCourses = [];

function updateSelectedCourses() {
  selectedCourses = [];
  let total = 0;
  selectedCoursesDiv.innerHTML = '';
  courseCheckboxes.forEach(cb => {
    if (cb.checked) {
      selectedCourses.push({ name: cb.value, fee: parseInt(cb.dataset.fee) });
      total += parseInt(cb.dataset.fee);
      const courseLabel = document.createElement('span');
      courseLabel.textContent = `${cb.value} (GH₵${cb.dataset.fee})`;
      courseLabel.className = 'selected-course-label';
      selectedCoursesDiv.appendChild(courseLabel);
    }
  });
  totalFeeSpan.textContent = `GH₵${total}`;
}
courseCheckboxes.forEach(cb => {
  cb.addEventListener('change', updateSelectedCourses);
});
updateSelectedCourses();

// Registration form logic
const registrationForm = document.getElementById('registrationForm');
const paymentInstructionsDiv = document.getElementById('paymentInstructions');
const confirmationForm = document.getElementById('confirmationForm');
const confirmationStatusDiv = document.getElementById('confirmationStatus');
const paymentMethodSelect = document.getElementById('paymentMethod');
const formErrorDiv = document.getElementById('formError');

registrationForm.addEventListener('submit', function(e) {
  e.preventDefault();
  formErrorDiv.style.display = 'none';
  formErrorDiv.textContent = '';
  if (selectedCourses.length === 0) {
    formErrorDiv.textContent = 'Please select at least one course.';
    formErrorDiv.style.display = 'block';
    return;
  }
  const paymentMethod = paymentMethodSelect.value;
  if (!paymentMethod) {
    formErrorDiv.textContent = 'Please select a payment method.';
    formErrorDiv.style.display = 'block';
    return;
  }
  let instructions = '';
  if (paymentMethod === 'Mobile Money') {
    instructions = `<strong>Mobile Money Payment:</strong><br>
      <b>Number:</b> 0245950898<br>
      <b>Name:</b> PHINES empire<br>
      <b>Business Number:</b> 0546862331<br>
      After payment, enter your transaction ID below.`;
  } else if (paymentMethod === 'Bank Transfer') {
    instructions = `<strong>Bank Transfer Payment:</strong><br>
      <b>Account Number:</b> 9040012371572<br>
      <b>Bank:</b> Stanbic Bank<br>
      <b>Branch:</b> Spintex branch<br>
      After payment, enter your transaction ID below.`;
  } else if (paymentMethod === 'Cash') {
    instructions = `<strong>Cash Payment:</strong><br>Contact <b>0546862331</b> to arrange in-person payment.<br>After payment, enter your transaction ID below.`;
  }
  paymentInstructionsDiv.innerHTML = instructions;
  paymentInstructionsDiv.classList.remove('hidden');
  confirmationForm.classList.remove('hidden');
  registrationForm.classList.add('hidden');
});

confirmationForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const userData = {
    fullName: document.getElementById('fullName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    courses: selectedCourses.map(c => c.name),
    totalFee: totalFeeSpan.textContent,
    paymentMethod: paymentMethodSelect.value,
    transactionId: document.getElementById('transactionId').value,
    status: 'Pending Verification',
    timestamp: new Date().toISOString()
  };
  // Store in localStorage for demo
  let registrations = JSON.parse(localStorage.getItem('phinies_registrations') || '[]');
  registrations.push(userData);
  localStorage.setItem('phinies_registrations', JSON.stringify(registrations));
  confirmationStatusDiv.textContent = 'Thank you! Your payment is pending verification. We will contact you soon.';
  confirmationStatusDiv.classList.remove('hidden');
  confirmationForm.classList.add('hidden');
  paymentInstructionsDiv.classList.add('hidden');
});
