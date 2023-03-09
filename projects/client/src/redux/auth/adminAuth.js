import user_types from "./types";

const init_state = {
    id: 0,
    username: "",
    email: "",
    isSuperAdmin: 0,
    BranchId: 0,
    password: "",
};

function adminReducer(state = init_state, action) {
    if (action.type === user_types.ADMIN_LOGIN) {
        return {
            ...state,
            id: action.payload.id,
            username: action.payload.username,
            email: action.payload.email,
            isSuperAdmin: action.payload.isSuperAdmin,
            BranchId: action.payload.BranchId,
            password: action.payload.password,
        };
    } else if (action.type === user_types.ADMIN_LOGOUT) {
        return init_state;
    }
    return state;
}
export default adminReducer;
