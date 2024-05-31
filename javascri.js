const home = document.getElementById('home');
const clear_data = document.getElementById('clear-data');
const questionPage = document.getElementById('question_pag');
const resultsPage = document.getElementById('results_pag');

const homeNav = document.getElementById('homeNav');
const questionNav = document.getElementById('questionNav');
const resultsNav = document.getElementById('resultsNav');

const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');
const nextButton = document.getElementById('next-btn');
const homeButton = document.getElementById('home-btn');

const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const resultsElement = document.getElementById('results');
const finalResults = document.getElementById('finalResults')
const resultsChartElement = document.getElementById('resultsChart').getContext('2d');

let currentQuestionIndex;
let questionList = [];
let correctAnswersCount = 0;
let arrayTest = JSON.parse(localStorage.getItem('arrayTest')) || [];


let resultsChart = new Chart(resultsChartElement, {
    type: 'line',
    data: {
        labels: arrayTest.map((_, index) => `TEST ${index + 1}`),
        datasets: [{
            data: arrayTest,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                max: 10, 
                ticks: {
                    stepSize: 1 
                }
            },
            x: {
                ticks: {
                    minRotation: 45, 
                    maxRotation: 45,
                    fontSize: 8 
                }
            }
        },
        plugins: {
            legend: {
                display: false // Oculta la leyenda
            }
        },
        maintainAspectRatio: false // Evita que el gráfico se redimensione automáticamente
    }
});

async function getQuestions() {
    const response = await fetch('https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple');
    const data = await response.json();
    return data.results.map(apiQuestion => {
        const allAnswers = [
            { text: apiQuestion.correct_answer, correct: true },
            ...apiQuestion.incorrect_answers.map(answer => ({ text: answer, correct: false }))
        ].sort(() => Math.random() - 0.5);
        return {
            question: apiQuestion.question,
            answers: allAnswers,
        };
    });
}

function startGame() {
    startButton.classList.add('hide');
    restartButton.classList.add('hide');
    home.classList.add('hide');
    questionPage.classList.remove('hide');
    currentQuestionIndex = 0;
    correctAnswersCount = 0;
    resultsElement.innerText = `Respuestas correctas: ${correctAnswersCount}`;
    questionContainerElement.classList.remove('hide');
    setNextQuestion();
}

function showQuestion(item) {
    questionElement.innerText = item.question;
    item.answers.forEach((answer) => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn', 'btn-outline-primary', 'm-2');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function setNextQuestion() {
    resetState();
    showQuestion(questionList[currentQuestionIndex]);
}

function setStatusClass(element, correct) {
    if (correct) {
        element.classList.add('btn-success');
        element.classList.remove('btn-outline-primary');
    } else {
        element.classList.add('btn-danger');
        element.classList.remove('btn-outline-primary');
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";
    Array.from(answerButtonsElement.children).forEach((button) => {
        setStatusClass(button, button.dataset.correct === "true");
        button.disabled = true;
    });
    if (correct) {
        correctAnswersCount++;
        resultsElement.innerText = `Respuestas correctas: ${correctAnswersCount}`;
    }
    if (questionList.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
      setTimeout(function() {
        questionPage.classList.add('hide');
        resultsPage.classList.remove('hide');
      }, 2500);
        arrayTest.push(correctAnswersCount);
        localStorage.setItem('arrayTest', JSON.stringify(arrayTest));
        updateChart();
        resultsElement.innerText = `Respuestas correctas: ${correctAnswersCount}`;
        finalResults.innerHTML = `
        <h2 class="circle">${correctAnswersCount}/10</h2>
        
        `
        restartButton.innerText = 'Restart';
        restartButton.classList.remove('hide');
        homeButton.classList.remove('hide');
    }
}

function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function updateChart() {
    resultsChart.data.labels = arrayTest.map((_, index) => `Quiz ${index + 1}`);
    resultsChart.data.datasets[0].data = arrayTest;
    resultsChart.update();
}

function clearLocalStorage() {
  localStorage.clear();
  alert('Tus resultados han sido eliminados');
}

clear_data.addEventListener('click', async () => {
  clearLocalStorage();
  location.reload();
})

startButton.addEventListener('click', async () => {
    questionList = await getQuestions();
    startGame();
});

restartButton.addEventListener('click', async () => {
  questionList = await getQuestions();
  resultsPage.classList.add('hide');
  startGame();
});

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

homeButton.addEventListener('click', async () => {
  home.classList.remove('hide');
  startButton.classList.remove('hide');
  questionPage.classList.add('hide');
  resultsPage.classList.add('hide');
});

answerButtonsElement.addEventListener('click', (event) => {
    const selectedButton = event.target;
    if (selectedButton.tagName === 'BUTTON') {
        const buttons = Array.from(answerButtonsElement.children);
        buttons.forEach(button => button.classList.remove('selected'));
        selectedButton.classList.add('selected');
    }
});
