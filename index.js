/**
 * @author Luke Brandon Farrell
 * @description
 */

import { call, put } from "redux-saga/effects";
import _omit from "lodash/omit";

/**
 * Relays an action to trigger another action
 *
 * @param type
 * @param action
 *
 * @return {*}
 */
export function* relayAction(type, action) {
  // We pull any analytics data out of the action when relayed
  const parsedAction = _omit(action, ["meta.analytics"]);

  yield put({
    ...parsedAction,
    type
  });
}

/**
 * Relays a saga to trigger a callback
 *
 * @param callback
 * @param args
 *
 * @return {*}
 */
export function* relayCallback(callback, ...args) {
  yield call(callback, ...args);
}