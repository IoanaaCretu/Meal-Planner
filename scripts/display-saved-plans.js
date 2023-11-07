const savedMealPlansJSON = localStorage.getItem("favoriteMealPlans") || "[]";
const savedMealPlans = JSON.parse(savedMealPlansJSON);
const hsElement = document.querySelector(".hs-wrap");

// Select the message element
const noMealPlansMessage = document.getElementById("no-meal-plans-message");

if (savedMealPlans.length === 0) {
  hsElement.style.display = "none";
} else {
  noMealPlansMessage.style.display = "none";
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
    currentDiv.classList.add("js-meal-plan");
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

//SCROLLING BEHAVIOUR

const backBtn = document.getElementById("backBtn");
const nextBtn = document.getElementById("nextBtn");

const scrollSize = document.querySelector(".js-meal-plan").offsetWidth;

container.addEventListener("wheel", (e) => {
  e.preventDefault();
  container.scrollLeft += e.deltaY;
  container.style.scrollBehavior = "auto";
});

nextBtn.addEventListener("click", () => {
  container.style.scrollBehavior = "smooth";
  container.scrollLeft += scrollSize;

  featureButtons.classList.add("visually-hidden");
});
backBtn.addEventListener("click", () => {
  container.style.scrollBehavior = "smooth";
  container.scrollLeft -= scrollSize;

  featureButtons.classList.add("visually-hidden");
});

// DELETE AND DOWNLOAD BUTTONS

const mealPlans = document.querySelectorAll(".js-meal-plan");
const featureButtons = document.querySelector(".js-buttons");

let currentMealPlan;

mealPlans.forEach((mealPlan) => {
  mealPlan.addEventListener("click", () => {
    featureButtons.classList.remove("visually-hidden");
    currentMealPlan = mealPlan;
  });
});

document.querySelector(".download-btn").addEventListener("click", () => {
  // Convert the menu container to an image (assuming you have it with an id 'menu-container')
  html2canvas(currentMealPlan).then(function (canvas) {
    // Convert canvas to data URL
    const dataURL = canvas.toDataURL("image/png");

    // Create a link element to trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = dataURL;
    downloadLink.download = "meal-plan.png"; // Filename for the downloaded image
    downloadLink.click();
  });
});

document.querySelector(".delete-btn").addEventListener("click", () => {
  currentMealPlan.parentNode.removeChild(currentMealPlan);

  imgElement = currentMealPlan.querySelector("img");
  imgSrc = imgElement.getAttribute("src");

  const favoriteMealPlans =
    JSON.parse(localStorage.getItem("favoriteMealPlans")) || [];

  // Find the index of the item to remove based on imgSrc
  const indexToRemove = favoriteMealPlans.findIndex((item) => item === imgSrc);

  if (indexToRemove !== -1) {
    // If the item with imgSrcToDelete is found, remove it
    favoriteMealPlans.splice(indexToRemove, 1);
    featureButtons.classList.add("visually-hidden");

    if (favoriteMealPlans.length === 0) {
      hsElement.style.display = "none";
      noMealPlansMessage.style.display = "";
    }

    // Save the updated data back to local storage
    localStorage.setItem(
      "favoriteMealPlans",
      JSON.stringify(favoriteMealPlans)
    );
  }
});
