/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable radix */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable prefer-destructuring */
/* eslint-disable  no-return-assign */
/* eslint-disable no-unreachable */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable no-shadow */
/* eslint-disable react/button-has-type */

import React, { useEffect, useState, Fragment } from 'react'
import MaterialTable from 'material-table'
import { connect } from 'react-redux'
import PropTypes, { number } from 'prop-types'
import { injectIntl } from 'react-intl'
import { makeStyles } from '@material-ui/styles'
import { Divider, TextField, Button } from '@material-ui/core'
import SwiperCore, { Navigation, Autoplay } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import alertActions from '../../redux/alert'
import getAllProductActions from '../../redux/commande/getAllProduct'
import addNewCommandeActions from '../../redux/commande/newCommande'
import uploadCommandeActions from '../../redux/commande/uploadCommande'
import PageTitle from '../../components/ui/pageTitle'
import generateKey from '../../shared/utility'
import unknown from '../../assets/images/unknown.jpg'
import baseUrl from '../../serveur/baseUrl'
import SliderDash2 from '../../assets/images/banner-dash1.gif'
import SliderDash1 from '../../assets/images/banner-dash2.gif'
import SliderDash3 from '../../assets/images/banner-dash3.gif'
import SliderDash4 from '../../assets/images/banner-dash4.gif'
import 'swiper/swiper.scss'
import 'swiper/components/navigation/navigation.scss'
import Actualite from '../pageCms/actualite/actualiteVertical'

SwiperCore.use([Navigation, Autoplay])

const useStyles = makeStyles(theme => ({
    txt: {
        display: 'flex',
        marginLeft: '90%',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#000',
    },
}))
// destrict
const Index = props => {
    const {
        products,
        getAllProduct,
        userID,
        addCommande,
        uploadCommande,
        history,
        newCommande,
        uploadNewCommande,
        alertShow,
    } = props
    const [ColorBorder, setColorBorder] = useState('green')
    const [QteVrac, setQteVrac] = useState([])
    const [QteCarton, setQteCarton] = useState([])
    const classes = useStyles()

    const checkQteVrac = e => {
        const value = e.target.value
        if (value >= 0) {
            setColorBorder('green')
        } else {
            setColorBorder('red')
        }

        // setQteVrac(e.target.value)
    }
    const checkQteCarton = e => {
        const value = e.target.value
        if (value >= 0) {
            setColorBorder('green')
        } else {
            setColorBorder('red')
        }

        // setQteVrac(e.target.value)
    }
    const [allProduct, setAllProduct] = useState([])
    const [commande, setCommande] = useState({})
    const [file] = useState(null)

    // 1 seul fois
    useEffect(() => {
        getAllProduct()
    }, [])

    //  exceution mors de changement du parametre
    // exp [newCommande.loading, uploadNewCommande.loading]

    useEffect(() => {
        if (newCommande.loading === true || uploadNewCommande.loading === true)
            setTimeout(() => history.push('/validation-commande'), 1000)
    }, [newCommande.loading, uploadNewCommande.loading])

    useEffect(() => {
        setAllProduct(JSON.parse(JSON.stringify(products)))
    }, [products])

    let all
    if (allProduct !== null) {
        all = allProduct.length
        console.log('all', allProduct.length)
    }

    const safeRequire = (url, path, ext = null) => {
        try {
            return `${baseUrl}${path}${url}${ext}`
        } catch {
            return unknown
        }
    }
    let getTotalQt = 8

    getTotalQt = rowData =>
        parseInt((commande[rowData.codeArticleX3] || {}).qtc || 0) *
        parseInt(rowData.coefUcUs || 0) +
        parseInt((commande[rowData.codeArticleX3] || {}).qtv || 0)
    const getTotalPrix = rowData =>
        Math.round(getTotalQt(rowData) * rowData.prix * 1000) / 1000

    // function InnerHTMlFn(totalprix) {
    //     document.getElementById('demo').innerHTML = totalprix
    // }
    // let totalprix = null
    // const getTotalPrix2 = rowData => {
    //     totalprix += getTotalPrix(rowData)
    //     InnerHTMlFn(totalprix)
    //     return totalprix
    // }
    const handleSubmit = () => {
        if (!file) {
            const payload = Object.entries(commande).map(elem => ({
                Code_PCT: elem[1].Code_PCT,
                Code_article: elem[0],
                Designation: elem[1].Designation,
                QTY: getTotalQt(
                    allProduct.find(el => el.codeArticleX3 === elem[0])
                ),
                prix: elem[1].prix,
            }))
            if (payload.length !== 0) {
                addCommande({
                    produits: payload,
                    user: userID,
                    source: 'creation',
                })
            } else {
                alertShow(true, {
                    warning: false,
                    info: false,
                    error: true,
                    success: false,
                    message: 'Votre commande est vide',
                })
            }
        } else {
            const formData = new FormData()

            // Update the formData object
            formData.append('file', file, file.name)
            formData.append('user', userID)
            uploadCommande(formData)
        }
    }

    return (
        <Fragment>
            <Swiper
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{
                    delay: 7000,
                }}
                navigation
                onSlideChange={() => console.log('slide change')}
                onSwiper={swiper => console.log(swiper)}
                className="slider_dash"
            >
                <SwiperSlide>
                    <img src={SliderDash1} alt="slider" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={SliderDash2} alt="slider" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={SliderDash3} alt="slider" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={SliderDash4} alt="slider" />
                </SwiperSlide>
            </Swiper>
            <div className='row'>
                <div className="col-md-10 style-table">
                    <Divider />

                    <MaterialTable
                        options={{
                            headerStyle: { fontSize: 20 },
                            pageSize: 5,
                            pageSizeOptions: [
                                5,
                                10,
                                20,
                                { value: all, label: 'Afficher Tous' },
                            ],
                        }}
                        title={<PageTitle label="Créer une commande" />}
                        columns={[
                            {
                                title: 'Image',
                                field: 'codeArticleX3',
                                cellStyle: {
                                    width: '10%',
                                    textAlign: 'center',
                                },
                                render: rowData => (
                                    <img
                                        key={generateKey()}
                                        src={safeRequire(
                                            rowData.codeArticleX3,
                                            '../produits/',
                                            '.png'
                                        )}
                                        style={{ width: 150, borderRadius: '2%' }}
                                        alt="produit"
                                    />
                                ),
                            },
                            {
                                title: 'Code Article',
                                field: 'codeArticleX3',
                                cellStyle: {
                                    width: '8%',
                                    textAlign: 'center',
                                },
                            },
                            {
                                title: 'Code PCT',
                                field: 'codePct',
                                cellStyle: {
                                    width: '8%',
                                },
                            },
                            {
                                title: 'Désignation',
                                field: 'designation1',
                                cellStyle: {
                                    width: '16%',
                                    textAlign: 'center',
                                },
                            },

                            {
                                title: 'Prix',
                                field: 'prix',
                                cellStyle: {
                                    textAlign: 'center',
                                },
                            },
                            {
                                title: 'Colisage',
                                field: 'coefUcUs',
                                cellStyle: {
                                    textAlign: 'center',
                                },
                            },
                            {
                                title: 'Qté en cartons',
                                field: 'qtc',
                                cellStyle: {
                                    textAlign: 'center',
                                },
                                render: rowData => (
                                    <div style={{ width: 80 }}>
                                        <TextField
                                            onChange={e => checkQteCarton(e)}
                                            inputProps={{ min: 0 }}
                                            disabled={!rowData.actif}
                                            type="number"
                                            key={generateKey()}
                                            label="Quantité"
                                            id="outlined-size-small"
                                            defaultValue={
                                                (commande[rowData.codeArticleX3] || {})
                                                    .qtc || 0
                                            }
                                            variant="outlined"
                                            onBlur={e =>
                                                setCommande({
                                                    ...commande,
                                                    [rowData.codeArticleX3]: {
                                                        ...(commande[
                                                            rowData.codeArticleX3
                                                        ] || {}),
                                                        qtc: e.target.value,
                                                        Code_PCT: rowData.codePct,
                                                        Designation:
                                                            rowData.designation1,
                                                        prix: rowData.prix,
                                                    },
                                                })
                                            }
                                            size="small"
                                        />
                                    </div>
                                ),
                            },
                            {
                                title: 'Qté vrac',
                                field: 'qtv',
                                cellStyle: {
                                    textAlign: 'center',
                                },
                                render: rowData => (
                                    <div style={{ width: 80 }}>
                                        <TextField
                                            onChange={e => checkQteVrac(e)}
                                            // value={QteVrac}
                                            inputProps={{ min: 0 }}
                                            type="number"
                                            key={generateKey()}
                                            label="Quantité"
                                            id="outlined-size-small"
                                            defaultValue={
                                                (commande[rowData.codeArticleX3] || {})
                                                    .qtv || 0
                                            }
                                            variant="outlined"
                                            size="small"
                                            style={{
                                                border: '2px solid'.ColorBorder,
                                                height: 'calc(0.5em + 1.5rem + 2px)',
                                            }}
                                            onBlur={e =>
                                                setCommande({
                                                    ...commande,
                                                    [rowData.codeArticleX3]: {
                                                        ...(commande[
                                                            rowData.codeArticleX3
                                                        ] || {}),
                                                        qtv: e.target.value,
                                                        Code_PCT: rowData.codePct,
                                                        Designation:
                                                            rowData.designation1,
                                                        prix: rowData.prix,
                                                    },
                                                })
                                            }
                                            disabled={rowData.ucObligatoire === 2}
                                        />
                                    </div>
                                ),
                            },
                            {
                                title: 'Qté totale',
                                field: 'qtt',
                                cellStyle: {
                                    width: '7%',
                                    textAlign: 'center',
                                },
                                render: rowData => {
                                    return (
                                        <div key={generateKey()} style={{ width: 80 }}>
                                            <p>{getTotalQt(rowData)}</p>
                                        </div>
                                    )
                                },
                            },
                            {
                                title: 'Prix total',
                                field: 'pt',
                                cellStyle: {
                                    width: '7%',
                                    textAlign: 'center',
                                },
                                render: rowData => {
                                    return (
                                        <div
                                            key={generateKey()}
                                            style={{ width: 80 }}
                                        // handleChnage={getTotalPrix2(rowData)}
                                        >
                                            <p>{getTotalPrix(rowData)}</p>
                                        </div>
                                    )
                                },
                            },
                        ]}
                        localization={{
                            pagination: {
                                labelDisplayedRows: '{from}-{to} de {count}',
                                labelRowsSelect: 'lignes par page',
                                labelRowsPerPage: 'lignes par page:',
                                firstAriaLabel: 'Première page',
                                firstTooltip: 'Première page',
                                previousAriaLabel: 'Page précédente',
                                previousTooltip: 'Page précédente',
                                nextAriaLabel: 'Page suivante',
                                nextTooltip: 'Page suivante',
                                lastAriaLabel: 'Dernière page',
                                lastTooltip: 'Dernière page',
                            },
                            toolbar: {
                                searchPlaceholder: 'Rechercher',
                            },
                        }}
                        data={allProduct || []}
                    />
                    <div
                        className="m-3 text-left"
                        style={{ float: 'left', paddingTop: '10px' }}
                    >
                        <a
                            className="mr-2"
                            href={safeRequire('ExempleCsv', '../', '.csv')}
                        >
                            <b>Exemple de fichier à importer</b>
                        </a>
                        &nbsp;&nbsp;|&nbsp;&nbsp;
                        <a
                            className="mr-2"
                            href="declaration_rattacher_saisie/rattacher_le_scan_de_la_declaration/50"
                        >
                            <b>Import d&#39;une commande</b>
                        </a>
                    </div>
                    <div className="m-3 text-right" style={{ paddingBottom: '20px' }}>
                        {/* <div className={classes.txt}>
                    Prix total : <p id="demo"></p>
                </div> */}

                        <Button className="btn-submit-cmd" onClick={handleSubmit}>
                            Enregistrer la commande
                        </Button>
                    </div>
                </div>
                <div className="col-md-2">
                    <Actualite />
                </div>
            </div>
        </Fragment>
    )
}

/* redux */

// dispatch action

/**
 *
 *
 * @param {*} dispatch
 */
const mapDispatchToProps = dispatch => ({
    getAllProduct: () => dispatch(getAllProductActions.getAllProductRequest()),
    addCommande: payload =>
        dispatch(addNewCommandeActions.addNewCommandeRequest(payload)),
    uploadCommande: payload =>
        dispatch(uploadCommandeActions.uploadCommandeRequest(payload)),
    alertShow: (show, info) =>
        dispatch(
            alertActions.alertShow(show, {
                onConfirm: info.onConfirm,
                warning: info.warning,
                info: info.info,
                error: info.error,
                success: info.success,
                message: info.message,
                title: info.title,
            })
        ),
})

// obtenir les données from  store state
/**
 *
 *
 * @param {*} state
 * @returns
 */
const mapStateToProps = ({ info, login, commande }) => ({
    userID: login.response.User.details.codeInsc,
    products: commande.getAllProduct.response,
    newCommande: commande.newCommande,
    uploadNewCommande: commande.uploadCommande,
    lng: info.language,
})

/* Proptypes */
/**
 *  declaration des props
 */
Index.propTypes = {
    userID: PropTypes.object.isRequired,
    products: PropTypes.array.isRequired,
    getAllProduct: PropTypes.func.isRequired,
    addCommande: PropTypes.func.isRequired,
    uploadCommande: PropTypes.func.isRequired,
    newCommande: PropTypes.any.isRequired,
    uploadNewCommande: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    alertShow: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Index))
