// Audio functionality
let audioInitialized = false;

function toggleAudio() {
  const audio = document.getElementById("myAudio");
  const btn = document.querySelector(".music");
  
  if (!audio) return;

  if (audio.paused) {
    audio.play().then(() => {
      audioInitialized = true;
    }).catch(error => {
      console.log("Audio play failed:", error);
    });
    btn.innerHTML = "🎵 Pause Music";
  } else {
    audio.pause();
    btn.innerHTML = "🎵 Play Music";
  }
}

// Persistent audio across page navigation
function initializePersistentAudio() {
  const audio = document.getElementById("myAudio");
  if (!audio) return;
  
  // Store audio state in sessionStorage
  const audioState = sessionStorage.getItem('audioPlaying');
  const audioTime = sessionStorage.getItem('audioTime');
  
  if (audioState === 'true') {
    if (audioTime) {
      audio.currentTime = parseFloat(audioTime);
    }
    
    // Auto-play if it was playing before
    audio.play().then(() => {
      const btn = document.querySelector(".music");
      if (btn) btn.innerHTML = "🎵 Pause Music";
      audioInitialized = true;
    }).catch(error => {
      console.log("Auto-play failed:", error);
    });
  }
  
  // Save state when audio plays/pauses
  audio.addEventListener('play', () => {
    sessionStorage.setItem('audioPlaying', 'true');
  });
  
  audio.addEventListener('pause', () => {
    sessionStorage.setItem('audioPlaying', 'false');
  });
  
  // Save current time periodically
  audio.addEventListener('timeupdate', () => {
    sessionStorage.setItem('audioTime', audio.currentTime.toString());
  });
}

// Handle page visibility changes to keep audio playing
function handleVisibilityChange() {
  const audio = document.getElementById("myAudio");
  if (!audio || !audioInitialized) return;
  
  if (document.hidden) {
    // Page is hidden, but don't pause audio
    sessionStorage.setItem('audioTime', audio.currentTime.toString());
  } else {
    // Page is visible again, ensure audio continues if it should be playing
    const audioState = sessionStorage.getItem('audioPlaying');
    if (audioState === 'true' && audio.paused) {
      audio.play().catch(error => {
        console.log("Resume play failed:", error);
      });
    }
  }
}

// Mobile navigation toggle
function toggleMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  
  if (hamburger && navMenu) {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  }
}

// Modal functionality
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close");

// Show modal on first visit
window.onload = function() {
  if (!localStorage.getItem("visited")) {
    setTimeout(() => {
      if (modal) modal.style.display = "block";
    }, 2000); // Show after 2 seconds
    localStorage.setItem("visited", true);
  }
};

// Close modal
if (closeBtn) {
  closeBtn.onclick = function() {
    modal.style.display = "none";
  };
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// Main slideshow functionality
let slideIndex = 0;
let slideInterval;

function showSlides() {
  const slides = document.querySelectorAll(".slideshow img");
  if (slides.length === 0) return;
  
  slides.forEach((slide, idx) => {
    slide.classList.toggle("active", idx === slideIndex);
  });
}

function nextSlide() {
  const slides = document.querySelectorAll(".slideshow img");
  if (slides.length === 0) return;
  
  slideIndex = (slideIndex + 1) % slides.length;
  showSlides();
}

function prevSlide() {
  const slides = document.querySelectorAll(".slideshow img");
  if (slides.length === 0) return;
  
  slideIndex = (slideIndex - 1 + slides.length) % slides.length;
  showSlides();
}

function startSlideshow() {
  slideInterval = setInterval(nextSlide, 4000); 
}

function stopSlideshow() {
  clearInterval(slideInterval);
}

// Coffee type slideshow (for coffee.html)
let coffeeSlideIndex = 0;
let coffeeSlideInterval;

function showCoffeeSlides() {
  const slides = document.querySelectorAll(".coffee-slide");
  if (slides.length === 0) return;
  
  slides.forEach((slide, idx) => {
    slide.classList.toggle("active", idx === coffeeSlideIndex);
  });
}

function nextCoffeeSlide() {
  const slides = document.querySelectorAll(".coffee-slide");
  if (slides.length === 0) return;
  
  coffeeSlideIndex = (coffeeSlideIndex + 1) % slides.length;
  showCoffeeSlides();
}

function startCoffeeSlideshow() {
  coffeeSlideInterval = setInterval(nextCoffeeSlide, 3000); 
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Add loading animation to buttons
function addLoadingToButton(button) {
  const originalText = button.textContent;
  button.innerHTML = '<span class="loading"></span> Loading...';
  button.disabled = true;
  
  setTimeout(() => {
    button.textContent = originalText;
    button.disabled = false;
  }, 1000);
}

// Form validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Newsletter signup
function handleNewsletterSignup(event) {
  event.preventDefault();
  const email = event.target.querySelector('input[type="email"]').value;
  
  if (!validateEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }
  
  // Simulate signup process
  const submitBtn = event.target.querySelector('button[type="submit"]');
  addLoadingToButton(submitBtn);
  
  setTimeout(() => {
    alert('Thank you for subscribing! Check your email for your 10% discount code.');
    if (modal) modal.style.display = "none";
    event.target.reset();
  }, 1000);
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Initialize mobile navigation
  const hamburger = document.getElementById('hamburger');
  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }
  
  // Close mobile menu when clicking on links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const navMenu = document.getElementById('nav-menu');
      const hamburger = document.getElementById('hamburger');
      if (navMenu && hamburger && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  });
  
  // Initialize persistent audio
  initializePersistentAudio();
  
  // Handle page visibility changes
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  // Initialize main slideshow
  showSlides();
  startSlideshow();
  
  // Initialize coffee slideshow if on coffee page
  if (document.querySelector('.coffee-slideshow')) {
    showCoffeeSlides();
    startCoffeeSlideshow();
  }
  
  // Add event listeners for slideshow navigation
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      stopSlideshow();
      prevSlide();
      startSlideshow();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      stopSlideshow();
      nextSlide();
      startSlideshow();
    });
  }
  
  // Newsletter form handling
  const newsletterForm = document.querySelector('#modal form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', handleNewsletterSignup);
  }
  
  // Registration form handling
  const registrationForm = document.querySelector('main form');
  if (registrationForm && !registrationForm.closest('#modal')) {
    registrationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const submitBtn = this.querySelector('button[type="submit"]');
      addLoadingToButton(submitBtn);
      
      setTimeout(() => {
        alert('Registration successful! We will contact you soon with more details.');
        this.reset();
      }, 1000);
    });
  }
  
  // Add hover effects to navigation
  const navLinksHover = document.querySelectorAll('nav a');
  navLinksHover.forEach(link => {
    link.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    link.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Add scroll effect to header
  window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (nav) {
      if (window.scrollY > 50) {
        nav.style.background = 'rgba(74, 44, 42, 0.95)';
        nav.style.backdropFilter = 'blur(10px)';
      } else {
        nav.style.background = 'var(--gradient-primary)';
        nav.style.backdropFilter = 'none';
      }
    }
  });
  
  // Add animation to items on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  // Observe all items that should animate on scroll
  document.querySelectorAll('.coffee-item, .equipment-item, .event-item, .offer-item, .gitem').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });
});

// Utility functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Handle window resize
window.addEventListener('resize', debounce(() => {
  // Restart slideshows on resize
  if (document.querySelector('.slideshow')) {
    showSlides();
  }
  if (document.querySelector('.coffee-slideshow')) {
    showCoffeeSlides();
  }
}, 250));

// Export functions for use in other files
window.BeanBoutique = {
  toggleAudio,
  showSlides,
  nextSlide,
  prevSlide,
  validateEmail,
  addLoadingToButton,
  toggleMobileMenu
};