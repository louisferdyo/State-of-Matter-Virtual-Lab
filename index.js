// Get references to elements
const slider = document.getElementById("temperature-slider");
const tempValue = document.getElementById("temperature-value");
const iceImage = document.getElementById("ice");
const waterImage = document.getElementById("liquid-water");
const gasStateContainer = document.getElementById("gas-state");
const openSidebarBtn = document.getElementById("open-sidebar");
const closeSidebarBtn = document.getElementById("close-sidebar");
const sidebar = document.getElementById("guide-sidebar");

openSidebarBtn.addEventListener("click", () => {
  sidebar.style.left = "0"; // Slide in the sidebar
  openSidebarBtn.style.display = "none";
});

closeSidebarBtn.addEventListener("click", () => {
  sidebar.style.left = "-300px"; // Slide out the sidebar
  openSidebarBtn.style.display = "block";
});
// Function to update water state based on temperature
function updateWaterState(temperature) {
  tempValue.textContent = temperature;
  
  // Hide all images initially
  iceImage.style.display = "none";
  waterImage.style.display = "none";
  gasStateContainer.style.display = "none";

  // Determine which state to show based on temperature
  if (temperature <= 0) {
    iceImage.style.display = "block"; // Show ice
  } else if (temperature > 0 && temperature < 100) {
    waterImage.style.display = "block"; // Show liquid water
  } else {
    gasStateContainer.style.display = "block"; // Show gas state (glass with steam)
  }
}

// Event listener to update the state in real-time
slider.addEventListener("input", (e) => {
  const temperature = parseInt(e.target.value, 10);
  updateWaterState(temperature);
});

// Initialize with default temperature
updateWaterState(slider.value);
