import { auth } from "../login-signup/firebaseauth.js"; 
import { db } from "../login-signup/firebaseauth.js";  
import { doc, updateDoc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const draggables = document.querySelectorAll('.draggable');
const dropZones = document.querySelectorAll('.drop-zone');
const feedback = document.getElementById('feedback');
const scoreDisplay = document.getElementById('scoreDisplay');
const openSidebarBtn = document.getElementById("open-sidebar");
const closeSidebarBtn = document.getElementById("close-sidebar");
const sidebar = document.getElementById("guide-sidebar");
const resetButton = document.getElementById('resetQuiz');

let draggedItem = null;
let score = 0;
let userId = null;

// Firebase auth state listener
auth.onAuthStateChanged((user) => {
    if (user) {
        userId = user.uid;
        console.log("Logged in user ID:", userId);
        loadUserScore(userId); // Load the existing highest score for the user
    } else {
        console.log("No user is logged in");
    }
});

// Function to load the user's existing highest score
async function loadUserScore(userId) {
    const userDocRef = doc(db, "users", userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
        const userData = docSnap.data();
        const highestScore = userData.highestQuizScore || 0;
        scoreDisplay.textContent = `Score: ${score}`;
        console.log(`Loaded highest score for user: ${highestScore}`);
    } else {
        console.log("No user document found, creating one...");
        await setDoc(userDocRef, { highestQuizScore: 0 }); // Create a document with initial highest score
    }
}

// Function to save the highest score in Firestore
async function saveUserScore(userId, newScore) {
    if (!userId) {
        console.error("User ID is null. Cannot save score.");
        return;
    }

    const userDocRef = doc(db, "users", userId);
    try {
        const docSnap = await getDoc(userDocRef);
        let highestScore = 0;

        if (docSnap.exists()) {
            const userData = docSnap.data();
            highestScore = userData.highestQuizScore || 0;
        }

        if (newScore > highestScore) {
            await updateDoc(userDocRef, { highestQuizScore: newScore });
            console.log("New highest score updated successfully:", newScore);
        } else {
            console.log("Current score is not higher than the highest score.");
        }
    } catch (error) {
        console.error("Error updating highest score:", error);
    }
}

// Sidebar toggle logic
openSidebarBtn.addEventListener("click", () => {
    sidebar.style.left = "0";
    openSidebarBtn.style.display = "none";
});

closeSidebarBtn.addEventListener("click", () => {
    sidebar.style.left = "-450px";
    openSidebarBtn.style.display = "block";
});

// Drag-and-drop event listeners
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

        if (score < 9) {
            score++;
            feedback.textContent = "Correct! Well done!";
            scoreDisplay.textContent = `Score: ${score}`;
            feedback.style.color = "green";
            saveUserScore(userId, score);
        }

        if (score === 9) {
            feedback.textContent = "Congratulations! You've reached the maximum score!";
            feedback.style.color = "blue";
            resetButton.style.display = 'block'; 
        }
    } else {
        feedback.textContent = "Incorrect drop! Try again.";
        feedback.style.color = "red";
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

resetButton.addEventListener('click', resetQuiz);

async function resetQuiz() {
    // Reset local score
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    feedback.textContent = '';

    const originalParent = document.querySelector('.draggable-items');
    draggables.forEach(item => {
        item.style.display = 'block';
        originalParent.appendChild(item);
    });

    resetButton.style.display = 'none';

    console.log("Quiz reset complete. Highest score remains unchanged.");
}
