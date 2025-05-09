const assessment = {
    title: "Stress Assessment",
    questions: [
        "I found it hard to wind down",
        "I tended to over-react to situations",
        "I felt that I was using a lot of nervous energy",
        "I found myself getting agitated",
        "I found it difficult to relax",
        "I was intolerant of anything that kept me from getting on with what I was doing",
        "I felt that I was rather touchy"
    ],
    levels: [
        { range: [0, 14], label: "Normal", class: "normal" },
        { range: [15, 18], label: "Mild", class: "mild" },
        { range: [19, 25], label: "Moderate", class: "moderate" },
        { range: [26, 33], label: "Severe", class: "severe" },
        { range: [34, 42], label: "Extremely Severe", class: "extreme" }
    ],

};
let currentState = {
    currentQuestion: 0,
    answers: []
};

const elements = {
    assessmentContainer: document.getElementById('assessment-container'),
    questionContainer: document.getElementById('question-container'),
    questionNumber: document.getElementById('question-number'),
    questionElement: document.getElementById('question'),
    optionsElement: document.getElementById('options'),
    resultContainer: document.getElementById('result-container'),
    resultContent: document.getElementById('result-content'),
    progressBar: document.getElementById('progress-bar'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    resourcesBtn: document.getElementById('resources-btn')
};

function initAssessment(assessmentData) {
    elements.assessmentContainer.style.display = 'block';
    elements.resultContainer.style.display = 'none';
    
    showQuestion(assessmentData);
    
    elements.prevBtn.addEventListener('click', () => prevQuestion(assessmentData));
    elements.nextBtn.addEventListener('click', () => nextQuestion(assessmentData));
    elements.resourcesBtn.addEventListener('click', () => showResources(assessmentData));
}

function showQuestion(assessmentData) {
    elements.questionNumber.textContent = `Question ${currentState.currentQuestion + 1} of ${assessmentData.questions.length}`;
    elements.questionElement.textContent = assessmentData.questions[currentState.currentQuestion];
    elements.optionsElement.innerHTML = '';
    
    const progress = ((currentState.currentQuestion) / assessmentData.questions.length) * 100;
    elements.progressBar.style.width = `${progress}%`;
    
    const optionLabels = [
        "Never (0)",
        "Sometimes (1)",
        "Often (2)",
        "Almost Always (3)"
    ];
    
    optionLabels.forEach((label, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'option';
        radio.value = index;
        radio.id = `option-${index}`;
        if (currentState.answers[currentState.currentQuestion] === index) {
            radio.checked = true;
        }
        
        const labelElement = document.createElement('label');
        labelElement.htmlFor = `option-${index}`;
        labelElement.textContent = label;
        
        optionDiv.appendChild(radio);
        optionDiv.appendChild(labelElement);
        elements.optionsElement.appendChild(optionDiv);
    });
    
    elements.prevBtn.style.display = currentState.currentQuestion === 0 ? 'none' : 'block';
    elements.nextBtn.textContent = currentState.currentQuestion === assessmentData.questions.length - 1 ? 'Submit' : 'Next';
}

function prevQuestion(assessmentData) {
    if (currentState.currentQuestion > 0) {
        currentState.currentQuestion--;
        showQuestion(assessmentData);
    }
}

function nextQuestion(assessmentData) {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    
    if (!selectedOption && currentState.answers[currentState.currentQuestion] === undefined) {
        alert('Please select an option before continuing');
        return;
    }
    if (selectedOption) {
        currentState.answers[currentState.currentQuestion] = parseInt(selectedOption.value);
    }
    if (currentState.currentQuestion < assessmentData.questions.length - 1) {
        currentState.currentQuestion++;
        showQuestion(assessmentData);
    } else {
        calculateResults(assessmentData);
    }
}

function calculateResults(assessmentData) {
    elements.assessmentContainer.style.display = 'none';
    elements.resultContainer.style.display = 'block';
    
    const rawScore = currentState.answers.reduce((sum, answer) => sum + answer, 0);
    const finalScore = rawScore * 2;
    
    let severity = {};
    for (const level of assessmentData.levels) {
        if (finalScore >= level.range[0] && finalScore <= level.range[1]) {
            severity = level;
            break;
        }
    }
    
    elements.resultContent.innerHTML = `
        <p><strong>Assessment:</strong> ${assessmentData.title}</p>
        <p><strong>Final Score:</strong> ${finalScore}/42</p>
        <div class="severity ${severity.class}">${severity.label}</div>
        <p>${getInterpretation(severity.label)}</p>
        
        <div class="progress-container">
            <div class="progress-bar" style="width: ${Math.min(100, (finalScore / 42) * 100)}%; background-color: ${getSeverityColor(severity.class)}"></div>
        </div>
        
        <h4>What This Means:</h4>
        <p>This suggests you may be experiencing ${severity.label.toLowerCase()} levels of symptoms.</p>
        
        <h4>Next Steps:</h4>
        <p>${getRecommendations(severity.label)}</p>
    `;
}

function showResources(assessmentData) {
    const resourceList = assessmentData.resources.map(resource => `<li>${resource}</li>`).join('');
    
    elements.resultContent.innerHTML += `
        <h4>Helpful Resources:</h4>
        <ul>${resourceList}</ul>
    `;
    
    elements.resourcesBtn.style.display = 'none';
}

function getInterpretation(level) {
    const interpretations = {
        normal: "Your responses suggest you're experiencing typical mood fluctuations.",
        mild: "Your responses suggest mild symptoms.",
        moderate: "Your responses suggest moderate symptoms.",
        severe: "Your responses suggest severe symptoms.",
        extreme: "Your responses suggest extremely severe symptoms."
    };
    return interpretations[level.toLowerCase()] || "";
}

function getRecommendations(level) {
    const base = "Consider discussing these results with a mental health professional.";
    
    if (level === "Normal") {
        return "Your results are in the normal range. Maintain healthy habits and monitor your well-being.";
    } else if (level === "Mild") {
        return base + " You might benefit from self-help strategies or stress management techniques.";
    } else if (level === "Moderate") {
        return base + " Professional support could help you develop coping strategies.";
    } else {
        return base + " Seeking professional help is strongly recommended to address these symptoms.";
    }
}

function getSeverityColor(severityClass) {
    const colors = {
        normal: "#28a745",
        mild: "#ffc107",
        moderate: "#fd7e14",
        severe: "#dc3545",
        extreme: "#b02a37"
    };
    return colors[severityClass] || "#4a6fa5";
}

document.addEventListener('DOMContentLoaded', () => {
    initAssessment(assessment);
});