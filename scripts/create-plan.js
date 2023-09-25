const continueButton = document.querySelector(".continue-btn");
const questionElement = document.querySelector(".js-question");
const subheadingElement = document.querySelector(".js-subheading");
const contentElement = document.querySelector(".js-content");
const answerButtonsElement = document.querySelector(".option-list");
const warningMessage = document.querySelector(".warning-message");

const userAnswers = { length: 0, list: false };
let currentQuestionIndex = 0;

// gets the selected button

function getSelectedButton() {
  const selectedButton = answerButtonsElement.querySelector(".selected-answer");
  return !!selectedButton;
}

// get the selected answer text
function getSelectedAnswer() {
  const selectedBtn = answerButtonsElement.querySelector(".selected-answer");
  return selectedBtn ? selectedBtn.innerText : null;
}
//what happens when i click continue

continueButton.addEventListener("click", () => {
  if (getSelectedButton()) {
    //save the answer in a var and then push it in the array
    const selectedAnswer = getSelectedAnswer();

    if (selectedAnswer === "Just for today..") {
      userAnswers.length = 1;
    } else if (selectedAnswer === "The whole week") {
      userAnswers.length = 7;
    }

    if (selectedAnswer === "Sure, that would be helpful!") {
      userAnswers.list = true;
    } else {
      userAnswers.list = false;
    }

    warningMessage.classList.add("hidden");
    displayNextQuestion();
  } else {
    warningMessage.classList.remove("hidden");
  }
});

//what happens when clicking one of the options

answerButtonsElement.addEventListener("click", (event) => {
  if (event.target && event.target.matches("button")) {
    const buttons = answerButtonsElement.querySelectorAll("button");
    buttons.forEach((button) => {
      button.classList.remove("selected-answer");
    });

    event.target.classList.add("selected-answer");
  }
});

//displaying the next question

function displayNextQuestion() {
  resetState();
  //if (currentQuestionIndex < questions.length) {
  showQuestion(questions[currentQuestionIndex]);
  currentQuestionIndex++;
  //} else {
  // alert("finish!");
  //}
}

//setting the html for the next question

function showQuestion(question) {
  questionElement.innerText = question.question;
  if (question.subheading) {
    subheadingElement.innerText = question.subheading;
  }

  if (question.customHtml) {
    answerButtonsElement.remove();
    contentElement.innerHTML += question.customHtml;
    addScrollableItems();
  }
  question.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer;
    button.classList.add("answer");
    answerButtonsElement.appendChild(button);
  });
}

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

//removing the previous buttons

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
  },
];
