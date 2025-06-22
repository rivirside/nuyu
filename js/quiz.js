// js/quiz.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Sleep Quiz JS Elements ---
    const startQuizButton = document.getElementById('start-quiz-button');
    const quizModal = document.getElementById('quiz-modal');
    const quizContainer = document.getElementById('quiz-container');
    const closeQuizButton = document.getElementById('close-quiz-button');
    const quizContent = document.getElementById('quiz-content');
    const backButton = document.getElementById('back-button');
    const nextButton = document.getElementById('next-button');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const quizTitle = document.getElementById('quiz-title');

    // Return early if quiz elements aren't on the page
    if (!startQuizButton) return;

    let currentQuestionIndex = 0;
    let userAnswers = {};
    let radarChart = null;

    // --- Quiz Questions Definition (based on research document) ---
    const quizQuestions = [
        { id: 'work_bed_time', text: "On a typical **work night** (the night before a workday), what time do you intend to go to bed?", type: 'time-dropdowns', dimension: 'Timing', tip: 'Your body\'s internal clock, or "chronotype", dictates your natural preference for sleeping and waking times. Being a "night owl" or "morning lark" is biological.' },
        { id: 'work_wake_time', text: "On the following **work morning**, what time do you usually get up?", type: 'time-dropdowns', dimension: 'Timing' },
        { id: 'free_bed_time', text: "On a typical **free night** (e.g., Saturday night), what time do you intend to go to bed?", type: 'time-dropdowns', dimension: 'Timing' },
        { id: 'free_wake_time', text: "On the following **free morning**, what time do you usually get up?", type: 'time-dropdowns', dimension: 'Timing', tip: "The difference between your weekday and weekend sleep schedules is called 'social jetlag'. Keeping it under 1 hour can improve alertness." },
        { id: 'work_actual_sleep', text: "On that typical **work night**, how many hours of actual sleep do you get? (This may be different from the time you spend in bed).", type: 'duration', dimension: 'Duration' },
        { id: 'free_actual_sleep', text: "On that typical **free night**, how many hours of actual sleep do you get?", type: 'duration', dimension: 'Duration', tip: "While needs vary, the American Academy of Sleep Medicine recommends most adults get 7 or more hours of sleep per night for optimal health." },
        { id: 'sleep_latency', text: "On a typical night, about how long (in minutes) does it usually take you to fall asleep?", type: 'number', placeholder: "e.g., 20", dimension: 'Disturbances', tip: "This is called 'sleep latency'. Consistently taking longer than 30 minutes to fall asleep is a key indicator of sleep-onset insomnia." },
        { id: 'latency_trouble_freq', text: "Over the past month, how often have you had trouble sleeping because you **cannot get to sleep within 30 minutes**?", type: 'radio', options: ['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week'], dimension: 'Disturbances', tip: "Difficulty falling asleep can be improved with a consistent, relaxing wind-down routine that signals to your body that it's time for bed." },
        { id: 'staying_asleep_severity', text: "Over the past month, how much of a problem has it been for you to **stay asleep**?", type: 'radio', options: ['None', 'Mild', 'Moderate', 'Severe', 'Very Severe'], dimension: 'Disturbances', tip: "Waking up at night is normal, but difficulty falling back asleep can fragment sleep and reduce its restorative quality." },
        { id: 'disturbances_freq', text: "Over the past month, how often have you had trouble sleeping due to waking up in the middle of the night or early morning?", type: 'radio', options: ['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week'], dimension: 'Disturbances', tip: "A cool, dark, and quiet room is fundamental to continuous sleep. Many environmental factors can cause awakenings." },
        { id: 'overall_quality', text: "Over the past month, how would you rate your sleep quality overall?", type: 'radio', options: ['Very good', 'Fairly good', 'Fairly bad', 'Very bad'], dimension: 'Satisfaction', tip: "Sleep quality is your personal, subjective appraisal of your sleep. It's a powerful predictor of well-being, separate from just the hours you sleep." },
        { id: 'satisfaction', text: "How **satisfied** are you with your current sleep pattern?", type: 'radio', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'], dimension: 'Satisfaction', tip: "Your satisfaction with sleep is a key component of overall sleep health. Even with enough hours, dissatisfaction can signal underlying issues." },
        { id: 'ess_composite', text: "What is the chance you would doze off in the following situations? (Unlike feeling tired, this is about actually falling asleep).", type: 'ess', dimension: 'Alertness', tip: "This measures 'daytime sleepiness', a key indicator of whether your sleep is truly restorative. High scores can sometimes point to underlying sleep disorders." },
        { id: 'daytime_dysfunction_freq', text: "Over the past month, how often have you had trouble staying awake while driving, eating meals, or engaging in social activity?", type: 'radio', options: ['Not during the past month', 'Less than once a week', 'Once or twice a week', 'Three or more times a week'], dimension: 'Alertness' },
        { id: 'interference_severity', text: "To what extent do you consider your sleep problem to **interfere** with your daily functioning (e.g., fatigue, concentration, mood)?", type: 'radio', options: ['Not at all', 'A little', 'Somewhat', 'Much', 'Very much'], dimension: 'Alertness', tip: "The ultimate goal of healthy sleep is not just to feel good at night, but to have the energy and focus to thrive during the day. This is a key measure of overall sleep health." }
    ];
    
    const essSituations = ['Sitting and reading', 'Watching TV', 'Sitting inactive in a public place', 'As a passenger in a car for an hour', 'Lying down to rest in the afternoon', 'Sitting and talking to someone', 'Sitting quietly after lunch', 'In a car, stopped in traffic'];


    // --- Quiz Flow Control ---
    function openQuiz() {
        quizModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
            quizModal.classList.remove('opacity-0');
            quizContainer.classList.remove('scale-95');
        }, 10);
        currentQuestionIndex = 0;
        userAnswers = {};
        renderQuestion();
    }

    function closeQuiz() {
        quizModal.classList.add('opacity-0');
        quizContainer.classList.add('scale-95');
        document.body.style.overflow = '';
        setTimeout(() => {
            quizModal.classList.add('hidden');
            quizContent.innerHTML = ''; // Clear content for next time
            if(radarChart) radarChart.destroy();
        }, 300);
    }

    function renderQuestion() {
        if (currentQuestionIndex >= quizQuestions.length) {
            showResults();
            return;
        }

        const question = quizQuestions[currentQuestionIndex];
        let html = `<h3 class="text-2xl font-semibold mb-6">${question.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-violet-400">$1</strong>')}</h3>`;

        switch (question.type) {
            case 'time-dropdowns':
                const answer = userAnswers[question.id] || { hour: '', minute: '', ampm: '' };
                html += '<div class="flex gap-2">';
                // Hour dropdown
                html += `<select id="${question.id}-hour" class="custom-select w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-violet-500 focus:outline-none appearance-none">`;
                html += '<option value="" disabled selected>Hour</option>';
                for (let i = 1; i <= 12; i++) {
                    html += `<option value="${i}" ${answer.hour == i ? 'selected' : ''}>${i}</option>`;
                }
                html += '</select>';
                // Minute dropdown
                html += `<select id="${question.id}-minute" class="custom-select w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-violet-500 focus:outline-none appearance-none">`;
                html += '<option value="" disabled selected>Min</option>';
                ['00', '15', '30', '45'].forEach(min => {
                    html += `<option value="${min}" ${answer.minute == min ? 'selected' : ''}>${min}</option>`;
                });
                html += '</select>';
                // AM/PM dropdown
                html += `<select id="${question.id}-ampm" class="custom-select w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-violet-500 focus:outline-none appearance-none">`;
                html += '<option value="" disabled selected>AM/PM</option>';
                ['AM', 'PM'].forEach(p => {
                    html += `<option value="${p}" ${answer.ampm == p ? 'selected' : ''}>${p}</option>`;
                });
                html += '</select></div>';
                break;
            case 'duration':
            case 'number':
                html += `<input type="number" id="${question.id}" value="${userAnswers[question.id] || ''}" placeholder="${question.placeholder || 'e.g., 7'}" class="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 focus:ring-2 focus:ring-violet-500 focus:outline-none">`;
                if (question.type === 'duration') html += `<span class="text-sm text-gray-400 mt-1">Enter hours. For 7.5 hours, enter 7.5</span>`;
                break;
            case 'radio':
                html += '<div class="space-y-3">';
                question.options.forEach((option, index) => {
                    const isChecked = userAnswers[question.id] === index;
                    html += `
                        <label class="flex items-center p-4 rounded-lg border border-gray-700 hover:bg-gray-800 cursor-pointer transition-colors ${isChecked ? 'bg-gray-800 border-violet-500' : ''}">
                            <input type="radio" name="${question.id}" value="${index}" class="custom-radio appearance-none h-5 w-5 border-2 border-gray-500 rounded-full transition-colors" ${isChecked ? 'checked' : ''}>
                            <span class="ml-4 text-lg">${option}</span>
                        </label>`;
                });
                html += '</div>';
                break;
            case 'ess':
                html += '<div class="space-y-4">';
                essSituations.forEach((sit, index) => {
                    html += `<div class="p-3 bg-gray-800 rounded-lg">
                                <p class="mb-2">${sit}</p>
                                <div class="flex justify-between space-x-2">`;
                    ['No chance', 'Slight', 'Moderate', 'High'].forEach((label, val) => {
                        const isChecked = userAnswers[question.id] && userAnswers[question.id][index] === val;
                        html += `<label class="flex-1 text-center cursor-pointer p-2 rounded-md transition-colors ${isChecked ? 'bg-violet-600' : 'bg-gray-700 hover:bg-gray-600'}">
                                    <input type="radio" name="ess_${index}" value="${val}" class="sr-only" ${isChecked ? 'checked' : ''}>
                                    <span class="text-sm">${label}</span>
                                </label>`;
                    });
                    html += `</div></div>`;
                });
                html += '</div>';
                break;
        }
        
        if (question.tip) {
            html += `<div class="mt-8 p-4 bg-violet-900/20 border border-violet-500/30 rounded-lg text-violet-200">
                        <p class="font-bold">Did you know?</p>
                        <p>${question.tip}</p>
                    </div>`;
        }

        quizContent.innerHTML = html;
        addAnswerListeners();
        updateNavButtons();
    }

    function addAnswerListeners() {
        const question = quizQuestions[currentQuestionIndex];
        switch (question.type) {
            case 'time-dropdowns':
                const hourEl = document.getElementById(`${question.id}-hour`);
                const minuteEl = document.getElementById(`${question.id}-minute`);
                const ampmEl = document.getElementById(`${question.id}-ampm`);
                [hourEl, minuteEl, ampmEl].forEach(el => {
                    el.addEventListener('change', () => {
                        if (hourEl.value && minuteEl.value && ampmEl.value) {
                            userAnswers[question.id] = {
                                hour: hourEl.value,
                                minute: minuteEl.value,
                                ampm: ampmEl.value
                            };
                        }
                        updateNavButtons();
                    });
                });
                break;
            case 'duration':
            case 'number':
                document.getElementById(question.id).addEventListener('input', (e) => {
                    userAnswers[question.id] = e.target.value;
                    updateNavButtons();
                });
                break;
            case 'radio':
                document.querySelectorAll(`input[name="${question.id}"]`).forEach(radio => {
                    radio.addEventListener('change', (e) => {
                        userAnswers[question.id] = parseInt(e.target.value);
                        renderQuestion(); // Re-render to show selection style
                        updateNavButtons();
                    });
                });
                break;
            case 'ess':
                if(!userAnswers[question.id]) userAnswers[question.id] = Array(essSituations.length).fill(null);
                essSituations.forEach((sit, index) => {
                    document.querySelectorAll(`input[name="ess_${index}"]`).forEach(radio => {
                        radio.addEventListener('change', (e) => {
                            userAnswers[question.id][index] = parseInt(e.target.value);
                            renderQuestion(); // Re-render to show selection style
                            updateNavButtons();
                        });
                    });
                });
                break;
        }
    }

    function updateNavButtons() {
        const question = quizQuestions[currentQuestionIndex];
        let isAnswered = false;
        if (question) {
            if (question.type === 'ess') {
                isAnswered = userAnswers[question.id] && userAnswers[question.id].every(a => a !== null);
            } else if (question.type === 'time-dropdowns') {
                const answer = userAnswers[question.id];
                isAnswered = answer && answer.hour && answer.minute && answer.ampm;
            } else {
                isAnswered = userAnswers[question.id] !== undefined && userAnswers[question.id] !== '';
            }
        }

        nextButton.disabled = !isAnswered;
        backButton.style.display = currentQuestionIndex > 0 ? 'block' : 'none';
        progressBarFill.style.width = `${(currentQuestionIndex / quizQuestions.length) * 100}%`;
        quizTitle.textContent = currentQuestionIndex >= quizQuestions.length ? 'Your Sleep Results' : 'Your Sleep Fingerprint';
    }
    
    function handleNext() {
        if (currentQuestionIndex < quizQuestions.length) {
            currentQuestionIndex++;
            renderQuestion();
        }
    }

    function handleBack() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    }

    // --- Scoring and Archetype Logic ---
    function calculateScores() {
        const ans = userAnswers;
        const scores = {};

        // Helper to convert dropdown time to 24-hour minutes from midnight
        const timeToMinutes = (timeObj) => {
            if (!timeObj || !timeObj.hour || !timeObj.minute || !timeObj.ampm) return 0;
            let hour = parseInt(timeObj.hour);
            const minute = parseInt(timeObj.minute);
            if (timeObj.ampm === 'PM' && hour !== 12) {
                hour += 12;
            }
            if (timeObj.ampm === 'AM' && hour === 12) { // Midnight case
                hour = 0;
            }
            return hour * 60 + minute;
        };

        // 1. DURATION
        const workSleep = parseFloat(ans.work_actual_sleep) || 0;
        const freeSleep = parseFloat(ans.free_actual_sleep) || 0;
        const avgDuration = ((workSleep * 5) + (freeSleep * 2)) / 7;
        if (avgDuration >= 7) scores.Duration = 0;
        else if (avgDuration >= 6) scores.Duration = 1;
        else if (avgDuration >= 5) scores.Duration = 2;
        else scores.Duration = 3;

        // 2. TIMING & REGULARITY
        const workBed = timeToMinutes(ans.work_bed_time);
        let workWake = timeToMinutes(ans.work_wake_time);
        if (workWake <= workBed) workWake += 1440;
        const workSleepDurationMins = (workWake - workBed);
        const midSleepWork = (workBed + workSleepDurationMins / 2) % 1440;

        const freeBed = timeToMinutes(ans.free_bed_time);
        let freeWake = timeToMinutes(ans.free_wake_time);
        if (freeWake <= freeBed) freeWake += 1440;
        const freeSleepDurationMins = (freeWake - freeBed);
        const midSleepFree = (freeBed + freeSleepDurationMins / 2) % 1440;
        
        const socialJetlag = Math.abs(midSleepFree - midSleepWork) / 60; // in hours
        if (socialJetlag < 1) scores.Regularity = 0;
        else if (socialJetlag < 2) scores.Regularity = 1;
        else if (socialJetlag < 3) scores.Regularity = 2;
        else scores.Regularity = 3;
        
        const MSFhours = midSleepFree / 60;
        if (MSFhours >= 3 && MSFhours <= 5) scores.Timing = 0; // Intermediate
        else if ((MSFhours >= 2 && MSFhours < 3) || (MSFhours > 5 && MSFhours <= 6)) scores.Timing = 1; // Moderate
        else if ((MSFhours >= 1 && MSFhours < 2) || (MSFhours > 6 && MSFhours <= 7)) scores.Timing = 2; // Very
        else scores.Timing = 3; // Extreme
        
        // 3. EFFICIENCY
        const timeInBedWork = workSleepDurationMins > 0 ? workSleepDurationMins / 60 : 0;
        const sleepEfficiency = timeInBedWork > 0 ? (workSleep / timeInBedWork) * 100 : 0;
        if(sleepEfficiency >= 85) scores.Efficiency = 0;
        else if (sleepEfficiency >= 75) scores.Efficiency = 1;
        else if (sleepEfficiency >= 65) scores.Efficiency = 2;
        else scores.Efficiency = 3;
        
        // 4. SATISFACTION
        const qualityScore = ans.overall_quality || 0;
        const satisfactionScore = ans.satisfaction !== undefined ? (4 - ans.satisfaction) : 0;
        scores.Satisfaction = Math.round(((qualityScore / 3 * 3) + (satisfactionScore / 4 * 3)) / 2);
        
        // 5. ALERTNESS
        const essScore = ans.ess_composite ? ans.ess_composite.reduce((a, b) => a + (b || 0), 0) : 0;
        let essBinScore;
        if(essScore <= 5) essBinScore = 0;
        else if (essScore <= 10) essBinScore = 1;
        else if (essScore <= 15) essBinScore = 2;
        else essBinScore = 3;
        const dysfunctionScore = ans.daytime_dysfunction_freq || 0;
        const interferenceScore = ans.interference_severity !== undefined ? Math.round(ans.interference_severity / 4 * 3) : 0;
        scores.Alertness = Math.round((essBinScore + dysfunctionScore + interferenceScore) / 3);

        // 6. DISTURBANCES
        const latencyMin = parseInt(ans.sleep_latency) || 0;
        let latencySubscore1 = 0;
        if (latencyMin > 60) latencySubscore1 = 3;
        else if (latencyMin > 30) latencySubscore1 = 2;
        else if (latencyMin > 15) latencySubscore1 = 1;
        const latencySubscore2 = ans.latency_trouble_freq || 0;
        let latencyScore = 0;
        const latencySum = latencySubscore1 + latencySubscore2;
        if (latencySum >= 5) latencyScore = 3;
        else if (latencySum >= 3) latencyScore = 2;
        else if (latencySum >= 1) latencyScore = 1;

        const maintenanceScore = ans.staying_asleep_severity !== undefined ? Math.round(ans.staying_asleep_severity / 4 * 3) : 0;
        const specificDisturbanceScore = ans.disturbances_freq || 0;
        scores.Disturbances = Math.round((latencyScore + maintenanceScore + specificDisturbanceScore) / 3);
        
        return scores;
    }

    function determineArchetype(scores) {
        if (scores.Regularity >= 2 && scores.Timing >= 2) {
            return {
                title: 'The Socially Jet-Lagged Professional',
                description: "You're disciplined, but your body's internal clock is often at odds with your demanding schedule. The significant shift between your weekday and weekend routines creates 'social jetlag', leaving you feeling perpetually out-of-sync."
            };
        }
        if (scores.Disturbances >= 2 && scores.Satisfaction >= 2 && scores.Alertness >= 2) {
            return {
                title: 'The Wired and Tired Insomniac',
                description: 'Bedtime feels like a battle. You struggle to fall or stay asleep, leading to frustration and significant daytime fatigue. Your mind feels "wired" at night, but your body is "tired" during the day.'
            };
        }
        if (scores.Duration >= 2 && scores.Timing >= 2 && scores.Alertness >=2) {
            return {
                title: 'The Overextended Night Owl',
                description: "You're a natural night owl living in an early-bird world. This mismatch forces you to burn the candle at both ends, resulting in chronic sleep deprivation that severely impacts your daytime energy and focus."
            };
        }
        if (scores.Efficiency < 2 && scores.Duration < 2 && scores.Satisfaction < 2 && scores.Regularity < 2) {
            return {
                title: 'The Resilient Sleeper',
                description: "You have a strong, consistent sleep routine. Your sleep is efficient, restful, and well-aligned with your internal clock. This solid foundation supports your physical and mental well-being during the day."
            };
        }
        return {
            title: 'The Mixed Sleeper',
            description: "Your sleep profile shows a mix of strengths and weaknesses. While some aspects of your sleep are healthy, there are specific areas that could be improved to enhance your overall restfulness and daytime performance."
        };
    }
    
    function showResults() {
        const finalScores = calculateScores();
        const archetype = determineArchetype(finalScores);
        const scoreValues = [
            finalScores.Timing, finalScores.Regularity, finalScores.Duration, 
            finalScores.Efficiency, finalScores.Satisfaction, finalScores.Alertness, 
            finalScores.Disturbances
        ];
        
        // Invert scores for the chart (higher is better)
        const chartScores = scoreValues.map(s => 3 - s);

        let resultsHTML = `
            <div class="text-center">
                <h3 class="text-lg font-semibold text-violet-400">YOUR SLEEP ARCHETYPE IS...</h3>
                <h2 class="text-4xl font-bold mt-2 mb-4">${archetype.title}</h2>
                <p class="text-gray-300 max-w-xl mx-auto">${archetype.description}</p>
            </div>

            <div class="my-8 max-w-md mx-auto">
                <canvas id="results-chart"></canvas>
            </div>
            
            <div class="p-6 bg-gray-800 rounded-lg">
                <h3 class="text-xl font-bold text-center mb-4">Save Your Full Report</h3>
                <p class="text-center text-gray-400 mb-4">Get a detailed PDF with your scores, the science behind them, and personalized tips.</p>
                <div class="text-center">
                   <button id="save-pdf-button" class="px-8 py-4 font-semibold text-white rounded-lg btn-gradient">Save or Print Report</button>
                </div>
            </div>
        `;

        quizContent.innerHTML = resultsHTML;
        nextButton.style.display = 'none';
        backButton.style.display = 'none';
        progressBarFill.style.width = '100%';

        const ctx = document.getElementById('results-chart').getContext('2d');
        if(radarChart) radarChart.destroy();
        radarChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Timing', 'Regularity', 'Duration', 'Efficiency', 'Satisfaction', 'Alertness', 'Disturbances'],
                datasets: [{
                    label: 'Your Sleep Fingerprint',
                    data: chartScores,
                    backgroundColor: 'rgba(139, 92, 246, 0.2)',
                    borderColor: 'rgba(139, 92, 246, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(139, 92, 246, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(139, 92, 246, 1)'
                }]
            },
            options: {
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 3,
                        ticks: {
                            display: false,
                            stepSize: 1
                        },
                        pointLabels: {
                            font: { size: 14 },
                            color: '#E4E4E7'
                        },
                        grid: { color: 'rgba(255, 255, 255, 0.2)' },
                        angleLines: { color: 'rgba(255, 255, 255, 0.2)' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
        
        document.getElementById('save-pdf-button').addEventListener('click', () => {
            generatePdf(finalScores, archetype);
        });
    }
    
    function generatePdf(scores, archetype) {
        // Change chart colors to be dark for printing on a light background
        radarChart.options.scales.r.pointLabels.color = '#333333';
        radarChart.options.scales.r.grid.color = 'rgba(0, 0, 0, 0.1)';
        radarChart.options.scales.r.angleLines.color = 'rgba(0, 0, 0, 0.1)';
        radarChart.options.plugins.legend.labels.color = '#333333';
        radarChart.data.datasets[0].borderColor = 'rgba(139, 92, 246, 0.8)';
        radarChart.data.datasets[0].pointBackgroundColor = 'rgba(139, 92, 246, 0.8)';
        radarChart.update();
        
        const chartImage = radarChart.toBase64Image();
        
        // Change colors back for on-screen display
        radarChart.options.scales.r.pointLabels.color = '#E4E4E7';
        radarChart.options.scales.r.grid.color = 'rgba(255, 255, 255, 0.2)';
        radarChart.options.scales.r.angleLines.color = 'rgba(255, 255, 255, 0.2)';
        radarChart.data.datasets[0].borderColor = 'rgba(139, 92, 246, 1)';
        radarChart.data.datasets[0].pointBackgroundColor = 'rgba(139, 92, 246, 1)';
        radarChart.update();

        const recommendations = {
            Timing: [
                "Try to wake up at the same time every day, even on weekends. This helps to anchor your body's internal clock.",
                "Expose yourself to bright light, preferably sunlight, shortly after waking up to signal to your brain that the day has begun."
            ],
            Regularity: [
                "Aim to keep your 'social jetlag' (the difference in your sleep midpoint between workdays and free days) to less than 60 minutes.",
                "If you need to catch up on sleep, try to go to bed a bit earlier on weekends rather than sleeping in much later."
            ],
            Duration: [
                "Work backward from your necessary wake-up time to set a consistent bedtime that allows for at least 7-8 hours of sleep opportunity.",
                "Prioritize your sleep schedule as you would any other important appointment."
            ],
            Efficiency: [
                "If you don't fall asleep within 20-30 minutes, get out of bed, do a quiet activity in dim light, and return to bed only when you feel sleepy.",
                "Avoid looking at the clock if you wake up during the night, as this can increase anxiety about being awake."
            ],
            Satisfaction: [
                "Reflect on what aspects of your sleep are causing dissatisfaction. Is it the duration, the interruptions, or how you feel in the morning?",
                "Creating a peaceful and comfortable bedroom environment can significantly improve your subjective sleep quality."
            ],
            Alertness: [
                "Address the foundational issues first: ensure you are getting adequate duration and improving your sleep quality and regularity.",
                "Avoid consuming caffeine late in the afternoon or evening, as its stimulating effects can last for many hours."
            ],
            Disturbances: [
                "Establish a relaxing, consistent pre-sleep routine. This could include reading a book, listening to calm music, or taking a warm bath.",
                "Avoid stimulating activities, bright lights, and electronic screens for at least an hour before bed. The blue light from screens can suppress the sleep-promoting hormone melatonin."
            ]
        };

        const archetypeAnalysis = {
            'The Socially Jet-Lagged Professional': "This pattern is a direct visualization of the core concept measured by the MCTQ. The high scores on Timing and Regularity reflect a large discrepancy between the midpoint of sleep on workdays versus free days. This misalignment of the internal circadian clock with the external social clock is a common issue in modern society and is linked to various negative health consequences.",
            'The Wired and Tired Insomniac': "This profile is characteristic of someone with significant insomnia symptoms, as measured by the ISI and PSQI. The high score on the 'Disturbances' dimension (which includes latency and maintenance issues) and 'Satisfaction' are key indicators. The poor 'Efficiency' score is a direct calculation of the time spent awake in bed. The high 'Alertness' score (indicating poor alertness) reflects the daytime consequences that are central to an insomnia diagnosis.",
            'The Overextended Night Owl': "This archetype combines the chronotype assessment of the MCTQ with the daytime sleepiness measure of the ESS. The high score on 'Timing' identifies them as a late chronotype. The critically high score on 'Duration' shows they are not meeting their sleep needs, and the resulting high score on 'Alertness' (from the ESS) confirms the severe impact on their daytime functioning.",
            'The Resilient Sleeper': "Your profile indicates a robust and healthy sleep architecture. Your key strengths are consistency and efficiency. Maintaining these habits is crucial for long-term health. To further optimize, consider fine-tuning your wind-down routine or bedroom environment.",
            'The Mixed Sleeper': "Your profile shows a combination of healthy sleep habits and areas with room for growth. This is very common. The key is to identify your specific challenges—whether it's consistency, duration, or daytime alertness—and apply targeted strategies. Focus on improving one or two dimensions at a time to build momentum towards better sleep."
        };
        
        let recommendationsHTML = '';
        Object.keys(scores).forEach(key => {
            if (scores[key] > 0) {
                recommendationsHTML += `<div class="rec-item"><h4>For Better ${key}:</h4><ul>${recommendations[key].map(r => `<li>${r}</li>`).join('')}</ul></div>`;
            }
        });

        let reportHTML = `
            <html>
            <head>
                <title>Your NuYu Sleep Report</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
                <style>
                    body { font-family: 'Inter', sans-serif; color: #333; margin: 40px; line-height: 1.6; }
                    .page-break { page-break-after: always; }
                    .header { text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 20px; }
                    .header h1 { color: #6d28d9; font-size: 36px; margin: 0; }
                    .header p { font-size: 20px; }
                    .section-title { font-size: 28px; color: #6d28d9; border-bottom: 2px solid #6d28d9; padding-bottom: 10px; margin-top: 40px; margin-bottom: 20px;}
                    .archetype-section { text-align: center; margin-top: 30px; }
                    .archetype-section .subtitle { font-size: 16px; color: #6d28d9; text-transform: uppercase; margin:0; }
                    .archetype-section h2 { font-size: 32px; margin: 10px 0; }
                    .archetype-section .description { font-size: 16px; max-width: 600px; margin: 0 auto; }
                    .chart-container { margin: 40px auto; max-width: 500px; }
                    .chart-container img { width: 100%; height: auto; }
                    .score-item { margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
                    .score-item-header { display: flex; align-items: center; justify-content: space-between; }
                    .score-item h4 { font-size: 20px; margin: 0; }
                    .score-item .score-value { font-size: 20px; font-weight: bold; color: #111; margin: 0; }
                    .rec-item { margin-top: 10px; background-color: #f9fafb; border-left: 4px solid #8B5CF6; padding: 15px; border-radius: 4px; }
                    .rec-item h4 { font-size: 18px; margin-top:0; color: #6d28d9;}
                    .rec-item ul { margin: 0; padding-left: 20px; }
                    .science-box { margin-top: 20px; padding: 20px; border: 1px solid #eee; border-radius: 8px;}
                    .science-box h4 { margin-top:0; font-size: 18px; color: #6d28d9; }
                    .ref-list { font-size: 12px; color: #555; columns: 2; column-gap: 40px; margin-top: 20px; }
                    .ref-list p { margin: 0 0 10px 0; }
                    .disclaimer { margin-top: 40px; font-size: 12px; color: #777; text-align: center; }
                    .disclaimer p { margin: 5px 0; }
                    @media print {
                        body { margin: 20px; }
                        .header h1 { font-size: 28px; }
                        .archetype-section h2 { font-size: 24px; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>Your Sleep Fingerprint Report</h1>
                    <p>Prepared by NuYu</p>
                </div>
                <div class="archetype-section">
                    <p class="subtitle">Your Sleep Archetype</p>
                    <h2>${archetype.title}</h2>
                    <p class="description">${archetype.description}</p>
                </div>
                <div class="chart-container">
                    <img src="${chartImage}" alt="Your sleep radar chart">
                </div>
                
                <h3 class="section-title">How to Read Your Report</h3>
                <p>Your Sleep Fingerprint is visualized on the radar chart above. It maps your results across seven key dimensions of sleep health. The goal is to achieve a large, expansive shape, indicating optimal scores across all dimensions. A smaller, constricted, or "spiky" shape instantly reveals your unique pattern of strengths and areas for improvement. This report will walk you through each dimension, providing targeted, evidence-based recommendations for the areas that need the most attention.</p>
                
                <div class="page-break"></div>

                <h3 class="section-title">Detailed Breakdown & Recommendations</h3>
                <div>`;
        
        Object.keys(scores).forEach(key => {
            reportHTML += `
                    <div class="score-item">
                        <div class="score-item-header">
                            <h4>${key}</h4>
                            <p class="score-value">Score: ${3 - scores[key]} / 3</p>
                        </div>
                        ${scores[key] > 0 ? `<div class="rec-item"><h4>Recommendations for better ${key}:</h4><ul>${recommendations[key].map(r => `<li>${r}</li>`).join('')}</ul></div>` : '<p style="color: green; margin-top: 10px; font-weight: 500;">This is a key strength for you. Keep it up!</p>'}
                    </div>
                `;
        });
        reportHTML += `</div>`;

        reportHTML += `
                <div class="page-break"></div>
                <h3 class="section-title">Understanding Your Archetype: ${archetype.title}</h3>
                <div class="science-box">
                    <p>${archetypeAnalysis[archetype.title]}</p>
                </div>

                <h3 class="section-title">The Science of This Quiz</h3>
                <div class="science-box">
                    <h4>A Multidimensional View of Sleep</h4>
                    <p>Contemporary sleep science recognizes that sleep health is a complex, multidimensional construct. It's not just about duration. This quiz is built on the modern RU_SATED framework, which assesses sleep across several distinct yet interconnected domains: Regularity, Satisfaction, Alertness, Timing, Efficiency, and Duration. Only by measuring all dimensions can a complete and actionable profile of an individual's sleep health be constructed.</p>
                </div>
                 <div class="science-box">
                    <h4>Principles of Valid Measurement</h4>
                    <p>This is not a simple lifestyle questionnaire. It is a psychometric instrument built on the principles of reliability (consistency) and validity (accuracy). The questions are drawn exclusively from gold-standard clinical assessments that have been rigorously validated in scientific research over decades. This ensures your results are meaningful and defensible.</p>
                </div>
                <div class="science-box">
                    <h4>Built on Gold-Standard Instruments</h4>
                    <p>Our hybrid approach selectively combines questions from premier clinical tools to create a holistic assessment:</p>
                    <ul>
                        <li><strong>Pittsburgh Sleep Quality Index (PSQI):</strong> The most widely used instrument for assessing overall sleep quality, efficiency, and disturbances.</li>
                        <li><strong>Munich ChronoType Questionnaire (MCTQ):</strong> The definitive tool for assessing chronotype (your internal clock) and social jetlag.</li>
                        <li><strong>Insomnia Severity Index (ISI):</strong> A brief, powerful tool to quantify the severity of insomnia symptoms.</li>
                        <li><strong>Epworth Sleepiness Scale (ESS):</strong> The global standard for measuring daytime sleepiness.</li>
                    </ul>
                </div>
                
                <div class="page-break"></div>
                
                <h3 class="section-title">A Brief History of Sleep Medicine</h3>
                 <div class="science-box">
                    <p>Our understanding of sleep has evolved dramatically. Ancient cultures often saw sleep as a passive state, a "minor death." For centuries, it remained a mystery. The 19th and early 20th centuries brought initial theories about toxins accumulating during wakefulness. The true revolution began in the 1950s with the discovery of Rapid Eye Movement (REM) sleep by Eugene Aserinsky and Nathaniel Kleitman, proving sleep is an active, complex brain state with distinct stages. This opened the door to modern sleep medicine. The 1970s saw the establishment of the first sleep disorder clinics and the classification of conditions like sleep apnea. In recent decades, the focus has shifted to the crucial role of circadian rhythms and the powerful connections between sleep, genetics, and overall physical and mental health.</p>
                </div>

                <h3 class="section-title">References</h3>
                <div class="ref-list">
                    <p>Bastien, C. H., Vallières, A., & Morin, C. M. (2001). Validation of the Insomnia Severity Index as an outcome measure for insomnia research. <em>Sleep medicine, 2</em>(4), 297–307.</p>
                    <p>Buysse, D. J., Reynolds, C. F., Monk, T. H., Berman, S. R., & Kupfer, D. J. (1989). The Pittsburgh Sleep Quality Index: a new instrument for psychiatric practice and research. <em>Psychiatry research, 28</em>(2), 193–213.</p>
                    <p>Buysse, D. J. (2014). Sleep health: can we define it? Does it matter? <em>Sleep, 37</em>(1), 9–17.</p>
                    <p>Johns, M. W. (1991). A new method for measuring daytime sleepiness: the Epworth sleepiness scale. <em>Sleep, 14</em>(6), 540–545.</p>
                    <p>Roenneberg, T., Wirz-Justice, A., & Merrow, M. (2003). Life between clocks: daily temporal patterns of human chronotypes. <em>Journal of biological rhythms, 18</em>(1), 80–90.</p>
                    <p>Wittmann, M., Dinich, J., Merrow, M., & Roenneberg, T. (2006). Social jetlag: misalignment of biological and social time. <em>Chronobiology international, 23</em>(1-2), 497–509.</p>
                </div>

                <div class="disclaimer">
                    <p style="font-weight: bold;">Medical Disclaimer</p>
                    <p>This quiz is an educational screening tool and not a substitute for professional medical advice or diagnosis. The results are intended to promote self-awareness. Individuals with significant concerns should consult a healthcare professional.</p>
                </div>
            </body>
            </html>`;
        
        const reportWindow = window.open('', '_blank');
        reportWindow.document.write(reportHTML);
        reportWindow.document.close();
        reportWindow.focus();
        
        // Use a timeout to allow the window and its content to render before printing
        setTimeout(() => {
            reportWindow.print();
            reportWindow.close();
        }, 500);
    }

    // --- Event Listeners ---
    startQuizButton.addEventListener('click', openQuiz);
    closeQuizButton.addEventListener('click', closeQuiz);
    nextButton.addEventListener('click', handleNext);
    backButton.addEventListener('click', handleBack);
});