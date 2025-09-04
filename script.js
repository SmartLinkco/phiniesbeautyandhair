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
    updateCourseCardState(courseName, true);
  }
}

function removeCourse(courseName) {
  selectedCourses = selectedCourses.filter(c => c.name !== courseName);
  updateSelectedCoursesDisplay();
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

// Initialize display
updateSelectedCoursesDisplay();

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
    
    const totalAmount = totalFeeSpan.textContent;
    let instructions = '';
    
    if (paymentMethod === 'Mobile Money') {
        instructions = `<strong>Mobile Money Payment Instructions:</strong><br><br>
            <b>Amount to Pay:</b> ${totalAmount}<br><br>
            <b>Step 1:</b> Dial *170# on your mobile phone<br>
            <b>Step 2:</b> Select "Send Money" option<br>
            <b>Step 3:</b> Enter recipient number: <b>0245950898</b><br>
            <b>Step 4:</b> Enter amount: <b>${totalAmount.replace('GH₵', '')}</b><br>
            <b>Step 5:</b> Enter your PIN to confirm<br>
            <b>Step 6:</b> You will receive a confirmation SMS with transaction ID<br><br>
            <b>Recipient Name:</b> PHINES empire<br>
            <b>Business Number:</b> 0546862331<br><br>
            <b>Important:</b> After successful payment, copy the transaction ID from your SMS and enter it below.`;
    } else if (paymentMethod === 'Bank Transfer') {
        instructions = `<strong>Bank Transfer Payment Instructions:</strong><br><br>
            <b>Amount to Pay:</b> ${totalAmount}<br><br>
            <b>Step 1:</b> Visit your nearest Stanbic Bank branch or use mobile banking<br>
            <b>Step 2:</b> Request to transfer money to the account below<br>
            <b>Step 3:</b> Provide the following details:<br>
            &nbsp;&nbsp;• <b>Account Number:</b> 9040012371572<br>
            &nbsp;&nbsp;• <b>Bank:</b> Stanbic Bank<br>
            &nbsp;&nbsp;• <b>Branch:</b> Spintex branch<br>
            &nbsp;&nbsp;• <b>Amount:</b> ${totalAmount.replace('GH₵', '')}<br>
            <b>Step 4:</b> Complete the transfer and collect your receipt<br>
            <b>Step 5:</b> Note the transaction reference number on your receipt<br><br>
            <b>Important:</b> After successful transfer, enter the transaction reference number from your receipt below.`;
    } else if (paymentMethod === 'Cash') {
        instructions = `<strong>Cash Payment Instructions:</strong><br><br>
            <b>Amount to Pay:</b> ${totalAmount}<br><br>
            <b>Step 1:</b> Call <b>0546862331</b> to schedule an appointment<br>
            <b>Step 2:</b> Arrange a convenient time and location for payment<br>
            <b>Step 3:</b> Bring the exact amount: <b>${totalAmount}</b><br>
            <b>Step 4:</b> Meet with our representative at the agreed location<br>
            <b>Step 5:</b> Make payment and collect your receipt<br>
            <b>Step 6:</b> Note the receipt number for your records<br><br>
            <b>Contact:</b> 0546862331<br><br>
            <b>Important:</b> After payment, enter the receipt number provided by our representative below.`;
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
