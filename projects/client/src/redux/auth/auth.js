import user_types from "./types";
const init_state = {
  id: 0,
  username: "",
  email: "",
  password: "",
  isVerify: false,
};

function userReducer(state = init_state, action) {
  if (action.type === user_types.USER_LOGIN) {
    return {
      ...state,
      id: action.payload.id,
      username: action.payload.username,
      password: action.payload.password,
      name: action.payload.name,
      email: action.payload.email,
      isadmin: action.payload.isadmin,
      // avatar_url:action.payload.avatar_url
    };
  } else if (action.type === user_types.USER_LOGOUT) {
    return init_state;
  }
  return state;
}
export default userReducer;
