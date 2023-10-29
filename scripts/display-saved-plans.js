const savedMealPlansJSON = localStorage.getItem("favoriteMealPlans") || "[]";
const savedMealPlans = JSON.parse(savedMealPlansJSON);
const hsElement = document.querySelector(".hs-wrap");

// Select the message element
const noMealPlansMessage = document.getElementById("no-meal-plans-message");

if (savedMealPlans.length === 0) {
  // If there are no saved meal plans, display the message
  hsElement.style.display = "none";
} else {
  // If there are saved meal plans, you can hide or remove the message element
  noMealPlansMessage.style.display = "none";
  // or
  // noMealPlansMessage.remove();
}

// Step 1: Retrieve the array of image URLs from local storage
const storedImageURLs = JSON.parse(localStorage.getItem("favoriteMealPlans"));

// Step 2: Get the "hs-container" element
const container = document.querySelector(".hs-container");

// Initialize a counter to keep track of the number of images added to the current div
let imagesInCurrentDiv = 0;
let currentDiv = null;

// Step 3: Loop through the image URLs and create divs for every two images
for (const imageURL of storedImageURLs) {
  // Create a new div if the current one is empty or has two images
  if (imagesInCurrentDiv === 0) {
    currentDiv = document.createElement("div");
    currentDiv.classList.add("js-check-size");
  }

  // Create a span element for the image
  const span = document.createElement("span");
  const img = document.createElement("img");
  img.src = imageURL;
  img.alt = "";

  // Append the image to the span and the span to the current div
  span.appendChild(img);
  currentDiv.appendChild(span);

  imagesInCurrentDiv++;

  // If two images have been added to the current div, append it to the container
  if (imagesInCurrentDiv === 1) {
    container.appendChild(currentDiv);
    imagesInCurrentDiv = 0;
  }
}

// If there's a div with one image remaining, append it to the container
if (currentDiv) {
  container.appendChild(currentDiv);
}

//BUTTONS BEHAVIOUR

const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");

const scrollSize = document.querySelector(".js-check-size").offsetWidth;

container.addEventListener("wheel", (e) => {
  e.preventDefault();
  container.scrollLeft += e.deltaY;
  container.style.scrollBehavior = "auto";
});

nextBtn.addEventListener("click", () => {
  container.style.scrollBehavior = "smooth";
  container.scrollLeft += scrollSize;
});
backBtn.addEventListener("click", () => {
  container.style.scrollBehavior = "smooth";
  container.scrollLeft -= scrollSize;
});
