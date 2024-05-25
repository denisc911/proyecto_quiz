const home = document.getElementById('home')
const question = document.getElementById('question')
const results = document.getElementById('results')

const homeNav = document.getElementById('homeNav')
const questionNav = document.getElementById('questionNav')
const resultsNav = document.getElementById('resultsNav')


const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = 
document.getElementById('question-container')
 const questionElement = document.getElementById('question')
 const answerButtonsElement = 
document.getElementById('answer-buttons')


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


let currentQuestionIndex //No se inicializa a 0 para que no enseñe la primera pregunta todavía

function startGame() {
 startButton.classList.add('hide')
 currentQuestionIndex = 0
 questionContainerElement.classList
 .remove('hide')
 setNextQuestion()
}

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


function setNextQuestion() {
    resetState()
    showQuestion(questionList[currentQuestionIndex])
}

/* function startGame() {
    startButton.classList.add('hide')
    currentQuestionIndex = 0
    questionContainerElement
    .classList
    .remove('hide')
    setNextQuestion()
} */

function setStatusClass(element) {
    if (element.dataset.correct) {
      element.classList.add('color-correct')
    } else {
      element.classList.add('color-wrong')
    }
}

function selectAnswer() {
    Array.from(answerButtonsElement.children)
    .forEach((button) => { setStatusClass(button) })
    
    if (questionList.length > currentQuestionIndex + 1) {
//Si el contador de questionList es mayor que la pregunta actual 
//(que empieza en 0) se elimina hide para que se muestre el boton siguiente.
        nextButton.classList.remove('hide') 
      
    } else {
      startButton.innerText = 'Restart'
      startButton.classList.remove('hide')
    }
}

function showQuestion(question) {
    questionElement.innerText = question.question
    question.answers.forEach((answer) => {
      const button = document.createElement('button')
      button.innerText = answer.text
      if (answer.correct) {
        button.dataset.correct = true
      }
      button.addEventListener('click', selectAnswer)
      answerButtonsElement.appendChild(button)
    })
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})

function resetState() {
    nextButton.classList.add('hide')
    while (answerButtonsElement.firstChild) {
      answerButtonsElement.removeChild(answerButtonsElement.firstChild)
    }
}

function setNextQuestion() {
    resetState()
    showQuestion(questionList[currentQuestionIndex])
}

startButton.addEventListener('click', startGame)