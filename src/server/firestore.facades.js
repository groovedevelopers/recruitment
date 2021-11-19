import { take } from 'rxjs/operators';
import {
//     signInUsers,
//   addToCartFirebase,
//   userCart$,
//   auth,
//   deletecart

  singInAnanymousFirebase,
  addToCartFirebase,
  userCart$,
  auth,
  deletecart
} from './firebase.config';
import { uniqWith, isEqual } from 'lodash';

import { Notyf } from 'notyf';

 class FirestoreFacade {
  noty = new Notyf();

  mySuccesEvent(message) {
    this.noty.success(message);
  }

  myErrorEvent(message) {
    this.noty.error(message);
  }
  async addTocart(product) {
    const currentUser = auth.currentUser;

    try {
      const cart = await userCart$.pipe(take(1)).toPromise();

      let cartProducts = cart?.products || [];
      if (currentUser) {
        cartProducts = [...cartProducts, product];

        cartProducts = uniqWith(cartProducts, isEqual);

        await addToCartFirebase(currentUser.uid, cartProducts);
      } else {
        // const user = await signInUsers();
        const user = await singInAnanymousFirebase();

        cartProducts = [...cartProducts, product];
        cartProducts = uniqWith(cartProducts, isEqual);
        await addToCartFirebase(user.uid, cartProducts);
      }

      this.mySuccesEvent('item added to cart');
    } catch (error) {
      this.myErrorEvent('There was an error');
    }
  }

  async removeItemFromCart(index) {
    const currentUser = auth.currentUser;
    try {
      const cart = await userCart$.pipe(take(1)).toPromise();

      cart.products.splice(index, 1);

      await addToCartFirebase(currentUser.uid, cart.products);
    } catch (error) {}
  }

  async removeAllfromCart(user){

    deletecart(user)

  }

  async incrementItem(index) {
    const currentUser = auth.currentUser;
    try {
      const cart = await userCart$.pipe(take(1)).toPromise();

      cart.products[index].quantity = cart.products[index].quantity + 1;
      await addToCartFirebase(currentUser.uid, cart.products);
    } catch (error) {}
  }

  async decrementCount(index) {
    const currentUser = auth.currentUser;
    try {
      const cart = await userCart$.pipe(take(1)).toPromise();
      cart.products[index].quantity = cart.products[index].quantity - 1;
      await addToCartFirebase(currentUser.uid, cart.products);
    } catch (error) {}
  }
}
export const firestoreFacade = new FirestoreFacade()