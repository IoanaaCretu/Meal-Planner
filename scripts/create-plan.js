const continueButton = document.querySelector(".continue-btn");
const questionElement = document.querySelector(".js-question");
const subheadingElement = document.querySelector(".js-subheading");
const contentElement = document.querySelector(".js-content");
const answerButtonsElement = document.querySelector(".option-list");
const warningMessage = document.querySelector(".warning-message");
const loadingIndicator = document.getElementById("overlay");
const footer = document.querySelector("footer");
const mainContent = document.querySelector("main");

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
});

//event listener for answer buttons to ensure only one button is selected a time and changing their styles when selected

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

// function to reset the answer buttons

function resetState() {
  while (answerButtonsElement.firstChild) {
    answerButtonsElement.removeChild(answerButtonsElement.firstChild);
  }
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
      "If there are any recipes you're not in the mood for right now, simply click on the recipe card and I'll provide another option.",
    customHtml: `
    <div class="grid-container ">
    <div class="scrollable-container"></div>
    <div class="scrollable-container"></div>
    <div class="scrollable-container"></div>
    </div>
    `,
    buttonText: "Discover your personalized menu",
  },
];

// function to add scrollable items

function addScrollableItems() {
  const scrollableContainers = document.querySelectorAll(
    ".scrollable-container"
  );

  const scroollableItemHTML = `    
    <img
      src=""
    />
    <div class="meal-title"></div>
    <span class="material-symbols-outlined refresh-icon">
      autorenew
    </span>
  `;

  const numScrollableItems = userAnswers.length;
  scrollableContainers.forEach((container) => {
    container.innerHTML = "";
    for (let i = 0; i < numScrollableItems; i++) {
      container.innerHTML += `
        <div class="scrollable-item" >${scroollableItemHTML}
        </div>
      `;
    }
  });

  fetchData();
}

//DATA FETCH

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

// function to select a random recipes with a certain data-meal-type in order to use it when the user wants to change one of the recipes

function getRandomObjectByType(array, type) {
  // Filter the array to get objects with matching type
  const matchingObjects = array.filter((obj) => obj.type === type);

  // Check if there are matching objects
  if (matchingObjects.length === 0) {
    return null; // No matching objects found
  }

  // Generate a random index within the filtered array
  const randomIndex = Math.floor(Math.random() * matchingObjects.length);

  // Return the random object
  return matchingObjects[randomIndex];
}

// function to update the recipe

function updateScrollableItemValues(scrollableItem, recipe) {
  if (scrollableItem) {
    const image = scrollableItem.querySelector("img");
    const mealTitle = scrollableItem.querySelector(".meal-title");

    if (image) {
      image.src = recipe.image; // Update the image source
    }

    if (mealTitle) {
      mealTitle.innerText = recipe.title; // Update the meal title
    }
  }
}

//function to fetch data

function fetchData() {
  loadingIndicator.classList.remove("hidden");
  footer.classList.add("hidden");
  mainContent.classList.add("hidden");

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
      let selectedRecipes = filterRecipes(dataArray);

      const scrollableItems = document.querySelectorAll(".scrollable-item");

      selectedRecipes.forEach((recipe, index) => {
        const scrollableItem = scrollableItems[index];

        scrollableItem.dataset.mealType = recipe.type;
        scrollableItem.dataset.recipeIndex = index;

        updateScrollableItemValues(scrollableItem, recipe);
      });

      scrollableItems.forEach((scrollableItem) => {
        scrollableItem.addEventListener("click", () => {
          const mealType = scrollableItem.getAttribute("data-meal-type");

          const newRecipe = getRandomObjectByType(dataArray, mealType);
          const currentIndex = scrollableItem.dataset.recipeIndex;
          selectedRecipes.splice(currentIndex, 1, newRecipe);

          updateScrollableItemValues(scrollableItem, newRecipe);
        });
      });

      continueButton.addEventListener("click", () => {
        const content = document.getElementById("container");
        const menuElement = document.querySelector(".meal-plan-container");
        content.classList.add("hidden");
        menuElement.classList.remove("hidden");
      });

      setTimeout(() => {
        loadingIndicator.classList.add("hidden");
        footer.classList.remove("hidden");
        mainContent.classList.remove("hidden");
      }, 2000);
      console.log(selectedRecipes);
    })

    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

/* setting the ingredients list, need to do it when the user clicks on the next step so it sets the correct list


const ingredientsList = [
  ...new Set(selectedRecipes.flatMap((obj) => obj.ingredients)),
]; */

document
  .querySelector(".save-as-picture")
  .addEventListener("click", function () {
    // Convert the menu container to an image (assuming you have it with an id 'menu-container')
    html2canvas(document.querySelector(".meal-plan")).then(function (canvas) {
      // Convert canvas to data URL
      const dataURL = canvas.toDataURL("image/png");

      // Create a link element to trigger the download
      const downloadLink = document.createElement("a");
      downloadLink.href = dataURL;
      downloadLink.download = "meal-plan.png"; // Filename for the downloaded image
      downloadLink.click();
    });
  });
