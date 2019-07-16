export const SHOW_OVERLAY = "SHOW_OVERLAY";
export const HIDE_OVERLAY = "HIDE_OVERLAY";

const initialState = {
    show: false
};

export function overlay (state = initialState, action) {
    switch (action.type) {
        case SHOW_OVERLAY:
            return {
                ...state,
                show: true
            }
        case HIDE_OVERLAY:
            return {
                ...state,
                show: false
            }
        default:
            return state;
    }
}