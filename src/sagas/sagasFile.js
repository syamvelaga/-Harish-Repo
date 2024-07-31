import { call, put, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import {
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_FAIL,
  ORDER_DETAILS_REQUEST,
  ORDER_DETAILS_SUCCESS,
  ORDER_DETAILS_FAIL,
  ORDER_PAY_REQUEST,
  ORDER_PAY_SUCCESS,
  ORDER_PAY_FAIL,
  ORDER_LIST_MY_REQUEST,
  ORDER_LIST_MY_SUCCESS,
  ORDER_LIST_MY_FAIL,
} from '../constants/orderConstants';

import {CART_ADD_ITEM,
  CART_REMOVE_ITEM,
  CART_SAVE_SHIPPING_ADDRESS,
  CART_SAVE_PAYMENT_METHOD
} from '../constants/cartConstants'

import {PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_DETAILS_REQUEST,
  PRODUCT_DETAILS_SUCCESS,
  PRODUCT_DETAILS_FAIL
} from '../constants/productConstants'

import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_DETAILS_FAIL
} from '../constants/userConstants'

// Cart sagas
function* addToCartSaga(action) {
  try {
    const { data } = yield call(axios.get, `/api/products/${action.payload.id}`);
    yield put({ type: CART_ADD_ITEM, payload: { ...data, qty: action.payload.qty } });
    localStorage.setItem('cartItems', JSON.stringify([data, ...JSON.parse(localStorage.getItem('cartItems') || '[]')]));
  } catch (error) {
    console.error(error);
  }
}

function* removeFromCartSaga(action) {
  try {
    yield put({ type: CART_REMOVE_ITEM, payload: action.payload });
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]').filter(item => item._id !== action.payload);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  } catch (error) {
    console.error(error);
  }
}

function* saveShippingAddressSaga(action) {
  try {
    yield put({ type: CART_SAVE_SHIPPING_ADDRESS, payload: action.payload });
    localStorage.setItem('shippingAddress', JSON.stringify(action.payload));
  } catch (error) {
    console.error(error);
  }
}

function* savePaymentMethodSaga(action) {
  try {
    yield put({ type: CART_SAVE_PAYMENT_METHOD, payload: action.payload });
    localStorage.setItem('paymentMethod', JSON.stringify(action.payload));
  } catch (error) {
    console.error(error);
  }
}

// Order sagas
function* createOrderSaga(action) {
  try {
    const { data } = yield call(axios.post, '/api/orders', action.payload);
    yield put({ type: ORDER_CREATE_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: ORDER_CREATE_FAIL, payload: error.message });
  }
}

function* getOrderDetailsSaga(action) {
  try {
    const { data } = yield call(axios.get, `/api/orders/${action.payload}`);
    yield put({ type: ORDER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: ORDER_DETAILS_FAIL, payload: error.message });
  }
}

function* payOrderSaga(action) {
  try {
    const { data } = yield call(axios.put, `/api/orders/${action.payload.id}/pay`, action.payload);
    yield put({ type: ORDER_PAY_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: ORDER_PAY_FAIL, payload: error.message });
  }
}

function* listMyOrdersSaga() {
  try {
    const { data } = yield call(axios.get, '/api/orders/myorders');
    yield put({ type: ORDER_LIST_MY_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: ORDER_LIST_MY_FAIL, payload: error.message });
  }
}

// Product sagas
function* listProductsSaga() {
  try {
    const { data } = yield call(axios.get, '/api/products');
    yield put({ type: PRODUCT_LIST_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: PRODUCT_LIST_FAIL, payload: error.message });
  }
}

function* getProductDetailsSaga(action) {
  try {
    const { data } = yield call(axios.get, `/api/products/${action.payload}`);
    yield put({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: PRODUCT_DETAILS_FAIL, payload: error.message });
  }
}

// User sagas
function* loginUserSaga(action) {
  try {
    const { data } = yield call(axios.post, '/api/users/login', action.payload);
    yield put({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    yield put({ type: USER_LOGIN_FAIL, payload: error.message });
  }
}

function* registerUserSaga(action) {
  try {
    const { data } = yield call(axios.post, '/api/users', action.payload);
    yield put({ type: USER_REGISTER_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    yield put({ type: USER_REGISTER_FAIL, payload: error.message });
  }
}

function* getUserDetailsSaga(action) {
  try {
    const { data } = yield call(axios.get, `/api/users/${action.payload}`);
    yield put({ type: USER_DETAILS_SUCCESS, payload: data });
  } catch (error) {
    yield put({ type: USER_DETAILS_FAIL, payload: error.message });
  }
}

// Root saga
function* rootSaga() {
  yield takeEvery(CART_ADD_ITEM, addToCartSaga);
  yield takeEvery(CART_REMOVE_ITEM, removeFromCartSaga);
  yield takeEvery(CART_SAVE_SHIPPING_ADDRESS, saveShippingAddressSaga);
  yield takeEvery(CART_SAVE_PAYMENT_METHOD, savePaymentMethodSaga);
  yield takeEvery(ORDER_CREATE_REQUEST, createOrderSaga);
  yield takeEvery(ORDER_DETAILS_REQUEST, getOrderDetailsSaga);
  yield takeEvery(ORDER_PAY_REQUEST, payOrderSaga);
  yield takeEvery(ORDER_LIST_MY_REQUEST, listMyOrdersSaga);
  yield takeEvery(PRODUCT_LIST_REQUEST, listProductsSaga);
  yield takeEvery(PRODUCT_DETAILS_REQUEST, getProductDetailsSaga);
  yield takeEvery(USER_LOGIN_REQUEST, loginUserSaga);
  yield takeEvery(USER_REGISTER_REQUEST, registerUserSaga);
  yield takeEvery(USER_DETAILS_REQUEST, getUserDetailsSaga);
}

export default rootSaga;