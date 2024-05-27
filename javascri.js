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

// Función para obtener y transformar las preguntas desde la API
async function getQuestions() {
  const response = await fetch('https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple');
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

let currentQuestionIndex; // No se inicializa a 0 para que no enseñe la primera pregunta todavía
let questionList = []; // Lista de preguntas vacía inicialmente


//CONFIGURAMOS EL LOCAL STORAGE
let arrayTest = [] //vendrán las respuestas correctas
let arrayTestJson = JSON.stringify(arrayTest)
//compruebo que existe el test
if (!localStorage.testNumber){
    localStorage.setItem('testNumber', arrayTestJson)
}



// INICIAR JUEGO
function startGame() {
  startButton.classList.add('hide');
  currentQuestionIndex = 0;
  questionContainerElement.classList.remove('hide');
  setNextQuestion();
}

// MOSTRAR PREGUNTA
function showQuestion(item) {
  questionElement.innerText = item.question; // Con esto relleno la pregunta

  item.answers.forEach((answer) => {
    const button = document.createElement('button');
    button.innerText = answer.text;

    if (answer.correct === true) {
      button.dataset.correct = true;
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
let resp_correcta
function setStatusClass(element) {
  if (element.dataset.correct) {
    element.classList.add('color-correct');
    resp_correcta++ //
  } else {
    element.classList.add('color-wrong');
  }
}

// SELECCIONAR RESPUESTA
function selectAnswer() {
  Array.from(answerButtonsElement.children).forEach((button) => {
    setStatusClass(button);
  });

  if (questionList.length > currentQuestionIndex + 1) {
    nextButton.classList.remove('hide');
  } else {
    // Reiniciar y dar start en la practica es lo mismo(deben de iniciar un nuevo array de preguntas)
    //PASAR A ARRAY Nº DE RESPUESTAS CORRECTAS
    arrayTest[i] === resp_correcta // array
    localStorage.setItem('arrayTest', arrayAsString);
    i++
    startButton.innerText = 'Restart';
    resp_correcta = 0
    startButton.classList.remove('hide');
    
    //Aquí tiene que sumar +1 al nª asignación de Test
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

// Gráfica
const ctx = document.getElementById('myChart');
const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio'];
const data = {
  type: 'line',
  data: {
    labels: labels,
    datasets: [
      {
        label: 'Mi primera gráfica',
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgb(255, 99, 132)',
        data: [0, 10, 5, 2, 20, 30, 45],
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
};
