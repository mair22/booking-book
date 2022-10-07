import { call, takeLatest } from "redux-saga/effects";
import * as actions from "../actions";
import * as api from "../../api";

function* fetchPostSaga(action) {
  const posts = yield call(api.fetchPost);
  console.log("[posts]", posts);
}

function* mySaga() {
  yield takeLatest(actions.getPosts.getPostsRequest, fetchPostSaga);
}

export default mySaga;
