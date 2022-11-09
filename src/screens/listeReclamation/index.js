/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable import/order */
/* eslint-disable react/destructuring-assignment */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import MaterialTable from 'material-table'
import { injectIntl } from 'react-intl'
import SendIcon from '@material-ui/icons/Send'
import {
    Grid,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Input,
    TextField,
} from '@material-ui/core'
import getAllReclamations from '../../redux/reclamation/getReclamation'
import updateReclamations from '../../redux/reclamation/updateReclamation'
import generateKey from '../../shared/utility'
// import TableCollapse from '../../components/tableWithCollapse'
import PageTitle from '../../components/ui/pageTitle'

const status = ['Reçue', 'En cours', 'Refusée', 'Acceptée']

const Index = props => {
    const {
        userID,
        reclamations,
        getAllReclamation,
        role,
        updateReclamation,
    } = props

    const [reclamationStatus, setReclamationStatus] = useState({})
    const [allList, setAllList] = useState(0);

    useEffect(() => {
        getAllReclamation({ user: userID, role })
    }, [])

    useEffect(() => {
        if (reclamations !== null) setAllList(reclamations.length)
    }, [reclamations])

    // Set livraison on state

    return (
        <div className="column col-md-12 style-table">
            {/* <Grid className="gridItem">
                <PageTitle label="Traitement des réclamations" />
            </Grid> */}
            <Divider />
            <MaterialTable
                title={<PageTitle label="Traitement des réclamations" />}
                columns={[
                    { title: 'Code réclamation', field: 'id' },
                    { title: 'Client', field: 'client.codeInsc' },
                    { title: 'Date livraison', field: 'dateLivraison' },
                    { title: 'Code livraison', field: 'codeLivraison' },
                    { title: 'Code Produit', field: 'codeArticle' },
                    { title: 'Qte', field: 'quantite' },
                    { title: 'Nature', field: 'nature' },
                    { title: 'Gravité', field: 'gravite' },
                    {
                        title: 'Statut',
                        field: 'status',
                        render: rowData => (
                            <div style={{ width: 300 }}>
                                <FormControl className="w-100">
                                    {rowData.status ? (
                                        <InputLabel id="select-gravite">
                                            {rowData.status}
                                        </InputLabel>
                                    ) : (
                                        <InputLabel id="select-gravite">
                                            Statut
                                        </InputLabel>
                                    )}

                                    <Select
                                        className="border"
                                        id="demo-mutiple-name"
                                        labelId="select-gravite"
                                        value={
                                            (
                                                (reclamationStatus || {})[
                                                rowData.id
                                                ] || {}
                                            ).status
                                        }
                                        onChange={e =>
                                            setReclamationStatus({
                                                ...reclamationStatus,
                                                [rowData.id]: {
                                                    ...(reclamationStatus[
                                                        rowData.id
                                                    ] || {}),
                                                    status: e.target.value,
                                                },
                                            })
                                        }
                                        input={<Input />}
                                        disabled={
                                            rowData.status === 'Acceptée' ||
                                                rowData.status === 'Refusée'
                                                ? true
                                                : null
                                        }
                                    >
                                        {status.map(element => (
                                            <MenuItem
                                                key={element}
                                                value={element}
                                            >
                                                {element}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {((reclamationStatus || {})[rowData.id] || {})
                                    .status === 'Refusée' && (
                                        <TextField
                                            type="text"
                                            className="mt-2 w-100"
                                            key={generateKey()}
                                            label="Motif"
                                            id="outlined-size-small"
                                            defaultValue={
                                                (
                                                    (reclamationStatus || {})[
                                                    rowData.id
                                                    ] || {}
                                                ).motif
                                            }
                                            variant="outlined"
                                            onBlur={e =>
                                                setReclamationStatus({
                                                    ...reclamationStatus,
                                                    [rowData.id]: {
                                                        ...(reclamationStatus[
                                                            rowData.id
                                                        ] || {}),
                                                        motif: e.target.value,
                                                    },
                                                })
                                            }
                                            size="small"
                                        />
                                    )}
                                {((reclamationStatus || {})[rowData.id] || {})
                                    .status === 'Acceptée' && (
                                        <TextField
                                            type="text"
                                            className="mt-2 w-100"
                                            key={generateKey()}
                                            label="Action"
                                            id="outlined-size-small"
                                            defaultValue={
                                                (
                                                    (reclamationStatus || {})[
                                                    rowData.id
                                                    ] || {}
                                                ).action
                                            }
                                            variant="outlined"
                                            onBlur={e =>
                                                setReclamationStatus({
                                                    ...reclamationStatus,
                                                    [rowData.id]: {
                                                        ...(reclamationStatus[
                                                            rowData.id
                                                        ] || {}),
                                                        action: e.target.value,
                                                    },
                                                })
                                            }
                                            size="small"
                                        />
                                    )}
                            </div>
                        ),
                    },
                    {
                        title: 'Validation',
                        field: 'validation',
                        render: rowData => {
                            console.log(rowData.status)
                            return (
                                <div>
                                    {rowData.status === 'Acceptée' ||
                                        rowData.status === 'Refusée' ? (
                                        <span> </span>
                                    ) : (
                                        <IconButton
                                            onClick={() => {
                                                const payload =
                                                    reclamationStatus[
                                                    rowData.id
                                                    ]
                                                updateReclamation({
                                                    reclamation: rowData.id,
                                                    ...payload,
                                                })
                                            }}
                                            color="primary"
                                            aria-label="Changer status"
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    )}
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
                data={JSON.parse(JSON.stringify(reclamations)) || []}
                options={{
                    headerStyle: {
                        backgroundColor: '#c20d20',
                        color: 'white',
                        fontSize: 20,
                    },
                    pageSizeOptions: [
                        5,
                        10,
                        20,
                        { value: allList, label: 'Afficher Tous' },
                    ],
                }}
            />
        </div>
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
    updateReclamation: payload =>
        dispatch(updateReclamations.updateReclamationRequest(payload)),
    getAllReclamation: payload =>
        dispatch(getAllReclamations.getReclamationRequest(payload)),
})

// obtenir les données from  store state
/**
 *
 *
 * @param {*} state
 * @returns
 */
const mapStateToProps = ({ info, login, reclamation }) => ({
    userID: login.response.User.details.codeInsc,
    reclamations: reclamation.getReclamation.response,
    role: login.response.User.details.userRoles[0].role,
    lng: info.language,
})

/* Proptypes */
/**
 *  declaration des props
 */
Index.propTypes = {
    role: PropTypes.string.isRequired,
    userID: PropTypes.object.isRequired,
    reclamations: PropTypes.array.isRequired,
    getAllReclamation: PropTypes.func.isRequired,
    updateReclamation: PropTypes.func.isRequired,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(Index))
