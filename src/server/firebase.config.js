import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/functions";
import { authState } from "rxfire/auth";
import { collection, collectionData, docData } from "rxfire/firestore";
// import {} from "firebase/functions";
import { shareReplay, switchMap } from "rxjs/operators";
import { of, firstValueFrom } from "rxjs";
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
  appId: "1:983273917063:web:a5c99835c801211ff84622",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
}


export const db = firebase.firestore();


const cartRef = db.collection('cart');
export const userCart$ = collectionData(cartRef, 'id').pipe(shareReplay(1))
 

export const deleteFromcart = async (id) => {

  try {
    db.doc(`cart/${id}`).delete();
  } catch (error) {
    console.log(error);
  }
};


export const deleteAllFromcart = async () => {
  const result = await firstValueFrom(userCart$);
  result.forEach(item => {
    db.doc(`cart/${item.id}`).delete();
  })


}



export const addToCartFirebase = async (products) => {

  return db.collection('cart').add(products)
};

export const getProductFromFirebase = (pageNumber = 1) => {
  const ref = db.collection("products")
  return collectionData(ref, "id");
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
    const ref = db
      .collection("products")
      .where("category", "array-contains-any", category);
    return collectionData(ref, "id");
  }
  return of([]);
};

// get categories from database
export const getCategoriesFromFirebase = () => {
  const ref = db.collection("categories");
  return collectionData(ref, "id").pipe(shareReplay(1));
};



export const  getpageFromFirebase =  (page) =>{
  const ref = db.collection("products").where('page', '==', page);
  return collectionData(ref, "id");

} 