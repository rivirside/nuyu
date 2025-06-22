// js/main.js

document.addEventListener('DOMContentLoaded', () => {

    // --- NEW: Sticky Header Logic ---
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
          if (window.scrollY > 10) {
            header.classList.add('bg-black/90', 'border-b', 'border-white/10');
          } else {
            header.classList.remove('bg-black/90', 'border-b', 'border-white/10');
          }
        });
    }

    // --- Mobile Menu Logic ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            // Close mobile menu on link click
            if(mobileMenu && !mobileMenu.classList.contains('hidden')){
                mobileMenu.classList.add('hidden'); 
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- FAQ Accordion Logic ---
    const faqContainer = document.getElementById('faq-container');
    if (faqContainer) {
        const faqQuestions = faqContainer.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(button => {
            button.addEventListener('click', () => {
                const answer = button.nextElementSibling;
                const icon = button.querySelector('.faq-icon');
                const isOpening = answer.classList.contains('hidden');

                // Close all other answers
                faqContainer.querySelectorAll('.faq-answer').forEach(ans => ans.classList.add('hidden'));
                faqContainer.querySelectorAll('.faq-icon').forEach(icn => icn.classList.remove('rotate-180'));

                // Open the clicked answer if it was closed
                if (isOpening) {
                    answer.classList.remove('hidden');
                    icon.classList.add('rotate-180');
                }
            });
        });
    }
});