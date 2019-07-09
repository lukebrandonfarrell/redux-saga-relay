/**
 * @author Luke Brandon Farrell
 * @description
 */

import { all, call, put } from "redux-saga/effects";
import _omit from "lodash.omit";
import _castArray from "lodash.castarray";
import _map from "lodash.map";
import _isNil from "lodash.isnil";

/**
 * Relays a action / function in redux-saga
 *
 * @param option - either a string (to relay a action), function (to trigger a function)
 * @param action
 * @param error - a saga callback if an error occurs
 * @param transform - transform the action before it is relayed
 *
 * @return {IterableIterator<*>}
 */
export function* relay (option, action, error, transform = _transform) {
  try {
    /*
     * We want to check if action is not nil, then apply a transform, this is useful
     * for pulling out data which should not be relayed, e.g. redux analytics.
     */
    const transformedAction = !_isNil(transform) ? transform(action) : action;

    if (typeof option === 'string') {
      /*
       * We cast the string to array, and string (if multiple) them to put
       * methods, this allows one action to trigger multiple actions.
       */
      const anchors = _map(_castArray(option), (item) => {
        return put({
          ...transformedAction,
          type: item,
        })
      });

      // Relays multiple actions
      yield all(anchors);
    } else {
      yield call(option, transformedAction);
    }
  } catch (e) {
    if(error) yield call(error, e);
  }
}

/**
 * Extends and action
 *
 * @param action
 * @param payload
 * @param meta
 *
 * @return object
 */
export function extend(action, payload, meta) {
  return {
    ...action,
    payload: {
      ...action.payload,
      ...payload,
    },
    meta: {
      ...action.meta,
      ...meta
    }
  }
}

/**
 * Default transform for removing analytics form actions
 *
 * @param action
 * @return {{}}
 * @private
 */
function _transform(action){
  return _omit(action, ["meta.analytics"]);
}