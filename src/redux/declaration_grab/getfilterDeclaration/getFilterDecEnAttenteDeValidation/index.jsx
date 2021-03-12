import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
/* ------------- Types and Action Creators ------------- */
/**
 * Inialisation des 3 actions
 */

const { Types, Creators } = createActions({
    getFilterDeclarationsEnAttenteDeValidationRequest: ['response'],
    getFilterDeclarationsEnAttenteDeValidationSuccess: ['response', 'loading'],
    getFilterDeclarationsEnAttenteDeValidationFailure: ['error'],
})

export const getFilterDeclarationsEnAttenteDeValidationTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    response: null,
    error: null,
    loading: null,
})

/* ------------- Reducers ------------- */

/**
 * reducers action success
 * @param {*} state
 */
const getFilterDeclarationsEnAttenteDeValidationSuccess = (
    state,
    { response }
) =>
    state.merge({
        error: false,
        response,
        loading: false,
    })
/**
 * reducers action failure
 * @param {*} state
 */
const getFilterDeclarationsEnAttenteDeValidationFailure = (state, { error }) =>
    state.merge({
        loading: false,
        error,
    })
/**
 * reducers action request
 * @param {*} state
 */
const getFilterDeclarationsEnAttenteDeValidationRequest = state =>
    state.merge({ loading: true, error: null })

/**
 * render redux reducer actions
 */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_FILTER_DECLARATIONS_EN_ATTENTE_DE_VALIDATION_REQUEST]: getFilterDeclarationsEnAttenteDeValidationRequest,
    [Types.GET_FILTER_DECLARATIONS_EN_ATTENTE_DE_VALIDATION_SUCCESS]: getFilterDeclarationsEnAttenteDeValidationSuccess,
    [Types.GET_FILTER_DECLARATIONS_EN_ATTENTE_DE_VALIDATION_FAILURE]: getFilterDeclarationsEnAttenteDeValidationFailure,
})
