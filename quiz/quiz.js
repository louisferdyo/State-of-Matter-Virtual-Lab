const draggables = document.querySelectorAll('.draggable');
const dropZones = document.querySelectorAll('.drop-zone');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('scoreDisplay');
const openSidebarBtn = document.getElementById("open-sidebar");
const closeSidebarBtn = document.getElementById("close-sidebar");
const sidebar = document.getElementById("guide-sidebar");

let draggedItem = null; 
let score = 0; 


openSidebarBtn.addEventListener("click", () => {
    sidebar.style.left = "0";
    openSidebarBtn.style.display = "none";
});

closeSidebarBtn.addEventListener("click", () => {
    sidebar.style.left = "-450px";
    openSidebarBtn.style.display = "block";
});


draggables.forEach(item => {
    item.addEventListener('dragstart', () => startDrag(item));
    item.addEventListener('dragend', endDrag);

    
    item.addEventListener('touchstart', (e) => startTouch(e, item), { passive: false });
    item.addEventListener('touchmove', (e) => moveTouch(e), { passive: false });
    item.addEventListener('touchend', (e) => endTouch(e));
});


dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => e.preventDefault());
    zone.addEventListener('drop', () => handleDrop(zone));
});


function startDrag(item) {
    draggedItem = item;
    item.classList.add('dragging');
}


function startTouch(e, item) {
    e.preventDefault(); 
    draggedItem = item;
    item.classList.add('dragging');

    const touch = e.touches[0];
    item.style.position = 'absolute';
    moveItem(item, touch.pageX, touch.pageY);
}


function moveTouch(e) {
    e.preventDefault();
    if (!draggedItem) return;

    const touch = e.touches[0];
    moveItem(draggedItem, touch.pageX, touch.pageY);
}


function moveItem(item, x, y) {
    item.style.left = `${x - item.offsetWidth / 2}px`;
    item.style.top = `${y - item.offsetHeight / 2}px`;
}


function endTouch(e) {
    const touch = e.changedTouches[0];
    const dropZone = document.elementFromPoint(touch.clientX, touch.clientY);

    if (dropZone && dropZone.classList.contains('drop-zone')) {
        handleDrop(dropZone);
    } else {
        resetItem(draggedItem);
    }
    endDrag();
}


function endDrag() {
    if (draggedItem) draggedItem.classList.remove('dragging');
    draggedItem = null;
}

function handleDrop(zone) {
    if (!draggedItem) return;

    if (isCorrectDrop(draggedItem, zone)) {
        zone.appendChild(draggedItem);
        draggedItem.style.display = 'none';
        score++;
        feedback.textContent = "Correct! Well done!";
        scoreDisplay.textContent = `Score: ${score}`;

        if (score === draggables.length) {
            feedback.textContent = "All answers are correct! Fantastic!";
        }
    } else {
        feedback.textContent = "Incorrect drop! Try again.";
        resetItem(draggedItem);
    }
    draggedItem = null;
}

function isCorrectDrop(draggedItem, dropZone) {
    const correctAnswers = {
        'ice-description': 'solid-zone',
        'water-description': 'liquid-zone',
        'steam-description': 'gas-zone',
    };
    return dropZone.id === correctAnswers[draggedItem.id];
}

function resetItem(item) {
    const originalParent = document.querySelector('.draggable-items');
    originalParent.appendChild(item);
    item.style.display = 'block';
}
