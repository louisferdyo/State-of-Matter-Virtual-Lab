const slider = document.getElementById("temperature-slider");
const tempValue = document.getElementById("temperature-value");
const iceImage = document.getElementById("ice");
const waterImage = document.getElementById("liquid-water");
const gasStateContainer = document.getElementById("gas-state");
const openSidebarBtn = document.getElementById("open-sidebar");
const closeSidebarBtn = document.getElementById("close-sidebar");
const sidebar = document.getElementById("guide-sidebar");

openSidebarBtn.addEventListener("click", () => {
  sidebar.style.left = "0"; 
  openSidebarBtn.style.display = "none";
});

closeSidebarBtn.addEventListener("click", () => {
  sidebar.style.left = "-400px"; 
  openSidebarBtn.style.display = "block";
});

function updateWaterState(temperature) {
  tempValue.textContent = temperature;
  
  
  iceImage.style.display = "none";
  waterImage.style.display = "none";
  gasStateContainer.style.display = "none";

  
  if (temperature <= 0) {
    iceImage.style.display = "block"; 
  } else if (temperature > 0 && temperature < 100) {
    waterImage.style.display = "block"; 
  } else {
    gasStateContainer.style.display = "block"; 
  }
}

slider.addEventListener("input", (e) => {
  const temperature = parseInt(e.target.value, 10);
  updateWaterState(temperature);
});

updateWaterState(slider.value);
