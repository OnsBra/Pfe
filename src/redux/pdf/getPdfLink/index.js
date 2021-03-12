import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
/* ------------- Types and Action Creators ------------- */
/**
 * Inialisation des 3 actions
 */

const { Types, Creators } = createActions({
    getPdfLinkRequest: ['response'],
    getPdfLinkSuccess: ['response', 'loading'],
    getPdfLinkFailure: ['error'],
})

export const getPdfLinkTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    response: null,
    error: null,
    loading: null,
})

/* ------------- Reducers ------------- */
/**
 * reducers action sucess
 *
 * @param {*} state
 */

const getPdfLinkSuccess = (state, { response }) =>
    state.merge({
        error: false,
        response,
        loading: false,
    })
/**
 * reducers action failure
 *
 * @param {*} state
 * @param {*} { error }
 * @returns
 */
const getPdfLinkFailure = (state, { error }) =>
    state.merge({
        loading: false,
        error,
    })
/**
 * reducers action request
 *
 * @param {*} state
 */
const getPdfLinkRequest = state => state.merge({ loading: true, error: null })

/**
 * render redux reducer actions
 */
export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_PDF_LINK_REQUEST]: getPdfLinkRequest,
    [Types.GET_PDF_LINK_SUCCESS]: getPdfLinkSuccess,
    [Types.GET_PDF_LINK_FAILURE]: getPdfLinkFailure,
})
