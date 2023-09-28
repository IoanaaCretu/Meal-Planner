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
    <img
      src="https://images.pexels.com/photos/2635307/pexels-photo-2635307.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      alt=""
    />
    <div class="meal-title">Lorem ipsum dolor sit amet.</div>
  `;
  const numScrollableItems = userAnswers.length;
  scrollableContainers.forEach((container) => {
    container.innerHTML = "";
    for (let i = 0; i < numScrollableItems; i++) {
      const itemId = `${i + 1}`;
      container.innerHTML += `
        <div class="scrollable-item" id="${itemId}">${scroollableItemHTML}
        </div>
      `;
    }
  });
  fetchData();
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
    <div class="scrollable-container breakfast"></div>
    <div class="scrollable-container lunch"></div>
    <div class="scrollable-container dinner"></div>
    </div>
    `,
    buttonText: "Continue",
  },
];

//TEST GOOGLE SHEETS

// Shuffle the arrays randomly
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to filter the recipes

function filterRecipes(array) {
  const breakfastRecipes = array.filter(
    (recipe) => recipe.type === "Breakfast"
  );
  const lunchRecipes = array.filter((recipe) => recipe.type === "Lunch");
  const dinnerRecipes = array.filter((recipe) => recipe.type === "Dinner");

  shuffleArray(breakfastRecipes);
  shuffleArray(lunchRecipes);
  shuffleArray(dinnerRecipes);

  // Select the first 7 items from each shuffled array
  const selectedRecipes = [
    ...breakfastRecipes.slice(0, userAnswers.length),
    ...lunchRecipes.slice(0, userAnswers.length),
    ...dinnerRecipes.slice(0, userAnswers.length),
  ];

  return selectedRecipes;
}

/* function displayData() {
  const scrollableItems = document.querySelectorAll('scrollable-item');
  scrollableItems.forEach(item => {

  })
} */

//function to fetch data

function fetchData() {
  /*  if (userAnswers.length === 0) {
    // User answers not ready yet, delay fetching
    setTimeout(fetchData, 1000); // Retry after 1 second (adjust the delay as needed)
    return;
  } */

  const url =
    "https://script.google.com/macros/s/AKfycbw2xftG_JPmL4iZsBjFrqkMVgk3zfohDQOSOaNVlrvlDal6GWBUvw13dVuk8YqIKAy3LQ/exec";
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const dataObject = data;
      const dataArray = dataObject.data;
      const selectedRecipes = filterRecipes(dataArray);

      const scrollableItems = document.querySelectorAll(".scrollable-item");

      selectedRecipes.forEach((recipe, index) => {
        const itemId = index + 1;
        const scrollableItem = scrollableItems[itemId - 1]; // Get the corresponding scrollable item
        if (scrollableItem) {
          // Check if the scrollable item exists
          const image = scrollableItem.querySelector("img");
          const mealTitle = scrollableItem.querySelector(".meal-title");

          if (image) {
            image.src = recipe.image; // Update the image source
          }
          if (mealTitle) {
            mealTitle.innerText = recipe.title; // Update the meal title
          }
        }
      });
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
