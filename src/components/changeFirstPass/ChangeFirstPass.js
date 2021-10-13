import React, { useState } from 'react'
import axios from 'axios'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import baseUrl from '../../serveur/baseUrl'
import '../../assets/sass/style.scss'

const FirstPassChange = () => {
    const [password, setPassword] = useState('')
    const [disabled, setDisabled] = useState(true)
    const ButtonStyle = {
        marginTop: '35px',
    }
    const ReinitPassword = {
        border: "1px solid #e0e0e0",
        padding: "20px" 
    }
    const checkInput = e => {
        setPassword(e.target.value)
        if (e.target.value.length >= 8) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }

    const changePassword = async e => {
        e.preventDefault()
        try {
            const response = await axios.put(
                `${baseUrl}users/change_password`,
                {
                    password,
                    mailer_user: localStorage.email,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.OpaliaToken}`,
                    },
                }
            )

            if (response.data.status === 'sucess') {
                localStorage.clear()
                window.location.reload(true)
            }
        } catch (err) {
            console.log(err.message)
        }
    }
    return (
        <div className="Card blc_reinit_password">
            <form>
                <TextField
                    value={password}
                    type="password"
                    onChange={e => checkInput(e)}
                    fullWidth
                    required
                    label="Nouveau mot de passe"
                    style= {ReinitPassword}
                />
                <Button
                    disabled={disabled}
                    onClick={e => changePassword(e)}
                    style={ButtonStyle}
                    fullWidth
                    variant="contained"
                    color="primary"
                >
                    Mettre à jour
                </Button>
            </form>
        </div>
    )
}

export default FirstPassChange
