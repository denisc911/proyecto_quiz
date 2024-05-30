const home = document.getElementById('home');
const questionPage = document.getElementById('question_pag');
const results = document.getElementById('results');

const homeNav = document.getElementById('homeNav');
const questionNav = document.getElementById('questionNav');
const resultsNav = document.getElementById('resultsNav');

const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const resultsElement = document.getElementById('results');

// Función para obtener y transformar las preguntas desde la API
async function getQuestions() {
  const response = await fetch('https://opentdb.com/api.php?amount=2&category=18&difficulty=easy&type=multiple');
  const data = await response.json();
  
  return data.results.map(apiQuestion => {
    const allAnswers = [
      { text: apiQuestion.correct_answer, correct: true },
      ...apiQuestion.incorrect_answers.map(answer => ({ text: answer, correct: false }))
    ].sort(() => Math.random() - 0.5); // Mezcla las respuestas

    return {
      question: apiQuestion.question,
      answers: allAnswers,
    };
  });
}

let currentQuestionIndex;
let questionList = [];
let correctAnswersCount = 0;
let arrayTest = JSON.parse(localStorage.getItem('arrayTest')) || [];

// INICIAR JUEGO
function startGame() {
  startButton.classList.add('hide');
  currentQuestionIndex = 0;
  correctAnswersCount = 0; // Reinicia el contador de respuestas correctas al iniciar un nuevo juego
  resultsElement.innerText = `Respuestas correctas: ${correctAnswersCount}`; // Asegura que el contador se muestra en 0 al iniciar un nuevo test
  questionContainerElement.classList.remove('hide');
  setNextQuestion();
}

// MOSTRAR PREGUNTA
function showQuestion(item) {
  questionElement.innerText = item.question; // Con esto relleno la pregunta

  item.answers.forEach((answer) => {
    const button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn', 'btn-outline-primary', 'm-2'); // Agrega clases de Bootstrap para estilizar botones

    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtonsElement.appendChild(button);
  });
}

// SIGUIENTE PREGUNTA
function setNextQuestion() {
  resetState();
  showQuestion(questionList[currentQuestionIndex]);
}

// ESTADO DE CLASE
function setStatusClass(element, correct) {
  if (correct) {
    element.classList.add('btn-success');
    element.classList.remove('btn-outline-primary');
  } else {
    element.classList.add('btn-danger');
    element.classList.remove('btn-outline-primary');
  }
}

// SELECCIONAR RESPUESTA
function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === "true";

  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct === "true");
    button.disabled = true; // Deshabilita todos los botones después de seleccionar una respuesta
  });

  if (correct) {
    correctAnswersCount++;
    resultsElement.innerText = `Respuestas correctas: ${correctAnswersCount}`; // Actualiza el contador en la interfaz
  }

  if (questionList.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {
    arrayTest.push(correctAnswersCount);
    localStorage.setItem('arrayTest', JSON.stringify(arrayTest));

    resultsElement.innerText = `Respuestas correctas: ${correctAnswersCount}`;
    startButton.innerText = 'Restart';
    startButton.classList.remove('hide');
  }
}

// RESET STATE
function resetState() {
  nextButton.classList.add('hide');
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

// Configura el botón de inicio para obtener preguntas y comenzar el juego
startButton.addEventListener('click', async () => {
  questionList = await getQuestions(); // Obtiene las preguntas desde la API
  startGame(); // Inicia el juego
});

nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  setNextQuestion();
});

// Evento para marcar la respuesta seleccionada
answerButtonsElement.addEventListener('click', (event) => {
  const selectedButton = event.target;
  if (selectedButton.tagName === 'BUTTON') {
    const buttons = Array.from(answerButtonsElement.children);
    buttons.forEach(button => button.classList.remove('selected'));
    selectedButton.classList.add('selected');
  }
});
