// Survey Configuration and State
let surveyConfig = {
  title: "Customer Satisfaction Survey",
  steps: [
    {
      id: 1,
      title: "Basic Information",
      questions: [
        {
          id: "q1",
          type: "text",
          label: "What is your name?",
          required: true,
          validation: "text"
        },
        {
          id: "q2",
          type: "email",
          label: "What is your email address?",
          required: true,
          validation: "email"
        }
      ]
    },
    {
      id: 2,
      title: "Experience Rating",
      questions: [
        {
          id: "q3",
          type: "radio",
          label: "How satisfied are you with our service?",
          required: true,
          options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
          conditional: {
            showNextIf: ["Dissatisfied", "Very Dissatisfied"]
          }
        },
        {
          id: "q4",
          type: "textarea",
          label: "What could we improve?",
          required: false,
          condition: { questionId: "q3", values: ["Dissatisfied", "Very Dissatisfied"] }
        }
      ]
    },
    {
      id: 3,
      title: "Product Feedback",
      questions: [
        {
          id: "q5",
          type: "checkbox",
          label: "Which features do you use most?",
          required: true,
          options: ["Dashboard", "Reports", "Analytics", "Integrations", "Mobile App"]
        },
        {
          id: "q6",
          type: "range",
          label: "How likely are you to recommend us? (0-10)",
          required: true,
          min: 0,
          max: 10,
          value: 5
        }
      ]
    },
    {
      id: 4,
      title: "Additional Comments",
      questions: [
        {
          id: "q7",
          type: "select",
          label: "How did you hear about us?",
          required: true,
          options: ["Search Engine", "Social Media", "Friend/Colleague", "Advertisement", "Other"]
        },
        {
          id: "q8",
          type: "textarea",
          label: "Any additional comments?",
          required: false
        }
      ]
    }
  ]
};

let currentStep = 0;
let surveyResponses = [];
let currentResponse = {};
let responseStartTime = null;
let chart = null;

// Initialize Survey
function initSurvey() {
  loadResponses();
  renderSurveyBuilder();
  renderStep();
  setupEventListeners();
  updateResultsDisplay();
}

// Render Survey Builder
function renderSurveyBuilder() {
  const container = document.querySelector('.survey-container');
  if (!container) return;

  container.innerHTML = `
    <div class="survey-header">
      <h2>${surveyConfig.title}</h2>
      <div class="progress-bar">
        <div class="progress-fill" id="progressFill"></div>
      </div>
      <div class="progress-text" id="progressText">Step 1 of ${surveyConfig.steps.length}</div>
    </div>
    <form id="surveyForm" class="survey-form">
      <div id="stepContainer"></div>
      <div class="survey-navigation">
        <button type="button" id="prevBtn" class="btn btn-secondary" style="display: none;">Previous</button>
        <button type="button" id="nextBtn" class="btn btn-primary">Next</button>
        <button type="submit" id="submitBtn" class="btn btn-success" style="display: none;">Submit Survey</button>
      </div>
    </form>
  `;
}

// Render Current Step
function renderStep() {
  const stepContainer = document.getElementById('stepContainer');
  const step = surveyConfig.steps[currentStep];
  
  if (!stepContainer || !step) return;

  stepContainer.innerHTML = `
    <div class="step-content fade-in">
      <h3>${step.title}</h3>
      ${step.questions.map(q => renderQuestion(q)).join('')}
    </div>
  `;

  updateProgress();
  updateNavigationButtons();
  restoreAnswers();
}

// Render Question
function renderQuestion(question) {
  if (question.condition && !checkCondition(question.condition)) {
    return '';
  }

  const requiredMark = question.required ? '<span class="required">*</span>' : '';
  
  switch (question.type) {
    case 'text':
    case 'email':
      return `
        <div class="question-group" data-question-id="${question.id}">
          <label for="${question.id}">${question.label} ${requiredMark}</label>
          <input type="${question.type}" id="${question.id}" name="${question.id}" 
                 ${question.required ? 'required' : ''} 
                 class="form-control">
          <div class="error-message" id="${question.id}-error"></div>
        </div>
      `;
    
    case 'textarea':
      return `
        <div class="question-group" data-question-id="${question.id}">
          <label for="${question.id}">${question.label} ${requiredMark}</label>
          <textarea id="${question.id}" name="${question.id}" 
                    ${question.required ? 'required' : ''} 
                    class="form-control" rows="4"></textarea>
          <div class="error-message" id="${question.id}-error"></div>
        </div>
      `;
    
    case 'radio':
      return `
        <div class="question-group" data-question-id="${question.id}">
          <label>${question.label} ${requiredMark}</label>
          <div class="radio-group">
            ${question.options.map((opt, idx) => `
              <label class="radio-label">
                <input type="radio" name="${question.id}" value="${opt}" 
                       ${question.required ? 'required' : ''}>
                <span>${opt}</span>
              </label>
            `).join('')}
          </div>
          <div class="error-message" id="${question.id}-error"></div>
        </div>
      `;
    
    case 'checkbox':
      return `
        <div class="question-group" data-question-id="${question.id}">
          <label>${question.label} ${requiredMark}</label>
          <div class="checkbox-group">
            ${question.options.map((opt, idx) => `
              <label class="checkbox-label">
                <input type="checkbox" name="${question.id}" value="${opt}" 
                       data-question-id="${question.id}">
                <span>${opt}</span>
              </label>
            `).join('')}
          </div>
          <div class="error-message" id="${question.id}-error"></div>
        </div>
      `;
    
    case 'select':
      return `
        <div class="question-group" data-question-id="${question.id}">
          <label for="${question.id}">${question.label} ${requiredMark}</label>
          <select id="${question.id}" name="${question.id}" 
                  ${question.required ? 'required' : ''} 
                  class="form-control">
            <option value="">Select an option...</option>
            ${question.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
          </select>
          <div class="error-message" id="${question.id}-error"></div>
        </div>
      `;
    
    case 'range':
      return `
        <div class="question-group" data-question-id="${question.id}">
          <label for="${question.id}">${question.label} ${requiredMark}</label>
          <div class="range-container">
            <input type="range" id="${question.id}" name="${question.id}" 
                   min="${question.min}" max="${question.max}" value="${question.value}"
                   ${question.required ? 'required' : ''} 
                   class="form-range">
            <span class="range-value" id="${question.id}-value">${question.value}</span>
          </div>
          <div class="range-labels">
            <span>${question.min}</span>
            <span>${question.max}</span>
          </div>
          <div class="error-message" id="${question.id}-error"></div>
        </div>
      `;
    
    default:
      return '';
  }
}

// Check Conditional Logic
function checkCondition(condition) {
  const { questionId, values } = condition;
  const answer = currentResponse[questionId];
  
  if (!answer) return false;
  
  if (Array.isArray(answer)) {
    return values.some(v => answer.includes(v));
  }
  
  return values.includes(answer);
}

// Save Current Step Answers
function saveCurrentStepAnswers() {
  const step = surveyConfig.steps[currentStep];
  
  step.questions.forEach(question => {
    if (question.condition && !checkCondition(question.condition)) {
      return;
    }

    const element = document.getElementById(question.id);
    
    if (question.type === 'checkbox') {
      const checkboxes = document.querySelectorAll(`input[name="${question.id}"]:checked`);
      currentResponse[question.id] = Array.from(checkboxes).map(cb => cb.value);
    } else if (question.type === 'radio') {
      const radio = document.querySelector(`input[name="${question.id}"]:checked`);
      currentResponse[question.id] = radio ? radio.value : '';
    } else if (element) {
      currentResponse[question.id] = element.value;
    }
  });
}

// Restore Answers
function restoreAnswers() {
  const step = surveyConfig.steps[currentStep];
  
  step.questions.forEach(question => {
    if (question.condition && !checkCondition(question.condition)) {
      return;
    }

    const answer = currentResponse[question.id];
    if (!answer) return;

    if (question.type === 'checkbox') {
      const checkboxes = document.querySelectorAll(`input[name="${question.id}"]`);
      checkboxes.forEach(cb => {
        cb.checked = answer.includes(cb.value);
      });
    } else if (question.type === 'radio') {
      const radio = document.querySelector(`input[name="${question.id}"][value="${answer}"]`);
      if (radio) radio.checked = true;
    } else if (question.type === 'range') {
      const element = document.getElementById(question.id);
      if (element) {
        element.value = answer;
        const valueDisplay = document.getElementById(`${question.id}-value`);
        if (valueDisplay) valueDisplay.textContent = answer;
      }
    } else {
      const element = document.getElementById(question.id);
      if (element) element.value = answer;
    }
  });
}

// Validate Current Step
function validateCurrentStep() {
  const step = surveyConfig.steps[currentStep];
  let isValid = true;
  
  step.questions.forEach(question => {
    if (question.condition && !checkCondition(question.condition)) {
      return;
    }

    const errorElement = document.getElementById(`${question.id}-error`);
    if (errorElement) errorElement.textContent = '';

    if (!question.required) return;

    let value = '';
    
    if (question.type === 'checkbox') {
      const checkboxes = document.querySelectorAll(`input[name="${question.id}"]:checked`);
      value = checkboxes.length > 0;
      
      if (!value) {
        if (errorElement) errorElement.textContent = 'Please select at least one option';
        isValid = false;
      }
    } else if (question.type === 'radio') {
      const radio = document.querySelector(`input[name="${question.id}"]:checked`);
      value = radio ? radio.value : '';
      
      if (!value) {
        if (errorElement) errorElement.textContent = 'Please select an option';
        isValid = false;
      }
    } else {
      const element = document.getElementById(question.id);
      value = element ? element.value.trim() : '';
      
      if (!value) {
        if (errorElement) errorElement.textContent = 'This field is required';
        isValid = false;
      } else if (question.type === 'email' && !isValidEmail(value)) {
        if (errorElement) errorElement.textContent = 'Please enter a valid email address';
        isValid = false;
      }
    }
  });
  
  return isValid;
}

// Email Validation
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Update Progress
function updateProgress() {
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  
  const progress = ((currentStep + 1) / surveyConfig.steps.length) * 100;
  
  if (progressFill) {
    progressFill.style.width = `${progress}%`;
  }
  
  if (progressText) {
    progressText.textContent = `Step ${currentStep + 1} of ${surveyConfig.steps.length}`;
  }
}

// Update Navigation Buttons
function updateNavigationButtons() {
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  
  if (prevBtn) {
    prevBtn.style.display = currentStep > 0 ? 'inline-block' : 'none';
  }
  
  const isLastStep = currentStep === surveyConfig.steps.length - 1;
  
  if (nextBtn) {
    nextBtn.style.display = !isLastStep ? 'inline-block' : 'none';
  }
  
  if (submitBtn) {
    submitBtn.style.display = isLastStep ? 'inline-block' : 'none';
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Survey Navigation
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const surveyForm = document.getElementById('surveyForm');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', handlePrevious);
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', handleNext);
  }
  
  if (surveyForm) {
    surveyForm.addEventListener('submit', handleSubmit);
  }
  
  // Range Input Updates
  document.addEventListener('input', (e) => {
    if (e.target.type === 'range') {
      const valueDisplay = document.getElementById(`${e.target.id}-value`);
      if (valueDisplay) {
        valueDisplay.textContent = e.target.value;
      }
    }
  });
  
  // Conditional Logic Updates
  document.addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
      const question = surveyConfig.steps[currentStep].questions.find(q => q.id === e.target.name);
      if (question && question.conditional) {
        saveCurrentStepAnswers();
        renderStep();
      }
    }
  });
  
  // Results Export
  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', exportToCSV);
  }
  
  // Clear Results
  const clearResultsBtn = document.getElementById('clearResultsBtn');
  if (clearResultsBtn) {
    clearResultsBtn.addEventListener('click', clearResults);
  }
}

// Handle Previous
function handlePrevious() {
  saveCurrentStepAnswers();
  currentStep--;
  renderStep();
}

// Handle Next
function handleNext() {
  if (!validateCurrentStep()) {
    return;
  }
  
  saveCurrentStepAnswers();
  currentStep++;
  renderStep();
}

// Handle Submit
function handleSubmit(e) {
  e.preventDefault();
  
  if (!validateCurrentStep()) {
    return;
  }
  
  saveCurrentStepAnswers();
  
  const completionTime = responseStartTime ? Date.now() - responseStartTime : 0;
  
  const response = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    completionTime: Math.round(completionTime / 1000),
    answers: { ...currentResponse }
  };
  
  surveyResponses.push(response);
  saveResponses();
  updateResultsDisplay();
  
  // Show success message
  const container = document.querySelector('.survey-container');
  if (container) {
    container.innerHTML = `
      <div class="success-message fade-in">
        <div class="success-icon">✓</div>
        <h2>Thank You!</h2>
        <p>Your survey response has been submitted successfully.</p>
        <button type="button" class="btn btn-primary" onclick="resetSurvey()">Take Another Survey</button>
      </div>
    `;
  }
}

// Reset Survey
function resetSurvey() {
  currentStep = 0;
  currentResponse = {};
  responseStartTime = Date.now();
  renderSurveyBuilder();
  renderStep();
  setupEventListeners();
}

// Load Responses from localStorage
function loadResponses() {
  const saved = localStorage.getItem('surveyResponses');
  if (saved) {
    try {
      surveyResponses = JSON.parse(saved);
    } catch (e) {
      surveyResponses = [];
    }
  }
}

// Save Responses to localStorage
function saveResponses() {
  localStorage.setItem('surveyResponses', JSON.stringify(surveyResponses));
}

// Update Results Display
function updateResultsDisplay() {
  updateStatistics();
  updateResponsesTable();
  updateChart();
}

// Update Statistics
function updateStatistics() {
  const totalResponses = document.getElementById('totalResponses');
  const completionRate = document.getElementById('completionRate');
  const avgTime = document.getElementById('avgTime');
  
  if (totalResponses) {
    totalResponses.textContent = surveyResponses.length;
  }
  
  if (completionRate) {
    completionRate.textContent = '100%';
  }
  
  if (avgTime) {
    if (surveyResponses.length > 0) {
      const totalTime = surveyResponses.reduce((sum, r) => sum + (r.completionTime || 0), 0);
      const avg = Math.round(totalTime / surveyResponses.length);
      avgTime.textContent = formatTime(avg);
    } else {
      avgTime.textContent = '0s';
    }
  }
}

// Format Time
function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}m ${secs}s`;
}

// Update Responses Table
function updateResponsesTable() {
  const tableBody = document.getElementById('responsesTableBody');
  if (!tableBody) return;
  
  if (surveyResponses.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No responses yet</td></tr>';
    return;
  }
  
  tableBody.innerHTML = surveyResponses.slice(-10).reverse().map(response => {
    const date = new Date(response.timestamp);
    const name = response.answers.q1 || 'Anonymous';
    const email = response.answers.q2 || 'N/A';
    const satisfaction = response.answers.q3 || 'N/A';
    
    return `
      <tr>
        <td>${date.toLocaleString()}</td>
        <td>${escapeHtml(name)}</td>
        <td>${escapeHtml(email)}</td>
        <td>${escapeHtml(satisfaction)}</td>
      </tr>
    `;
  }).join('');
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Update Chart
function updateChart() {
  const canvas = document.getElementById('responsesChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  // Count satisfaction responses
  const satisfactionCounts = {
    'Very Satisfied': 0,
    'Satisfied': 0,
    'Neutral': 0,
    'Dissatisfied': 0,
    'Very Dissatisfied': 0
  };
  
  surveyResponses.forEach(response => {
    const satisfaction = response.answers.q3;
    if (satisfaction && satisfactionCounts.hasOwnProperty(satisfaction)) {
      satisfactionCounts[satisfaction]++;
    }
  });
  
  if (chart) {
    chart.destroy();
  }
  
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(satisfactionCounts),
      datasets: [{
        label: 'Number of Responses',
        data: Object.values(satisfactionCounts),
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 99, 132, 0.8)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Customer Satisfaction Distribution'
        }
      }
    }
  });
}

// Export to CSV
function exportToCSV() {
  if (surveyResponses.length === 0) {
    alert('No responses to export');
    return;
  }
  
  // Collect all unique question IDs
  const questionIds = new Set();
  surveyResponses.forEach(response => {
    Object.keys(response.answers).forEach(key => questionIds.add(key));
  });
  
  // Get question labels
  const questionLabels = {};
  surveyConfig.steps.forEach(step => {
    step.questions.forEach(q => {
      questionLabels[q.id] = q.label;
    });
  });
  
  // Prepare CSV data
  const headers = ['Timestamp', 'Completion Time (s)', ...Array.from(questionIds).map(id => questionLabels[id] || id)];
  
  const rows = surveyResponses.map(response => {
    const row = [
      response.timestamp,
      response.completionTime || 0
    ];
    
    questionIds.forEach(qId => {
      const answer = response.answers[qId];
      if (Array.isArray(answer)) {
        row.push(answer.join('; '));
      } else {
        row.push(answer || '');
      }
    });
    
    return row;
  });
  
  const csvData = [headers, ...rows];
  
  // Use PapaParse to generate CSV
  const csv = Papa.unparse(csvData);
  
  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const fileName = `survey_responses_${new Date().toISOString().split('T')[0]}.csv`;
  
  saveAs(blob, fileName);
}

// Clear Results
function clearResults() {
  if (confirm('Are you sure you want to clear all survey responses? This action cannot be undone.')) {
    surveyResponses = [];
    saveResponses();
    updateResultsDisplay();
  }
}

// Initialize on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    responseStartTime = Date.now();
    initSurvey();
  });
} else {
  responseStartTime = Date.now();
  initSurvey();
}