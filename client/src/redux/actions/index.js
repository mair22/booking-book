import { createActions } from "redux-actions";

export const getType = (reduxAction) => {
  return async (dispatch) => {
    return reduxAction().type;
  };
};
export const getPosts = createActions({
  getPostsRequest: undefined,
  getPostsSuccess: (payload) => payload,
  getPostsFailure: (err) => err,
});
