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
