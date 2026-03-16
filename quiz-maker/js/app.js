// Quiz Maker Pro - JavaScript

// State Management
let quizData = {
  title: '',
  description: '',
  questions: [],
  enableTimer: false,
  timerDuration: 30
};

let currentQuestionIndex = 0;
let userAnswers = [];
let quizStartTime = null;
let questionTimer = null;
let editingQuestionIndex = -1;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadFromLocalStorage();
  initializeEventListeners();
  updateQuestionsList();
});

// Event Listeners
function initializeEventListeners() {
  // Builder Section
  document.getElementById('addQuestionBtn').addEventListener('click', openQuestionModal);
  document.getElementById('previewQuizBtn').addEventListener('click', previewQuiz);
  document.getElementById('exportQuizBtn').addEventListener('click', exportQuiz);
  document.getElementById('newQuizBtn').addEventListener('click', createNewQuiz);
  
  // Question Modal
  document.getElementById('modalClose').addEventListener('click', closeQuestionModal);
  document.getElementById('cancelBtn').addEventListener('click', closeQuestionModal);
  document.getElementById('saveQuestionBtn').addEventListener('click', saveQuestion);
  document.getElementById('questionType').addEventListener('change', handleQuestionTypeChange);
  document.getElementById('addOptionBtn').addEventListener('click', addOption);
  document.getElementById('previewImage').addEventListener('change', handleImageUpload);
  document.getElementById('removeImageBtn').addEventListener('click', removeImage);
  
  // Preview Section
  document.getElementById('prevQuestionBtn').addEventListener('click', previousQuestion);
  document.getElementById('nextQuestionBtn').addEventListener('click', nextQuestion);
  
  // Results Section
  document.getElementById('retryQuizBtn').addEventListener('click', retryQuiz);
  document.getElementById('backToBuilderBtn').addEventListener('click', backToBuilder);
  document.getElementById('exportResultsBtn').addEventListener('click', exportResults);
  
  // Quiz Info
  document.getElementById('quizTitle').addEventListener('input', saveQuizInfo);
  document.getElementById('quizDescription').addEventListener('input', saveQuizInfo);
  document.getElementById('enableTimer').addEventListener('change', saveQuizInfo);
}

// Local Storage
function saveToLocalStorage() {
  localStorage.setItem('quizMakerData', JSON.stringify(quizData));
}

function loadFromLocalStorage() {
  const saved = localStorage.getItem('quizMakerData');
  if (saved) {
    quizData = JSON.parse(saved);
    document.getElementById('quizTitle').value = quizData.title || '';
    document.getElementById('quizDescription').value = quizData.description || '';
    document.getElementById('enableTimer').checked = quizData.enableTimer || false;
  }
}

// Quiz Info Management
function saveQuizInfo() {
  quizData.title = document.getElementById('quizTitle').value.trim();
  quizData.description = document.getElementById('quizDescription').value.trim();
  quizData.enableTimer = document.getElementById('enableTimer').checked;
  saveToLocalStorage();
}

// Question Modal Management
function openQuestionModal() {
  editingQuestionIndex = -1;
  document.getElementById('questionModal').style.display = 'flex';
  resetQuestionForm();
}

function closeQuestionModal() {
  document.getElementById('questionModal').style.display = 'none';
  resetQuestionForm();
}

function resetQuestionForm() {
  document.getElementById('questionText').value = '';
  document.getElementById('questionType').value = 'multiple-choice';
  document.getElementById('optionsContainer').style.display = 'block';
  document.getElementById('correctAnswer').style.display = 'block';
  document.getElementById('optionsList').innerHTML = '';
  document.getElementById('correctAnswer').innerHTML = '<option value="">Select correct answer</option>';
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('imagePreview').src = '';
  document.getElementById('previewImage').value = '';
  addOption();
  addOption();
}

function handleQuestionTypeChange() {
  const type = document.getElementById('questionType').value;
  const optionsContainer = document.getElementById('optionsContainer');
  const correctAnswer = document.getElementById('correctAnswer');
  
  if (type === 'true-false') {
    optionsContainer.style.display = 'none';
    correctAnswer.style.display = 'block';
    correctAnswer.innerHTML = `
      <option value="">Select correct answer</option>
      <option value="True">True</option>
      <option value="False">False</option>
    `;
  } else if (type === 'short-answer') {
    optionsContainer.style.display = 'none';
    correctAnswer.style.display = 'none';
  } else {
    optionsContainer.style.display = 'block';
    correctAnswer.style.display = 'block';
    updateCorrectAnswerDropdown();
  }
}

function addOption() {
  const optionsList = document.getElementById('optionsList');
  const optionDiv = document.createElement('div');
  optionDiv.className = 'option-item';
  optionDiv.innerHTML = `
    <input type="text" class="option-input" placeholder="Enter option">
    <button type="button" class="remove-option-btn" onclick="removeOption(this)">✕</button>
  `;
  optionsList.appendChild(optionDiv);
  
  optionDiv.querySelector('.option-input').addEventListener('input', updateCorrectAnswerDropdown);
  updateCorrectAnswerDropdown();
}

function removeOption(btn) {
  const optionsList = document.getElementById('optionsList');
  if (optionsList.children.length > 2) {
    btn.parentElement.remove();
    updateCorrectAnswerDropdown();
  } else {
    alert('A question must have at least 2 options.');
  }
}

function updateCorrectAnswerDropdown() {
  const type = document.getElementById('questionType').value;
  if (type !== 'multiple-choice') return;
  
  const correctAnswer = document.getElementById('correctAnswer');
  const currentValue = correctAnswer.value;
  const options = Array.from(document.querySelectorAll('.option-input'))
    .map(input => input.value.trim())
    .filter(val => val !== '');
  
  correctAnswer.innerHTML = '<option value="">Select correct answer</option>';
  options.forEach((option, index) => {
    const opt = document.createElement('option');
    opt.value = option;
    opt.textContent = option;
    if (option === currentValue) opt.selected = true;
    correctAnswer.appendChild(opt);
  });
}

function handleImageUpload(e) {
  const file = e.target.files[0];
  if (file) {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      e.target.value = '';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(event) {
      const preview = document.getElementById('imagePreview');
      preview.src = event.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

function removeImage() {
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('imagePreview').src = '';
  document.getElementById('previewImage').value = '';
}

// Save Question
function saveQuestion() {
  const questionText = document.getElementById('questionText').value.trim();
  const questionType = document.getElementById('questionType').value;
  
  if (!questionText) {
    alert('Please enter a question.');
    return;
  }
  
  const question = {
    text: questionText,
    type: questionType,
    image: document.getElementById('imagePreview').src || null,
    options: [],
    correctAnswer: ''
  };
  
  if (questionType === 'multiple-choice') {
    const options = Array.from(document.querySelectorAll('.option-input'))
      .map(input => input.value.trim())
      .filter(val => val !== '');
    
    if (options.length < 2) {
      alert('Please add at least 2 options.');
      return;
    }
    
    const correctAnswer = document.getElementById('correctAnswer').value;
    if (!correctAnswer) {
      alert('Please select the correct answer.');
      return;
    }
    
    question.options = options;
    question.correctAnswer = correctAnswer;
  } else if (questionType === 'true-false') {
    const correctAnswer = document.getElementById('correctAnswer').value;
    if (!correctAnswer) {
      alert('Please select the correct answer.');
      return;
    }
    question.options = ['True', 'False'];
    question.correctAnswer = correctAnswer;
  }
  
  if (editingQuestionIndex >= 0) {
    quizData.questions[editingQuestionIndex] = question;
  } else {
    quizData.questions.push(question);
  }
  
  saveToLocalStorage();
  updateQuestionsList();
  closeQuestionModal();
}

// Questions List Management
function updateQuestionsList() {
  const questionsList = document.getElementById('questionsList');
  
  if (quizData.questions.length === 0) {
    questionsList.innerHTML = '<p class="no-questions">No questions added yet. Click "Add Question" to get started.</p>';
    return;
  }
  
  questionsList.innerHTML = '';
  quizData.questions.forEach((question, index) => {
    const questionItem = document.createElement('div');
    questionItem.className = 'question-item';
    questionItem.innerHTML = `
      <div class="question-item-content">
        <span class="question-number">Q${index + 1}</span>
        <span class="question-preview">${question.text}</span>
        <span class="question-type-badge">${formatQuestionType(question.type)}</span>
      </div>
      <div class="question-item-actions">
        <button onclick="editQuestion(${index})" class="edit-btn">Edit</button>
        <button onclick="deleteQuestion(${index})" class="delete-btn">Delete</button>
      </div>
    `;
    questionsList.appendChild(questionItem);
  });
}

function formatQuestionType(type) {
  const types = {
    'multiple-choice': 'Multiple Choice',
    'true-false': 'True/False',
    'short-answer': 'Short Answer'
  };
  return types[type] || type;
}

function editQuestion(index) {
  editingQuestionIndex = index;
  const question = quizData.questions[index];
  
  document.getElementById('questionModal').style.display = 'flex';
  document.getElementById('questionText').value = question.text;
  document.getElementById('questionType').value = question.type;
  
  if (question.image) {
    document.getElementById('imagePreview').src = question.image;
    document.getElementById('imagePreview').style.display = 'block';
  }
  
  if (question.type === 'multiple-choice') {
    document.getElementById('optionsList').innerHTML = '';
    question.options.forEach(option => {
      const optionDiv = document.createElement('div');
      optionDiv.className = 'option-item';
      optionDiv.innerHTML = `
        <input type="text" class="option-input" placeholder="Enter option" value="${option}">
        <button type="button" class="remove-option-btn" onclick="removeOption(this)">✕</button>
      `;
      document.getElementById('optionsList').appendChild(optionDiv);
      optionDiv.querySelector('.option-input').addEventListener('input', updateCorrectAnswerDropdown);
    });
    updateCorrectAnswerDropdown();
    document.getElementById('correctAnswer').value = question.correctAnswer;
  } else if (question.type === 'true-false') {
    handleQuestionTypeChange();
    document.getElementById('correctAnswer').value = question.correctAnswer;
  } else {
    handleQuestionTypeChange();
  }
}

function deleteQuestion(index) {
  if (confirm('Are you sure you want to delete this question?')) {
    quizData.questions.splice(index, 1);
    saveToLocalStorage();
    updateQuestionsList();
  }
}

// Preview Quiz
function previewQuiz() {
  if (!quizData.title) {
    alert('Please enter a quiz title.');
    return;
  }
  
  if (quizData.questions.length === 0) {
    alert('Please add at least one question.');
    return;
  }
  
  currentQuestionIndex = 0;
  userAnswers = [];
  quizStartTime = Date.now();
  
  document.getElementById('displayQuizTitle').textContent = quizData.title;
  document.getElementById('displayQuizDescription').textContent = quizData.description;
  
  document.getElementById('builderSection').style.display = 'none';
  document.getElementById('previewSection').style.display = 'block';
  document.getElementById('resultsSection').style.display = 'none';
  
  displayQuestion();
}

function displayQuestion() {
  const question = quizData.questions[currentQuestionIndex];
  const questionDisplay = document.getElementById('questionDisplay');
  
  // Update progress
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
  document.getElementById('progressText').textContent = `Question ${currentQuestionIndex + 1} of ${quizData.questions.length}`;
  
  // Display question
  let html = `<h3>${question.text}</h3>`;
  
  if (question.image) {
    html += `<img src="${question.image}" alt="Question image" id="questionImage">`;
  }
  
  if (question.type === 'multiple-choice' || question.type === 'true-false') {
    html += '<div class="quiz-options">';
    question.options.forEach((option, index) => {
      html += `
        <label class="quiz-option">
          <input type="radio" name="answer" value="${option}">
          <span>${option}</span>
        </label>
      `;
    });
    html += '</div>';
  } else if (question.type === 'short-answer') {
    html += '<textarea class="short-answer-input" placeholder="Type your answer here..."></textarea>';
  }
  
  questionDisplay.innerHTML = html;
  
  // Update navigation buttons
  document.getElementById('prevQuestionBtn').disabled = currentQuestionIndex === 0;
  document.getElementById('nextQuestionBtn').textContent = 
    currentQuestionIndex === quizData.questions.length - 1 ? 'Finish Quiz' : 'Next Question';
  
  // Start timer if enabled
  if (quizData.enableTimer) {
    startQuestionTimer();
  }
}

function startQuestionTimer() {
  clearInterval(questionTimer);
  let timeLeft = quizData.timerDuration || 30;
  
  questionTimer = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(questionTimer);
      nextQuestion();
    }
  }, 1000);
}

function previousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}

function nextQuestion() {
  clearInterval(questionTimer);
  
  const question = quizData.questions[currentQuestionIndex];
  let answer = null;
  
  if (question.type === 'multiple-choice' || question.type === 'true-false') {
    const selected = document.querySelector('input[name="answer"]:checked');
    answer = selected ? selected.value : null;
  } else if (question.type === 'short-answer') {
    answer = document.querySelector('.short-answer-input').value.trim();
  }
  
  userAnswers[currentQuestionIndex] = answer;
  
  if (currentQuestionIndex < quizData.questions.length - 1) {
    currentQuestionIndex++;
    displayQuestion();
  } else {
    showResults();
  }
}

// Results
function showResults() {
  let correctCount = 0;
  let incorrectCount = 0;
  
  const reviewList = document.getElementById('reviewList');
  reviewList.innerHTML = '';
  
  quizData.questions.forEach((question, index) => {
    const userAnswer = userAnswers[index] || 'No answer';
    let isCorrect = false;
    
    if (question.type === 'short-answer') {
      isCorrect = userAnswer.toLowerCase() === (question.correctAnswer || '').toLowerCase();
    } else {
      isCorrect = userAnswer === question.correctAnswer;
    }
    
    if (isCorrect) correctCount++;
    else incorrectCount++;
    
    const reviewItem = document.createElement('div');
    reviewItem.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
    reviewItem.innerHTML = `
      <div class="review-question">
        <strong>Q${index + 1}:</strong> ${question.text}
      </div>
      <div class="review-answer">
        <span class="label">Your answer:</span> ${userAnswer}
      </div>
      ${!isCorrect && question.type !== 'short-answer' ? 
        `<div class="review-correct"><span class="label">Correct answer:</span> ${question.correctAnswer}</div>` : ''}
      <div class="review-status">${isCorrect ? '✓ Correct' : '✗ Incorrect'}</div>
    `;
    reviewList.appendChild(reviewItem);
  });
  
  const scorePercentage = Math.round((correctCount / quizData.questions.length) * 100);
  
  document.getElementById('scorePercentage').textContent = scorePercentage + '%';
  document.getElementById('correctCount').textContent = correctCount;
  document.getElementById('incorrectCount').textContent = incorrectCount;
  
  document.getElementById('previewSection').style.display = 'none';
  document.getElementById('resultsSection').style.display = 'block';
}

function retryQuiz() {
  previewQuiz();
}

function backToBuilder() {
  document.getElementById('resultsSection').style.display = 'none';
  document.getElementById('builderSection').style.display = 'block';
}

// Export Functions
function exportQuiz() {
  if (!quizData.title) {
    alert('Please enter a quiz title before exporting.');
    return;
  }
  
  if (quizData.questions.length === 0) {
    alert('Please add at least one question before exporting.');
    return;
  }
  
  const exportData = JSON.stringify(quizData, null, 2);
  const blob = new Blob([exportData], { type: 'application/json' });
  const fileName = `${quizData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_quiz.json`;
  
  saveAs(blob, fileName);
}

function exportResults() {
  const correctCount = parseInt(document.getElementById('correctCount').textContent);
  const incorrectCount = parseInt(document.getElementById('incorrectCount').textContent);
  const scorePercentage = document.getElementById('scorePercentage').textContent;
  
  let resultText = `Quiz Results - ${quizData.title}\n`;
  resultText += `Date: ${new Date().toLocaleString()}\n`;
  resultText += `Score: ${scorePercentage} (${correctCount} correct, ${incorrectCount} incorrect)\n\n`;
  resultText += `Detailed Review:\n`;
  resultText += `${'='.repeat(50)}\n\n`;
  
  quizData.questions.forEach((question, index) => {
    const userAnswer = userAnswers[index] || 'No answer';
    let isCorrect = false;
    
    if (question.type === 'short-answer') {
      isCorrect = userAnswer.toLowerCase() === (question.correctAnswer || '').toLowerCase();
    } else {
      isCorrect = userAnswer === question.correctAnswer;
    }
    
    resultText += `Q${index + 1}: ${question.text}\n`;
    resultText += `Your Answer: ${userAnswer}\n`;
    if (!isCorrect && question.type !== 'short-answer') {
      resultText += `Correct Answer: ${question.correctAnswer}\n`;
    }
    resultText += `Status: ${isCorrect ? 'Correct ✓' : 'Incorrect ✗'}\n\n`;
  });
  
  const blob = new Blob([resultText], { type: 'text/plain' });
  const fileName = `${quizData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_results.txt`;
  
  saveAs(blob, fileName);
}

function createNewQuiz() {
  if (quizData.questions.length > 0) {
    if (!confirm('Are you sure? This will clear all current questions.')) {
      return;
    }
  }
  
  quizData = {
    title: '',
    description: '',
    questions: [],
    enableTimer: false,
    timerDuration: 30
  };
  
  document.getElementById('quizTitle').value = '';
  document.getElementById('quizDescription').value = '';
  document.getElementById('enableTimer').checked = false;
  
  saveToLocalStorage();
  updateQuestionsList();
}