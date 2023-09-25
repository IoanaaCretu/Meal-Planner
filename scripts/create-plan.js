const continueButton = document.querySelector(".continue-btn");
const questionElement = document.querySelector(".js-question");
const subheadingElement = document.querySelector(".js-subheading");
const contentElement = document.querySelector(".js-content");
const answerButtonsElement = document.querySelector(".option-list");
const warningMessage = document.querySelector(".warning-message");

const userAnswers = { length: 0, list: false };
let currentQuestionIndex = 0;

// function to check if a button is selected

function isButtonSelected() {
  const selectedButton = answerButtonsElement.querySelector(".selected-answer");
  return !!selectedButton;
}

// function to get the selected answer text

function getSelectedAnswer() {
  const selectedBtn = answerButtonsElement.querySelector(".selected-answer");
  return selectedBtn ? selectedBtn.innerText : null;
}

// event listener for continue button

continueButton.addEventListener("click", () => {
  if (isButtonSelected()) {
    const selectedAnswer = getSelectedAnswer();
    if (selectedAnswer === "Just for today...") {
      userAnswers.length = 1;
    } else if (selectedAnswer === "The whole week") {
      userAnswers.length = 7;
    }

    userAnswers.list =
      selectedAnswer === "Sure, that would be helpful!" ? true : false;

    warningMessage.classList.add("hidden");
    displayNextQuestion();
  } else {
    currentQuestionIndex > 1
      ? warningMessage.classList.add("hidden")
      : warningMessage.classList.remove("hidden");
  }

  console.log(userAnswers);
});

//event listener for answer buttons

answerButtonsElement.addEventListener("click", (event) => {
  if (event.target && event.target.matches("button")) {
    const buttons = answerButtonsElement.querySelectorAll("button");
    buttons.forEach((button) => {
      button.classList.remove("selected-answer");
    });

    event.target.classList.add("selected-answer");
  }
});

// function to display the next question

function displayNextQuestion() {
  resetState();

  showQuestion(questions[currentQuestionIndex]);
  currentQuestionIndex++;
}

// function to set HTML for the next question

function showQuestion(question) {
  questionElement.innerText = question.question;
  if (question.subheading) {
    subheadingElement.innerText = question.subheading;

    continueButton.innerText = question.buttonText;
  }

  if (question.customHtml) {
    answerButtonsElement.remove();
    contentElement.innerHTML += question.customHtml;
    addScrollableItems();
  }

  if (question.answers && question.answers.length > 0) {
    question.answers.forEach((answer) => {
      const button = document.createElement("button");
      button.innerText = answer;
      button.classList.add("answer");
      answerButtonsElement.appendChild(button);
    });
    continueButton.innerText = question.buttonText;
  }
}

// function to add scrollable items

function addScrollableItems() {
  const scrollableContainers = document.querySelectorAll(
    ".scrollable-container"
  );
  const scroollableItemHTML = `
    <div class="scrollable-item">
    <img
      src="meals-images/122640984_199255658526227_6899288316658324600_o.jpg"
      alt=""
    />
    <div class="meal-title">Lorem ipsum dolor sit amet.</div>
    </div>
  `;
  const numScrollableItems = userAnswers.length;
  scrollableContainers.forEach((container) => {
    container.innerHTML = "";
    for (let i = 0; i < numScrollableItems; i++) {
      container.innerHTML += scroollableItemHTML;
    }
  });
}

// function to reset the answer buttons

function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
}

const questions = [
  {
    question:
      "Would you like me to create a list of ingredients you'll need for these meals?",
    answers: ["Sure, that would be helpful!", "I'll handle that on my own!."],
    buttonText: "Let's explore some recipes",
  },

  {
    question: "Here are the recipes I've thoughtfully selected for you.",
    subheading:
      "If there are any recipes you're not in the mood for right now, simply click on the upper right corner, and I'll provide another option.",
    customHtml: `
    <div class="grid-container ">
    <div class="scrollable-container"></div>
    <div class="scrollable-container"></div>
    <div class="scrollable-container"></div>
    </div>
    `,
    buttonText: "Continue",
  },
];
