# redux-saga-relay

Transform verbose logic  in redux-saga into compact callbacks. **You need to have [redux-saga](https://github.com/redux-saga/redux-saga) installed to use the library**.

**Before**
```js
import { takeEvery, all, put } from "redux-saga";
import { BUTTON_PRESSED, FETCH_TODOS, FETCH_USERS, FETCH_PAYMENTS } from "./types";

export function* root() {
  yield takeEvery(BUTTON_PRESSED, _dispatchMultipleRequests),
}

function* _dispatchMultipleRequests(){
    yield all([
      put({ type: FETCH_TODOS }),
      put({ type: FETCH_USERS }),
      put({ type: FETCH_PAYMENTS }),
    ]);
}
```

**After**
```js
import { takeEvery } from "redux-saga";
import { relay } from "redux-saga-relay";
import { BUTTON_PRESSED, FETCH_TODOS, FETCH_USERS, FETCH_PAYMENTS } from "./types";

export function* root() {
  yield takeEvery(BUTTON_PRESSED, (action) => 
    relay([FETCH_TODOS, FETCH_USERS, FETCH_PAYMENTS], action)
  )
}
```

See below for all options and complex transformations.

## Install

NPM:
```sh
 npm install redux-saga-relay
```
Yarn:

```js
yarn add redux-saga-relay
```

## Usage

Pass a string and relay a single action:

```js
(action) => relay(TYPE_1, action)
```

Pass an array of strings and relay multiple actions:

```js
(action) => relay([TYPE_1, TYPE_2, TYPE_2], action)
```

The triggered action will be spread into `TYPE_1`, `TYPE_2` and `TYPE_3` and dispatched to the redux store, after a transformation has been applied (more on transformations below).

Pass a function and relay to a callback:

```js
(action) => relay(() => {
   // Do something here
})
```

#### Catch Issues

The relay code is wrapped in a try - catch stament,  meaning that you can catch errors in your callbacks, to hook into the catch stament pass a function as the third parameter of the `relay` function.

```js
(action) => relay(() => {
   const value = 0 / 0; //Bad code
}, null, _recordErrorInSentry)
```

#### Transformations

Actions are transformed by default to remove `meta.analytics` from the action before it is relayed. You can optionally overwrite this transformation by passing a function to the forth parameter of the `relay` function.

```js
(action) => relay(TYPE_1, action, _recordErrorInSentry, _customTransform)

function _customTransform(action) {
   return _.omit(action, "payload") // apply custom transform to action before it is relayed
}
```

## Authors

* [**Luke Brandon Farrell**](https://lukebrandonfarrell.com/) - *Author*

## License

This project is licensed under the MIT Licen