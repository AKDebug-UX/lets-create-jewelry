import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import auth from "./Context/FirebaseConfig";

// Sign Up function
const signUp = (email, password, setLoading, name) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      //ASSIGN USER DATA
      const userData = userCredential.user;
      console.log(userData.displayName);

      // Update user profile with THEIR display name
      updateProfile(userData, {
        displayName: name,
      });

      // Send email verification
      sendEmailVerification(userData).then(() => {
        setLoading(false);
      });
      return userData;
    })
    .catch((error) => {
      throw error;
    });
};

// Sign In function
const signIn = (email, password, setLoading) => {
  setLoading(true); // Set loading to true when the function starts

  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const userData = userCredential.user;

      // Check if the user's email is verified
      if (userData.emailVerified) {
        setLoading(false);
        return userData;
      } else {
        setLoading(false);
        throw new Error("Email not verified");
      }
    })
    .catch((error) => {
      setLoading(false);
      throw error;
    });
};


// Sign Out function
const signOut = () => {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
      setLoadiing(false);
    })
    .catch((error) => {
      // An error happened.
      throw error;
    });
};

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        reject(new Error("No user is signed in"));
      }
    });
    // Cleanup the listener when it's no longer needed
    return () => unsubscribe();
  });
};

let Id = localStorage.getItem('sessionId')

const statusOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    stripeSecretKey: 'sk_test_2IIZj9qvETFVO3EvJYJHAUQ100SCzRfnk5',
    sessionId: Id
  })
}


const checkPaymentStatus = () => {
  return fetch('https://techthoth-stripe-server.onrender.com/check-payment-status', statusOptions)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      return response.json().then(json => Promise.reject(json));
    })
    .then(data => {
      console.log(data.payment_status); // Log the full response data to inspect it
      return data.payment_status; // Return the payment status so it can be used elsewhere
    })
    .catch(err => {
      console.error('An Error Occurred:', err.message);
      return Promise.reject(err.message); // Reject the promise with the error message
    });
}

export { signUp, signIn, signOut, getCurrentUser, checkPaymentStatus };
