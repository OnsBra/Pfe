import { combineReducers } from 'redux'
import { reducer as getPartSocials } from './getPartSocials'
import { reducer as addPartSocials } from './addPartSocials'
import { reducer as updatePartSocials } from './updatePartSocials'

/*
 * render all redux reducers actions
 */
export default combineReducers({
    getPartSocials,
    addPartSocials,
    updatePartSocials,
})
