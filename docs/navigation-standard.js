// Standard navigation system for nuyu documentation
function getNavigationHTML(pathToRoot = '.') {
    return `
    <h2>nuyu Docs</h2>
    
    <!-- Introduction Section -->
    <div class="nav-section">
        <div class="nav-section-title">
            <span class="chevron">▼</span>
            Introduction
        </div>
        <div class="nav-items">
            <a href="${pathToRoot}/index.html" class="nav-item" data-page="welcome">Welcome</a>
            <a href="${pathToRoot}/01-introduction/what-is-nuyu.html" class="nav-item" data-page="what-is-nuyu">What is nuyu?</a>
            <a href="${pathToRoot}/01-introduction/how-to-use-docs.html" class="nav-item" data-page="how-to-use">How to Use These Docs</a>
        </div>
    </div>
    
    <!-- The nuyu Method Section -->
    <div class="nav-section">
        <div class="nav-section-title">
            <span class="chevron">▼</span>
            The nuyu Method
        </div>
        <div class="nav-items">
            <a href="${pathToRoot}/02-the-nuyu-method/overview.html" class="nav-item" data-page="method-overview">Overview</a>
            
            <!-- Foundations Subsection -->
            <div class="nav-subsection nav-section">
                <div class="nav-section-title">
                    <span class="chevron">▼</span>
                    1. Foundations
                </div>
                <div class="nav-items">
                    <a href="${pathToRoot}/02-the-nuyu-method/01-foundations/00-mind-body-connection.html" class="nav-item" data-page="mind-body">Mind-Body Connection</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/01-foundations/01-the-ancient-quest.html" class="nav-item" data-page="ancient-quest">1. The Ancient Quest</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/01-foundations/02-the-scientific-awakening.html" class="nav-item" data-page="scientific-awakening">2. The Scientific Awakening</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/01-foundations/03-the-rem-revolution.html" class="nav-item" data-page="rem-revolution">3. The REM Revolution</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/01-foundations/04-the-integration-era.html" class="nav-item" data-page="integration-era">4. The Integration Era</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/01-foundations/05-the-modern-synthesis.html" class="nav-item" data-page="modern-synthesis">5. The Modern Synthesis</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/01-foundations/06-neuroplasticity-101.html" class="nav-item" data-page="neuroplasticity">Neuroplasticity 101</a>
                </div>
            </div>
            
            <!-- Sleep as Foundation Subsection -->
            <div class="nav-subsection nav-section">
                <div class="nav-section-title">
                    <span class="chevron">▼</span>
                    2. Sleep as Foundation
                </div>
                <div class="nav-items">
                    <a href="${pathToRoot}/02-the-nuyu-method/02-sleep-as-foundation/01-why-everything-starts-here.html" class="nav-item" data-page="why-sleep">Why Everything Starts Here</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/02-sleep-as-foundation/02-the-first-order-algorithm.html" class="nav-item" data-page="first-order">The First-Order Algorithm</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/02-sleep-as-foundation/03-circadian-architecture.html" class="nav-item" data-page="circadian">Circadian Architecture</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/02-sleep-as-foundation/04-the-cascade-effect.html" class="nav-item" data-page="cascade">The Cascade Effect</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/02-sleep-as-foundation/05-sleep-debt-recovery.html" class="nav-item" data-page="sleep-debt">Sleep Debt & Recovery</a>
                </div>
            </div>
            
            <!-- Design Your System -->
            <div class="nav-subsection nav-section">
                <div class="nav-section-title">
                    <span class="chevron">▼</span>
                    3. Design Your System
                </div>
                <div class="nav-items">
                    <a href="${pathToRoot}/02-the-nuyu-method/03-design-your-system/01-your-sleep-blueprint.html" class="nav-item" data-page="blueprint">Your Sleep Blueprint</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/03-design-your-system/02-discover-your-chronotype.html" class="nav-item" data-page="chronotype">Discover Your Chronotype</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/03-design-your-system/03-ideal-vs-reality.html" class="nav-item" data-page="ideal-reality">Ideal vs Reality</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/03-design-your-system/04-sleep-pressure-timing.html" class="nav-item" data-page="pressure-timing">Sleep Pressure & Timing</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/03-design-your-system/05-your-sleep-window.html" class="nav-item" data-page="window">Your Sleep Window</a>
                </div>
            </div>
            
            <!-- Implementation Science -->
            <div class="nav-subsection nav-section">
                <div class="nav-section-title">
                    <span class="chevron">▼</span>
                    4. Implementation
                </div>
                <div class="nav-items">
                    <a href="${pathToRoot}/02-the-nuyu-method/04-implementation-science/01-behavior-change-science.html" class="nav-item" data-page="behavior-change">Behavior Change Science</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/04-implementation-science/02-ab-testing-your-life.html" class="nav-item" data-page="ab-testing">A/B Testing Your Life</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/04-implementation-science/03-tiny-habits-method.html" class="nav-item" data-page="tiny-habits">Tiny Habits Method</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/04-implementation-science/04-environmental-design.html" class="nav-item" data-page="environment">Environmental Design</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/04-implementation-science/05-habit-loop-engineering.html" class="nav-item" data-page="habit-loop">Habit Loop Engineering</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/04-implementation-science/06-meaningful-metrics.html" class="nav-item" data-page="tracking">Meaningful Metrics</a>
                </div>
            </div>
            
            <!-- Advanced Concepts -->
            <div class="nav-subsection nav-section">
                <div class="nav-section-title">
                    <span class="chevron">▼</span>
                    5. Advanced Concepts
                </div>
                <div class="nav-items">
                    <a href="${pathToRoot}/02-the-nuyu-method/05-advanced-concepts/01-sleep-architecture-deep-dive.html" class="nav-item" data-page="sleep-architecture">Sleep Architecture Deep Dive</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/05-advanced-concepts/02-polyphasic-sleep-experiments.html" class="nav-item" data-page="polyphasic">Polyphasic Sleep Experiments</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/05-advanced-concepts/03-sleep-hacking-protocols.html" class="nav-item" data-page="sleep-hacking">Sleep Hacking Protocols</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/05-advanced-concepts/04-recovery-and-performance.html" class="nav-item" data-page="recovery">Recovery & Performance</a>
                    <a href="${pathToRoot}/02-the-nuyu-method/05-advanced-concepts/05-future-of-sleep-tech.html" class="nav-item" data-page="future-tech">Future of Sleep Tech</a>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Device Mastery Section -->
    <div class="nav-section collapsed">
        <div class="nav-section-title">
            <span class="chevron">▼</span>
            Device Mastery
        </div>
        <div class="nav-items">
            <a href="${pathToRoot}/03-device-mastery/01-getting-started/quick-start-guide.html" class="nav-item" data-page="quick-start">Quick Start Guide</a>
            <a href="${pathToRoot}/03-device-mastery/01-getting-started/first-week-guide.html" class="nav-item" data-page="first-week">Your First Week</a>
            <a href="${pathToRoot}/03-device-mastery/01-getting-started/understanding-your-data.html" class="nav-item" data-page="understanding-data">Understanding Your Data</a>
            <a href="${pathToRoot}/03-device-mastery/02-advanced-usage/advanced-features.html" class="nav-item" data-page="advanced-features">Advanced Features</a>
            <a href="${pathToRoot}/03-device-mastery/02-advanced-usage/troubleshooting.html" class="nav-item" data-page="troubleshooting">Troubleshooting</a>
        </div>
    </div>
    
    <!-- Resources Section -->
    <div class="nav-section collapsed">
        <div class="nav-section-title">
            <span class="chevron">▼</span>
            Resources
        </div>
        <div class="nav-items">
            <a href="${pathToRoot}/04-resources/research-library.html" class="nav-item" data-page="research">Research Library</a>
            <a href="${pathToRoot}/04-resources/community-stories.html" class="nav-item" data-page="community">Community Stories</a>
            <a href="${pathToRoot}/04-resources/support-center.html" class="nav-item" data-page="support">Support Center</a>
        </div>
    </div>
`;
}

function initializeNavigation(currentPage, pathToRoot = '.') {
    // Insert navigation HTML
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.innerHTML = getNavigationHTML(pathToRoot);
    }
    
    // Highlight current page
    if (currentPage) {
        const activeItem = document.querySelector(`[data-page="${currentPage}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            
            // Expand parent sections
            let parent = activeItem.closest('.nav-section');
            while (parent) {
                parent.classList.remove('collapsed');
                parent = parent.parentElement.closest('.nav-section');
            }
        }
    }
    
    // Toggle navigation sections
    document.querySelectorAll('.nav-section-title').forEach(title => {
        title.addEventListener('click', () => {
            const section = title.parentElement;
            section.classList.toggle('collapsed');
        });
    });
}

// Dark mode functionality
function initializeDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    // Check for saved theme preference or default to light
    const currentTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', currentTheme);
    
    // Update icon visibility
    if (currentTheme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
    
    themeToggle.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Toggle icons
        if (newTheme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    });
}

// Apply theme immediately to prevent flash
(function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
})();

// Auto-initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
});