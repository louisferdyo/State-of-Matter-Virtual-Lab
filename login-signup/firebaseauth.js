// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD1humTQc-2jP0K2G-ECFoNMIuCVs-gxaE",
    authDomain: "state-of-matter-virtual-lab.firebaseapp.com",
    projectId: "state-of-matter-virtual-lab",
    storageBucket: "state-of-matter-virtual-lab.firebasestorage.app",
    messagingSenderId: "920553604418",
    appId: "1:920553604418:web:7fe17673a95f4f2bd7b4db"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  
const db = getFirestore(app);  

export {auth, db, app}; 

// Utility function to show messages
function showMessage(message, divId) {
    const messageDiv = document.getElementById(divId);
    messageDiv.style.display = "block";
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(() => {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Sign up event listener
const signUp = document.getElementById('submitSignUp');
if (signUp){
    signUp.addEventListener('click', (event) => {
        event.preventDefault();
        const email = document.getElementById('rEmail').value;
        const password = document.getElementById('rPassword').value;
        const firstName = document.getElementById('fName').value;
        const lastName = document.getElementById('lName').value;

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userData = {
                    email: email,
                    firstName: firstName,
                    lastName: lastName
                };
                showMessage('Account Created Successfully', 'signUpMessage');
                const docRef = doc(db, "users", user.uid);
                setDoc(docRef, userData)
                    .then(() => {
                        window.location.href = '../account/account.html';
                    })
                    .catch((error) => {
                        console.error("Error writing document", error);
                    });
            })
            .catch((error) => {
                const errorCode = error.code;
                if (errorCode == 'auth/email-already-in-use') {
                    showMessage('Email Address Already Exists !!!', 'signUpMessage');
                } else {
                    showMessage('Unable to create User', 'signUpMessage');
                }
            });
    });
}

// Sign in event listener
const signIn = document.getElementById('submitSignIn');
if (signIn){
    signIn.addEventListener('click', (event) => {
        event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            showMessage('Login is successful', 'signInMessage');
            const user = userCredential.user;
            localStorage.setItem('loggedInUserId', user.uid);
            window.location.href = '../account/account.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-credential') {
                showMessage('Incorrect Email or Password', 'signInMessage');
            } else {
                showMessage('Account does not Exist', 'signInMessage');
            }
        });
    });
}
