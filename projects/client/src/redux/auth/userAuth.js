import user_types from "./types";

const init_state = {
  id: 0,
  username: "",
  email: "",
  password: "",
  isVerify: false,
};

function userReducer(state = init_state, action) {
  // console.log(action);
  if (action.type === user_types.USER_LOGIN) {
    return {
      ...state,
      id: action.payload.id,
      username: action.payload.username,
      email: action.payload.email,
      password: action.payload.password,
      isVerify: action.payload.isVerify,
    };
  } else if (action.type === user_types.USER_LOGOUT) {
    return init_state;
  }
  return state;
}
export default userReducer;
