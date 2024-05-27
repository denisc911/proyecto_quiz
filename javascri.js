const home = document.getElementById('home')
const questionPage = document.getElementById('question_pag')
const results = document.getElementById('results')

const homeNav = document.getElementById('homeNav')
const questionNav = document.getElementById('questionNav')
const resultsNav = document.getElementById('resultsNav')


const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')


//Preguntas y sus respuestas
const questionList = [
    {
      question: 'What is 2 + 2?',
      answers: [
        { text: '4', correct: true },
        { text: '22', correct: false },
      ],
    },
    {
      question: 'Is web development fun?',
      answers: [
        { text: 'Kinda', correct: false },
        { text: 'YES!!!', correct: true },
        { text: 'Um no', correct: false },
        { text: 'IDK', correct: false },
      ],
    },
    {
      question: 'What is 4 * 2?',
      answers: [
        { text: '6', correct: false },
        { text: '8', correct: true },
        { text: 'Yes', correct: false },
      ],
    },
]


//STAR GAME
let currentQuestionIndex //No se inicializa a 0 para que no enseñe la primera pregunta todavía

function startGame() {
 startButton.classList.add('hide')
 currentQuestionIndex = 0
 questionContainerElement.classList.remove('hide')
 setNextQuestion()
}

//SHOW QUESTION
function showQuestion(item) {
questionElement.innerText = item.question  //Con esto relleno la pregunta

item.answers.forEach((answer) => {
    const button = document.createElement('button')
    button.innerText = answer.text

    if (answer.correct === true) {
    button.dataset.correct = true
    }
    button.addEventListener('click', selectAnswer)
    answerButtonsElement.appendChild(button)
})
}

//NEXT QUESTION

function setNextQuestion() {
    resetState()
    showQuestion(questionList[currentQuestionIndex])
}


//STATUS CLASS

function setStatusClass(element) {
    if (element.dataset.correct) {
      element.classList.add('color-correct')
    } else {
      element.classList.add('color-wrong')
    }
}

//SELECT ANSWER
function selectAnswer() {
    Array.from(answerButtonsElement.children).forEach((button) => { 
        setStatusClass(button) })
    
    if (questionList.length > currentQuestionIndex + 1) {
//Si el contador de questionList es mayor que la pregunta actual 
//(que empieza en 0) se elimina hide para que se muestre el boton siguiente.
        nextButton.classList.remove('hide') 
      
    } else {
      startButton.innerText = 'Restart'
      startButton.classList.remove('hide')
    }
}

//RESET STATE
function resetState() {
    nextButton.classList.add('hide')
    while (answerButtonsElement.firstChild) {
      answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

startButton.addEventListener('click', startGame)

nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})


//grafica
const ctx = document.getElementById('myChart')
//menu eje x (indicados por un array habrá que iterar 
//para construirlo, ya que la cantidad de datos dependera de el numero de veces que se hace quiz )
const labels = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio']
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
}

