import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import "firebase/functions";
import { authState } from "rxfire/auth";
import { collection, collectionData, docData } from "rxfire/firestore";
// import {} from "firebase/functions";
import {
  refCount,
  shareReplay,
  publishReplay,
  switchMap,
  filter,
  map,
  timestamp,
} from "rxjs/operators";
import { BehaviorSubject, of } from "rxjs";
import { getDownloadURL } from "rxfire/storage";
// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOIzblPrpb6v9GF-ow_R1odOAv4gjQbq0",
  authDomain: "bejamas-97fa3.firebaseapp.com",
  projectId: "bejamas-97fa3",
  storageBucket: "bejamas-97fa3.appspot.com",
  messagingSenderId: "983273917063",
  appId: "1:983273917063:web:a5c99835c801211ff84622"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

firebase.initializeApp(firebaseConfig);


export const db = firebase.firestore();
export const auth = firebase.auth();
export const storage = firebase.storage();

export const fireAuthState = authState(auth).pipe(
    shareReplay(1)
  );

export const singInAnanymousFirebase = () =>{
    return auth.signInAnonymously();
    }

    export const userCart$ = fireAuthState.pipe(switchMap(user => {
        if (user){
         return  getUserCart(user.uid)
        }
        return of(null)
        
         
        }), shareReplay(1))

export const getUserCart = (id) => {
    const ref = db.doc(`cart/${id}`);
    return docData(ref);
  };
  
  export const deletecart = async (user) => {
    try {
      db.doc(`cart/${user}`).delete();
    } catch (error) {
      console.log(error);
    }
  };
  
  export const addToCartFirebase = (id, products) => {
    return db.doc(`cart/${id}`).set({ products }, { merge: true });
  };


export const getProductFromFirebase = () => {
    const ref = db.collection('products').limit(3);
    return collectionData(ref, 'id');
  };
  export const getOneProduct = (id) => {
    const ref = db.doc(`products/${id}`);
    return docData(ref, "id");
  };

  export const getFeaturedProductFromFirebase = () => {
    const ref = db.collection("products").where("featured", "==", "true");
    return collectionData(ref, "id");
  };

  export const getProductFromFirebaseByCategory = (category) => {

    if (category?.length) {
      const ref = db.collection('products').where('category', 'array-contains-any', category);
      return collectionData(ref, "id")
    }
    return of([])
  };

  // get categories from database
export const getCategoriesFromFirebase =() => {
    const ref = db.collection('categories')
    return collectionData(ref, "id").pipe(shareReplay(1))
  }



