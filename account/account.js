import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential, deleteUser } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-auth.js";
import { getFirestore, getDoc, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.11.1/firebase-firestore.js"

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

onAuthStateChanged(auth, (user) => {
    const loggedInUserId = localStorage.getItem('loggedInUserId');
    if (loggedInUserId) {
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
            .then((docSnap) => {
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    document.getElementById('loggedUserFName').innerText = userData.firstName;
                    document.getElementById('loggedUserEmail').innerText = userData.email;
                    document.getElementById('loggedUserLName').innerText = userData.lastName;
                    document.getElementById('loggedUserScore').innerText = userData.highestQuizScore;
                    
                } else {
                    console.log("No document found matching id")
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            })
    } else {
        console.log("User Id not Found in Local storage")
        window.location.href = '../login-signup/login-signup.html'; // Redirect to login page if not logged in
    }
})

const logoutButton = document.getElementById('logout');

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
        .then(() => {
            window.location.href = '../index.html';
        })
        .catch((error) => {
            console.error('Error Signing out:', error);
        })
})

// Change Password Functionality
const showChangePasswordFormButton = document.getElementById('showChangePasswordForm');
const changePasswordForm = document.getElementById('changePasswordForm');
const changePasswordButton = document.getElementById('changePasswordBtn');

showChangePasswordFormButton.addEventListener('click', () => {
    changePasswordForm.style.display = 'block';
});

changePasswordButton.addEventListener('click', () => {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match');
        return;
    }

    const user = auth.currentUser;

    // First, reauthenticate the user
    const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
    );

    reauthenticateWithCredential(user, credential)
        .then(() => {
            // User reauthenticated, now update the password
            return updatePassword(user, newPassword);
        })
        .then(() => {
            alert('Password updated successfully');
            changePasswordForm.style.display = 'none';
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmNewPassword').value = '';
        })
        .catch((error) => {
            console.error('Error updating password:', error);
            alert('Error updating password: ' + error.message);
        });

        
});

const deleteAccountButton = document.getElementById('deleteAccount');
deleteAccountButton.addEventListener('click', async () => {
    const user = auth.currentUser;

    if (!user) {
        alert("No user is currently logged in.");
        return;
    }

    const confirmation = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmation) return;

    try {
        // Reauthenticate the user
        const currentPassword = prompt("Please enter your password to confirm:");
        if (!currentPassword) throw new Error("Password is required for reauthentication.");
        const credential = EmailAuthProvider.credential(user.email, currentPassword);

        await reauthenticateWithCredential(user, credential);
        console.log("User reauthenticated successfully.");

        // Delete user document from Firestore
        const userDocRef = doc(db, "users", user.uid);
        await deleteDoc(userDocRef);
        console.log("User document deleted from Firestore.");

        // Delete the authentication profile
        await deleteUser(user);
        console.log("User account deleted successfully from Authentication.");

        // Clear local storage and redirect
        localStorage.removeItem('loggedInUserId');
        alert("Your account has been deleted.");
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000); // Add a slight delay before redirection
    } catch (error) {
        console.error("Error deleting user:", error);
        alert(`Failed to delete account: ${error.message}`);
    }
});