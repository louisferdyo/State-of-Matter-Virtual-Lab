// script.js
const draggables = document.querySelectorAll('.draggable');
const dropZones = document.querySelectorAll('.drop-zone');
const feedback = document.getElementById('feedback');
const checkAnswersButton = document.getElementById('checkAnswers');
const openSidebarBtn = document.getElementById("open-sidebar");
const closeSidebarBtn = document.getElementById("close-sidebar");
const sidebar = document.getElementById("guide-sidebar");

openSidebarBtn.addEventListener("click", () => {
  sidebar.style.left = "0"; // Slide in the sidebar
  openSidebarBtn.style.display = "none";
});

closeSidebarBtn.addEventListener("click", () => {
  sidebar.style.left = "-400px"; // Slide out the sidebar
  openSidebarBtn.style.display = "block";
});

let answers = {
    solid: [],
    liquid: [],
    gas: []
};

// Add drag event listeners to each draggable item
draggables.forEach(item => {
    item.addEventListener('dragstart', () => {
        item.classList.add('dragging');
    });

    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
    });
});

// Add drop event listeners to each drop zone
dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    zone.addEventListener('drop', (e) => {
        const droppedItem = document.querySelector('.dragging');
        if (zone.id === 'solid-zone' && (droppedItem.id === 'ice-description' || droppedItem.id === 'rock-description')) {
            answers.solid.push(droppedItem.id);
            zone.appendChild(droppedItem);
        } else if (zone.id === 'liquid-zone' && (droppedItem.id === 'water-description' || droppedItem.id === 'oil-description')) {
            answers.liquid.push(droppedItem.id);
            zone.appendChild(droppedItem);
        } else if (zone.id === 'gas-zone' && (droppedItem.id === 'steam-description' || droppedItem.id === 'air-description')) {
            answers.gas.push(droppedItem.id);
            zone.appendChild(droppedItem);
        } else {
            feedback.textContent = "Try again!";
        }
    });
});

// Check answers button
checkAnswersButton.addEventListener('click', () => {
    const solidCorrect = answers.solid.length === 2 && answers.solid.includes('ice-description') && answers.solid.includes('rock-description');
    const liquidCorrect = answers.liquid.length === 2 && answers.liquid.includes('water-description') && answers.liquid.includes('oil-description');
    const gasCorrect = answers.gas.length === 2 && answers.gas.includes('steam-description') && answers.gas.includes('air-description');

    if (solidCorrect && liquidCorrect && gasCorrect) {
        feedback.textContent = "Correct! Well done!";
    } else {
        feedback.textContent = "Some answers are incorrect. Try again!";
    }
});
