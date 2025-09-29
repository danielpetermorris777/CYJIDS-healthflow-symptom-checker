document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Symptom Checker Logic ---
    const checkSymptomsButton = document.getElementById('check-symptoms');
    const symptomResultsDiv = document.getElementById('results');
    const symptomCheckboxes = document.querySelectorAll('.symptom-list input[type="checkbox"]');

    const commonAilments = {
        // Respiratory/Cold
        'cold': ['runny-nose', 'sneezing', 'sore-throat', 'headache'],
        // Flu-like
        'flu': ['fever', 'cough', 'body-aches', 'fatigue', 'headache'],
        // Gastro-related
        'gastro': ['nausea', 'stomach-pain', 'fever'],
    };

    const checkerMessages = {
        'cold': "You have selected symptoms common to a *Cold*. Rest, stay hydrated, and consider over-the-counter relief. Symptoms are usually mild.",
        'flu': "Your symptoms are highly suggestive of a *Flu-like illness*. The flu can be serious. We recommend contacting a healthcare professional, especially if your fever is high.",
        'gastro': "Your symptoms suggest a *Gastrointestinal upset* (Stomach Flu/Bug). Focus on fluids and a bland diet. Seek immediate help if symptoms are severe or persistent.",
        'mixed': "Your symptoms are a *mix of common ailments*. It could be one or several things. Monitor your symptoms, and see a doctor if they worsen or do not improve.",
        'minor': "You have selected *minor symptoms*. Rest and hydration are usually all that's needed. If you feel worse, please check again or call a doctor.",
        'none': "Please select at least one symptom to check."
    };

    checkSymptomsButton.addEventListener('click', () => {
        const selectedSymptoms = Array.from(symptomCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.dataset.symptom);

        if (selectedSymptoms.length === 0) {
            symptomResultsDiv.innerHTML = `<i class="fas fa-exclamation-triangle icon-bullet"></i> ${checkerMessages.none}`;
            return;
        }

        let bestMatch = 'minor';
        let maxMatchCount = 0;

        for (const [ailment, symptoms] of Object.entries(commonAilments)) {
            const matchCount = selectedSymptoms.filter(symptom => symptoms.includes(symptom)).length;
            
            // Check for a strong match (at least 3 symptoms)
            if (matchCount >= 3 && matchCount > maxMatchCount) {
                maxMatchCount = matchCount;
                bestMatch = ailment;
            } else if (matchCount >= 3 && matchCount === maxMatchCount) {
                // If two ailments match equally well, it's a "mixed" case
                bestMatch = 'mixed';
            }
        }
        
        // If no strong match, but some symptoms were selected
        if (maxMatchCount === 0 && selectedSymptoms.length > 0) {
            bestMatch = 'minor';
        }

    symptomResultsDiv.innerHTML = `<i class="fas fa-hand-holding-medical icon-bullet"></i> ${checkerMessages[bestMatch]}`;
    });


    // --- 2. Fun Interactive Quiz Logic ---
    const quizQuestionEl = document.getElementById('quiz-question');
    const quizButtons = document.querySelectorAll('.quiz-button');
    const quizResultEl = document.getElementById('quiz-result');
    const quizResetButton = document.getElementById('quiz-reset');
    const interactiveCard = document.querySelector('.interactive-card');

    let currentQuestion = 0;
    let sickScore = 0;

    const quizQuestions = [
        { 
            question: "Question 1: Are you constantly reaching for a tissue?", 
            yesScore: 1, 
            noScore: 0 
        },
        { 
            question: "Question 2: Does the thought of moving from the couch feel like a marathon?", 
            yesScore: 2, 
            noScore: 0 
        },
        { 
            question: "Question 3: Is your throat scratchy, or does your head feel foggy?", 
            yesScore: 2, 
            noScore: 0 
        },
        { 
            question: "Question 4: Do you feel colder than everyone else in the room?", 
            yesScore: 1, 
            noScore: 0 
        }
    ];

    const displayQuestion = () => {
        if (currentQuestion < quizQuestions.length) {
            quizQuestionEl.textContent = quizQuestions[currentQuestion].question;
            quizButtons.forEach(btn => {
                btn.classList.remove('selected');
                btn.disabled = false;
                btn.style.display = 'inline-block';
            });
            quizResultEl.classList.add('hidden');
            quizResetButton.classList.add('hidden');
        } else {
            showResults();
        }
    };

    const showResults = () => {
        let resultMessage = '';
        let resultIcon = '';

        if (sickScore >= 6) {
            resultIcon = 'fas fa-head-side-mask';
            resultMessage = "Uh Oh! Your body is sending out *'Take a Break' signals!* You might be coming down with something serious. Time to power down, get some rest, and maybe drink some hot tea!";
        } else if (sickScore >= 3) {
            resultIcon = 'fas fa-mug-hot';
            resultMessage = "You're at *Half-Power*. Your immune system is on high alert. Take it easy today, stay hydrated, and listen to your body before it escalates!";
        } else {
            resultIcon = 'fas fa-hand-peace';
            resultMessage = "You're *Good to Go!* Your score is low, but remember to maintain your healthy habits. You're fighting fit!";
        }

    quizQuestionEl.textContent = "Quiz Complete!";
    quizResultEl.innerHTML = `<i class="${resultIcon} icon-bullet"></i> ${resultMessage}`;
    quizResultEl.classList.remove('hidden');

        quizButtons.forEach(btn => btn.style.display = 'none');
        quizResetButton.classList.remove('hidden');
    };

    const handleAnswer = (event) => {
        const answer = event.target.dataset.answer;
        const q = quizQuestions[currentQuestion];

        if (answer === 'yes') {
            sickScore += q.yesScore;
        } else {
            sickScore += q.noScore;
        }

        event.target.classList.add('selected');
        
        // Disable buttons for a moment to show selection
        quizButtons.forEach(btn => btn.disabled = true);

        // Move to the next question after a brief delay
        setTimeout(() => {
            currentQuestion++;
            displayQuestion();
        }, 500);
    };

    const resetQuiz = () => {
        currentQuestion = 0;
        sickScore = 0;
        displayQuestion();
    };

    quizButtons.forEach(button => button.addEventListener('click', handleAnswer));
    quizResetButton.addEventListener('click', resetQuiz);

    // Initialize the quiz on load
    displayQuestion();

    // Smooth Scroll Effect for Navbar links
    document.querySelectorAll('.nav-links a, .hero-section a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

});