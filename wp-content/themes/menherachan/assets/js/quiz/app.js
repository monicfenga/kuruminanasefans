class TypeWriter {
    constructor(element, text, time = 25) {
        // Initiate the variables
        this.element = element;
        this.text = text;
        this.txt = '';
        this.time = time;
        this.done = false;
        // Call the function to start typing
        this.type();
    }

    type() {
        this.txt = this.text.substring(0, this.txt.length + 1);

        // Define the speed of the writer
        let typeSpeed = this.time;

        // Verify if the word is full typed
        // if is he will wait a more long time
        if (this.text === this.txt) {
            this.done = true;
        }

        this.element.innerHTML = this.txt;
        if (!this.done) {
            setTimeout(() => this.type(), typeSpeed);
        } else {
            finishedTyping();
        }
    }
}

let findNumber = false;
let initialNumber = 0;
let lastNumber = 1000;
let totalGuess = 0;
let quiz, guesser;
let UItext, menheraImg, menheraVoice;
let currentQuestion, currentImage, currentVoice;
let askOuput_aux = [ " ", "嗯，", "那么，", "那，", " " ]

document.addEventListener('DOMContentLoaded', init);

// Set the 'hello' text
async function init() {
    // Initialize the variables
    quiz = new Quiz();
    guesser = new Guesser();
    const questions = quiz.getQuestions();



    // Get a random question
    let questionIndex = Math.floor(Math.random() * questions.length);
    currentQuestion = questions[questionIndex]['text'];
    currentImage = questions[questionIndex]["img"];
    currentVoice = questions[questionIndex]["voice"];

    // Get the elements of the text and of the image
    UItext = document.querySelector('#menhera .cursor');
    menheraImg = document.querySelector('#image-menhera');
    menheraVoice = document.querySelector('#voice-menhera');

    changeImage(currentImage);
    changeVoice(currentVoice);
    new TypeWriter(UItext, currentQuestion);
}

// Finished typing controller
function finishedTyping() {
    if (UItext.innerHTML === currentQuestion) {
        document.querySelector('#btn-start').classList.toggle('no-display');
    }
}

// Event to start the game
document.querySelector('#btn-start').addEventListener('click', el => {
    el.preventDefault();
    changeImage(quiz.getAsking());
    document.querySelector('#btn-start').classList.toggle('no-display');
    document.querySelector('#totalGuesses').classList.toggle('no-display');
    document.querySelector('#btn-choices').classList.toggle('no-display');
    ask();
})

// Ask if number is bigger than the average
function ask() {
    if (guesser.totalGuess % 3 === 0) {
        changeImage(quiz.getAsking());
    }
    // 获取辅助词
    let askOuput_auxIndex = Math.floor(Math.random() * askOuput_aux.length);

    document.querySelector('#totalGuesses p').innerHTML = `第 ${guesser.totalGuess} 题`;
    const askOuput = askOuput_aux[askOuput_auxIndex]+`这个数字比 ${guesser.getAverage()} 大吗？`;
    new TypeWriter(UItext, askOuput, 15)
}

// Function to change menhera Image
function changeImage(imgPath) {
    menheraImg.style.backgroundImage = 'url("' + imgPath + '")';
}

// Function to change menhera Voice
function changeVoice(voicePath) {
    menheraVoice.setAttribute('src', `voices/${voicePath}`);
}
function playVoice() {
    menheraVoice.play();
}

// Events for buttons Yes and No
document.querySelector('#btn-choices').addEventListener('click', el => {
    el.preventDefault();

    if (el.target.id === 'btn-yes') {
        guesser.answer('y');
        verify();
    } else if (el.target.id === 'btn-no') {
        guesser.answer('n');
        verify();
    }
});

// Verify if has find the number
function verify() {
    // 获取辅助词
    let askOuput_auxIndex = Math.floor(Math.random() * askOuput_aux.length);
    if (guesser.hasFind() || guesser.totalGuess > 11) {
        new TypeWriter(UItext, askOuput_aux[askOuput_auxIndex]+`你想的是 ${guesser.getUserNumber()} 吗?`, 60);
        document.querySelector('#btn-choices').classList.toggle('no-display');
        document.querySelector('#feedback').classList.toggle('no-display');
    } else {
        ask();
    }
}

// Events for Acertou / Errou
document.querySelector('#feedback').addEventListener('click', el => {
    el.preventDefault;
    let resp;
    if (el.target.id === 'right') {
        let rightMessages = quiz.getRightMessages();
        // Get a random right message
        let rightIndex = Math.floor(Math.random() * rightMessages.length);
        message = rightMessages[rightIndex]['text'];
        currentImage = rightMessages[rightIndex]["img"];
        currentVoice = rightMessages[rightIndex]["voice"];
        changeVoice(currentVoice);
        playVoice();
    } else if (el.target.id === 'wrong') {
        let wrongMessages = quiz.getWrongMessages();
        // Get a random wrong message
        let wrongIndex = Math.floor(Math.random() * wrongMessages.length);
        message = wrongMessages[wrongIndex]['text'];
        currentImage = wrongMessages[wrongIndex]["img"];
        currentVoice = wrongMessages[wrongIndex]["voice"];
        changeVoice(currentVoice);
        playVoice();
    }

    new TypeWriter(UItext, message);
    changeImage(currentImage);

    document.querySelector('#feedback').classList.toggle('no-display');
    document.querySelector('#play-again').classList.toggle('no-display');
});

document.querySelector('#restart').addEventListener('click', el => {
    el.preventDefault();
    location.reload();
})