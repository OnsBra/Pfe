/* eslint-disable no-template-curly-in-string */
/* eslint-disable no-unused-vars */
/* eslint-disable operator-assignment */
/* eslint-disable no-return-assign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */

import React, { useState, useEffect, Fragment } from 'react'
import axios from 'axios'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import html2canvas from 'html2canvas'
import { Button } from '@material-ui/core'
// Import Swiper React components
import SwiperCore, { Navigation, Autoplay, Thumbs, FreeMode } from 'swiper'
// import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react'
import Paper from '@material-ui/core/Paper'
import baseUrl from '../../serveur/baseUrl'
// Import Swiper styles
import 'swiper/swiper.scss'
import 'swiper/swiper.min.css'
import 'swiper/modules/free-mode/free-mode.min.css'
import 'swiper/modules/navigation/navigation.min.css'
import 'swiper/modules/thumbs/thumbs.min.css'
// import 'swiper/components/navigation/navigation.scss'
import SelectList from '../../components/ui/select'
import unknown from '../../assets/images/unknown.jpg'
import { Get } from '../../serveur/axios'

SwiperCore.use([Navigation, Autoplay, Thumbs, FreeMode])

const apiConsumer = [
    { endPoint: `dashbord/list/kpi/`, name: 'total' },
    // { endPoint: `dashbord/list/top5/`, name: 'top5' },
    {
        endPoint: `dashbord/list/montant-ttc-mois/`,
        name: 'montant',
    },
    // {
    //     endPoint: `dashbord/list/delai-reception/`,
    //     name: 'delai',
    // },
    {
        endPoint: `reclamation/getDashboard/`,
        name: 'reclamation',
    },
]
const { OpaliaToken } = window.localStorage

const consumeAPI = (endPoint, setState, state, name, codeInsc) => {
    axios({
        method: 'post',
        url: `${baseUrl}${endPoint}${codeInsc}`,
        headers: {
            'Accept-Version': 1,
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json; charset=utf-8',
            Authorization: `Bearer ${OpaliaToken}`,
        },
        timeout: 30000,
    })
        .then(res => {
            setState(old => ({ ...old, [name]: res.data }))
        })
        .catch(e => console.error(e))
}

const index = () => {
    const [state, setState] = useState({ total: {} })
    const [value, setValue] = useState(null)
    const [list, setList] = useState([])
    const [nameGrossite, setNameGrossiste] = useState('')
    const [thumbsSwiper, setThumbsSwiper] = useState(null)
    const [allPhotos, setAllPhotos] = useState([])

    useEffect(() => {
        Get('animatedPictures/all').then(res => {
            if (res.status === 200 || res.status === 200) {
                setAllPhotos(res.data)
            }
        })
        if (localStorage.role !== 'ROLE_MANAGER')
            apiConsumer.forEach(el =>
                consumeAPI(
                    el.endPoint,
                    setState,
                    state,
                    el.name,
                    localStorage.codeInsc
                )
            )
        else
            axios({
                method: 'post',
                url: `${baseUrl}users/all`,
                headers: {
                    'Accept-Version': 1,
                    Accept: 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `Bearer ${OpaliaToken}`,
                },
                timeout: 30000,
                data: { role: 2 },
            }).then(res => {
                const listUser = []
                res.data.data.map(e => {
                    return listUser.push({
                        label: e.codeInsc,
                        value: e.id,
                        codeInsc: e.codeInsc,
                    })
                })
                setList(listUser)
            })
    }, [])

    // graph reclamation
    const reclamationTraite =
        state.reclamation !== undefined &&
        (state.reclamation || {}).reclamationTraite.map(element =>
            Number(element)
        )
    const reclamationTotal =
        state.reclamation !== undefined &&
        (state.reclamation || {}).reclamationTotal.map(element =>
            Number(element)
        )
    // graph TTC
    const TTC = state.montant !== undefined && state.montant
    const Mois1 = Array(12)
    const Mois2 = Array(12)
    const Mois3 = Array(12)
    const newDate = new Date()
    const date = newDate.getFullYear()

    if (TTC && TTC[date - 1]) {
        TTC[date - 1].map(element => (Mois1[element[0] - 1] = element[1]))
    }

    for (let i = 0; i < Mois1.length; i++) {
        if (Mois1[i] == null) {
            Mois1[i] = 0
        }
    }

    if (TTC && TTC[date]) {
        TTC[date].map(element => (Mois2[element[0] - 1] = element[1]))
    }

    for (let i = 0; i < Mois2.length; i++) {
        if (Mois2[i] == null) {
            Mois2[i] = 0
        }
    }

    if (TTC && TTC[date]) {
        if (!TTC[date - 2]) TTC[date - 1].map(element => (Mois3[element[0] - 1] = element[1]))
        else TTC[date - 2].map(element => (Mois3[element[0] - 1] = element[1]))
    }

    for (let i = 0; i < Mois3.length; i++) {
        if (Mois3[i] == null) {
            Mois3[i] = 0
        }
    }

    const onSelect = e => {
        setValue(e.target.value)
        const user = list.filter(element => element.value === e.target.value)
        setNameGrossiste(`${user && user[0].label}`)
        apiConsumer.forEach(el =>
            consumeAPI(
                el.endPoint,
                setState,
                state,
                el.name,
                user && user[0].codeInsc
            )
        )
    }

    const downloadImage = (blob, fileName) => {
        const fakeLink = window.document.createElement('a')
        fakeLink.style = 'display:none;'
        fakeLink.download = fileName

        fakeLink.href = blob

        document.body.appendChild(fakeLink)
        fakeLink.click()
        document.body.removeChild(fakeLink)

        fakeLink.remove()
    }

    const onGeneratePdf = () => { // eslint-disable-next-line
        html2canvas(document.querySelector('#chart')).then(function (canvas) {
            const image = canvas.toDataURL('image/png', 1.0)
            downloadImage(image, nameGrossite)
        })
    }

    const safeImage = (url, path) => {
        try {
            return `${baseUrl}${path}${url}`
        } catch {
            return unknown
        }
    }

    return (
        <Fragment>
            <Swiper
                style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                }}
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs]}
                slidesPerView={1}
                autoplay={{
                    delay: 2000,
                }}
                navigation
                onSlideChange={() => console.log('slide change')}
                onSwiper={swiper => console.log(swiper)}
                className="slider_dash"
            >
                {allPhotos.map(element => (
                    <SwiperSlide>
                        <img
                            src={element.base64}
                            alt="slider"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode
                watchSlidesProgress
                modules={[FreeMode, Navigation, Thumbs]}
                className="mySwiper"
            >
                {allPhotos.map(element => (
                    <SwiperSlide>
                        <img
                            src={element.base64}
                            alt="slider"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
            <div className="blc-cnt-dash">
                {localStorage.role === 'ROLE_MANAGER' && (
                    <div className="row">
                        <div className="col-md-3 col-sm-6">
                            <SelectList
                                onchange={e => {
                                    onSelect(e)
                                }}
                                name="select"
                                label="Selectionner grossiste"
                                list={list}
                                selectedItem={value}
                            />
                        </div>
                    </div>
                )}
                <br />

                <div className="row">
                    {localStorage.role !== 'ROLE_MANAGER' && (
                        <>
                            <div className="col-md-3 col-sm-6">
                                <div className="box-top-dash">
                                    <Paper className="p-3">
                                        <center>
                                            <b>Commandes totales</b>
                                            <span className="font-weight-bold d-block">
                                                {state.total.Nombre_commandes}
                                            </span>{' '}
                                        </center>
                                    </Paper>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <div className="box-top-dash">
                                    <Paper className="p-3">
                                        <center>
                                            <b>Commandes livrées</b>
                                            <span className="font-weight-bold d-block">
                                                {
                                                    state.total
                                                        .Nombre_commandes_livrees
                                                }
                                            </span>{' '}
                                        </center>
                                    </Paper>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <div className="box-top-dash">
                                    <Paper className="p-3">
                                        <center>
                                            <b>
                                                Montant total des factures(TTC)
                                            </b>
                                            <span className="font-weight-bold d-block">
                                                {
                                                    state.total
                                                        .Montant_facture_annee_en_cours
                                                }
                                            </span>{' '}
                                        </center>
                                    </Paper>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-6">
                                <div className="box-top-dash">
                                    <Paper className="p-3">
                                        <center>
                                            <b>Montant à régler (TTC)</b>
                                            <span className="font-weight-bold d-block">
                                                {state.total.Montant_a_regler}
                                            </span>{' '}
                                        </center>
                                    </Paper>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <br />
                <div className="row" id="chart">
                    {nameGrossite !== '' && (
                        <div
                            className="col-md-12"
                            style={{ textAlign: 'center', fontSize: '50px' }}
                        >
                            <b>Client : {nameGrossite}</b>
                        </div>
                    )}
                    <div className="col-md-6 p-3">
                        <div className="box-charts">
                            <HighchartsReact
                                highcharts={Highcharts || {}}
                                options={{
                                    chart: {
                                        type: 'spline',
                                    },
                                    title: {
                                        text: 'CA par mois TTC TND',
                                    },
                                    xAxis: {
                                        categories: [
                                            'janvier',
                                            'février',
                                            'mars',
                                            'avril',
                                            'mai',
                                            'juin',
                                            'juillet',
                                            'aout',
                                            'septembre',
                                            'octobre',
                                            'novembre',
                                            'decembre',
                                        ],
                                        crosshair: true,
                                    },
                                    yAxis: {
                                        min: 0,
                                        title: {
                                            text: '(TTC)',
                                        },
                                    },
                                    tooltip: {
                                        headerFormat:
                                            '<span style="font-size:10px">{point.key}</span><table>',
                                        pointFormat:
                                            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                                            '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
                                        footerFormat: '</table>',
                                        shared: true,
                                        useHTML: true,
                                    },
                                    plotOptions: {
                                        column: {
                                            pointPadding: 0.2,
                                            borderWidth: 0,
                                        },
                                    },
                                    series: [
                                        {
                                            name: date - 2,
                                            data: Mois3,
                                        },
                                        {
                                            name: date - 1,
                                            data: Mois1,
                                        },
                                        {
                                            name: date,
                                            data: Mois2,
                                        },
                                    ],
                                }}
                            />
                        </div>
                    </div>
                    <div className="col-md-6  p-3">
                        <div className="box-charts">
                            <HighchartsReact
                                highcharts={Highcharts || {}}
                                options={{
                                    chart: {
                                        type: 'column',
                                    },
                                    title: {
                                        text: 'Réclamations',
                                    },
                                    legend: {
                                        align: 'right',
                                        verticalAlign: 'middle',
                                        layout: 'vertical',
                                    },
                                    xAxis: {
                                        categories: (state.reclamation || {})
                                            .categories,
                                        labels: {
                                            x: -10,
                                        },
                                    },
                                    yAxis: {
                                        allowDecimals: false,
                                        title: {
                                            text: '',
                                        },
                                    },

                                    series: [
                                        {
                                            name: 'Réclamations traités',
                                            data: reclamationTraite,
                                        },
                                        {
                                            name: 'Total réclamations',
                                            data: reclamationTotal,
                                        },
                                    ],
                                    responsive: {
                                        rules: [
                                            {
                                                condition: {
                                                    maxWidth: 500,
                                                },
                                                chartOptions: {
                                                    legend: {
                                                        align: 'center',
                                                        verticalAlign: 'bottom',
                                                        layout: 'horizontal',
                                                    },
                                                    yAxis: {
                                                        labels: {
                                                            align: 'left',
                                                            x: 0,
                                                            y: -5,
                                                        },
                                                        title: {
                                                            text: null,
                                                        },
                                                    },
                                                    subtitle: {
                                                        text: null,
                                                    },
                                                    credits: {
                                                        enabled: false,
                                                    },
                                                },
                                            },
                                        ],
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>
                {localStorage.role === 'ROLE_MANAGER' && (
                    <div className="row">
                        <div
                            className="m-3 text-left"
                            style={{ float: 'left', paddingTop: '10px' }}
                        >
                            <Button
                                className="btn-submit-cmd"
                                onClick={onGeneratePdf}
                            >
                                Export
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Fragment>
    )
}

export default index
