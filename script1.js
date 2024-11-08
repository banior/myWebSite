let questions = [
    {
        question: "А голос у него был не такой, как у почтальона Печкина, дохленький. У Гаврюши голосище был, как у электрички. Он _____ _____ на ноги поднимал.",
        answers: ["Пол деревни, за раз", "Полдеревни, зараз", "Пол-деревни, за раз"],
        correct: 1, 
        explanation: "Правильно! Раздельно существительное будет писаться в случае наличия дополнительного слова между существительным и частицей. Правильный ответ: полдеревни пишется слитно. Зараз (ударение на второй слог) — это обстоятельственное наречие, пишется слитно. Означает быстро, одним махом."
    },
    {
        question: "А эти слова как пишутся?",
        answers: ["Капуччино и эспрессо", "Каппуччино и экспресо", "Капучино и эспрессо"],
        correct: 2, 
        explanation: "Конечно! По орфографическим нормам русского языка единственно верным написанием будут «капучино» и «эспрессо»."
    },
    {
        question: "Как нужно писать?",
        answers: ["Черезчур", "Черес-чур", "Чересчур"],
        correct: 2, 
        explanation: "Да! Это слово появилось от соединения предлога «через» и древнего слова «чур», которое означает «граница», «край». Но слово претерпело изменения, так что правильное написание учим наизусть — «чересчур»."
    },
    {
        question: "Где допущена ошибка?",
        answers: ["Аккордеон", "Белиберда", "Эпелепсия"],
        correct: 2, 
        explanation: "Верно! Это слово пишется так: «эпИлепсия»."
    },
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
let canclickQuestion = false;
let canclickAnswer = true;
let isFinal = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function loadQuestion() {

    if (currentQuestionIndex >= questions.length) {
        document.querySelector('.question-container').innerHTML = "<p>Вопросы закончились</p>";
        document.querySelector('.answer-container').innerHTML = `<p>Вы правильно ответили на ${correctAnswers} из ${questions.length} вопросов.</p>`;
        isFinal = true;
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const questionElement = document.querySelector('.question');
    const answerContainer = document.querySelector('.answer-container');

    questionElement.textContent = currentQuestion.question;
    answerContainer.innerHTML = ''; 

    const shuffledAnswers = [...currentQuestion.answers];
    shuffle(shuffledAnswers);

    shuffledAnswers.forEach((answer, index) => {
        const li = document.createElement('li');
        li.textContent = answer;
        li.classList.add('answer');
        li.onclick = () => checkAnswer(answer, currentQuestion.correct);
        answerContainer.appendChild(li);
    });
}

function checkAnswer(selectedAnswer, correctAnswerIndex) {
    if (canclickAnswer)
    {
        canclickAnswer = false;
        const currentQuestion = questions[currentQuestionIndex];
        const questionElement = document.querySelector('.question');

        const answerBlocks = document.querySelectorAll('.answer');
        const correctAnswer = currentQuestion.answers[correctAnswerIndex];

        setTimeout(() => {
            for (let i = answerBlocks.length - 1; i >= 0; i--) {
                const block = answerBlocks[i];
                setTimeout(() => {
                    block.classList.add('slide-down');
                }, (answerBlocks.length - 1 - i) * 200); 
            }
        }, 700);

        if (selectedAnswer === correctAnswer) {
            answerBlocks.forEach(block => {
                block.style.backgroundColor = block.textContent === selectedAnswer ? 'green' : '';
            });
        } else {
            answerBlocks.forEach(block => {
                block.style.backgroundColor = block.textContent === selectedAnswer ? 'red' : '';
            });
        }

        setTimeout(() => {
            if (selectedAnswer === correctAnswer) {
                questionElement.textContent = currentQuestion.explanation;
                correctAnswers++;
                answerBlocks.forEach(block => {
                    if (block.textContent === selectedAnswer) block.textContent += " ✔";
                });

                addAnsweredQuestion(currentQuestion.question, true);
            } else {
                questionElement.textContent = "Неправильно! Нажмите на кнопку Вопрос";
                answerBlocks.forEach(block => {
                    if (block.textContent === selectedAnswer) block.textContent += " ✘";
                });

                addAnsweredQuestion(currentQuestion.question, false);
            }
        }, 2000);
        

    

    canclickQuestion = true;
    }
    
}
function showExplanation(selectedLi, questionText) {
    if (isFinal){
        const answeredQuestionsList = document.querySelectorAll('#answered-questions li');

        answeredQuestionsList.forEach(block => {
            const questionObj_ = questions.find(q => q.explanation === block.textContent);
            if (questionObj_) {
                block.classList.remove('chosen');
                block.textContent = `${questionObj_.question} ${block.textContent.slice(-1)}`; 
            }
        });
    
        const liText = selectedLi.textContent.slice(0, -1).trim();
    
        const questionObj = questions.find(q => q.question === liText);
    
        if (questionObj && selectedLi.textContent.startsWith(questionObj.question)) {
            selectedLi.textContent = questionObj.explanation;
            selectedLi.classList.add('chosen');
        } else {
            const questionObj2 = questions.find(q => q.explanation === selectedLi.textContent);
            if (questionObj2) {
                selectedLi.textContent = `${questionObj2.question} ${selectedLi.textContent.slice(-1)}`;
                selectedLi.classList.remove('chosen');
            }
        }
    }
}

document.getElementById("btn").addEventListener("click", setNextQuestion);

function setNextQuestion()
{
    if (canclickQuestion)
    {
        canclickQuestion = false;
        currentQuestionIndex++;
        loadQuestion();
        canclickAnswer = true;
    }
}

function addAnsweredQuestion(question, isCorrect) {
    const answeredQuestionsList = document.getElementById('answered-questions');
    const li = document.createElement('li');
    li.textContent = question;
    li.classList.add('answered-question');
    li.innerHTML += isCorrect ? " ✔" : " ✘";
    answeredQuestionsList.appendChild(li);
    li.addEventListener("click", () => showExplanation(li, question));
}

shuffle(questions);
loadQuestion();