import getAllProductSaga from './getProducts'
import addNewCommandeSaga from './newCommande'
import getCommandeSaga from './getCommande'
import validerCommandeSaga from './validerCommande'
import uploadCommandeSaga from './uploadCommande'
import dupliquerCommandeSaga from './dupliquerCommande'
import exportPdfCommandeSaga from './exportPdf'
import editCommandeSaga from './editCommande'

/**
 * export all function saga (API)
 */
const commandeSagas = [
    getAllProductSaga,
    addNewCommandeSaga,
    getCommandeSaga,
    validerCommandeSaga,
    uploadCommandeSaga,
    dupliquerCommandeSaga,
    exportPdfCommandeSaga,
    editCommandeSaga,
]

export default commandeSagas
