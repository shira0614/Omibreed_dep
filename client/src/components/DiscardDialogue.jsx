import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { postApi } from "../utils/apiEndpoints.js";
import {useContext, useState} from "react";
import { AnalysisContext } from "./context/AnalysisContetx.jsx";
import axios from "axios";


export default function DiscardDialogue({ isOpen, setOpen, id}) {
    const { analysisList, setAnalysisList } = useContext(AnalysisContext);

    const handleSubmit = (event) => {
        event.preventDefault();
        const body = {
            analysisId: id,
            status: 'shipped'
        };
        postApi('analysis/acceptAnalysis', body).then((data) => {
            if(data.success) {
                    let updatedList = analysisList.map((analysis) => {
                        if(analysis._id === id) {
                            return {...analysis, status: 'shipped'};
                        }
                        return analysis;
                    });
                    setAnalysisList(updatedList);
                    handleClose();
                }
            }).catch((e) => {
            console.log(e);
            handleClose();
        })
    }


    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
        >
            <DialogTitle >
                {"Ritiro accettazione dell'analisi"}
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Procedendo, l&apos;analisi verrà ritirata e sarà possibile visualizzarla nuovamente nella sezione Richieste.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' color='forest' onClick={handleSubmit} sx={{ mr: 1 }} autoFocus>
                    Ritira
                </Button>
                <Button onClick={handleClose} sx={{ color: '#0c0e0b' }}>Annulla</Button>
            </DialogActions>
        </Dialog>
    );
}