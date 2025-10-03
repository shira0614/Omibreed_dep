import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import SuccessAlert from "./SuccessAlert.jsx";
import FailAlert from "./FailAlert.jsx";
import {useContext, useState} from "react";
import axios from "axios";
import {SingleTreeContext} from "./context/TreeContext.jsx";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AddReplicaDialogue({isOpen, setOpen, treeId}) {
    const {replicas, setReplicas} = useContext(SingleTreeContext)
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openFail, setOpenFail] = useState(false);
    // Nuovi stati per diagnostica e Xylella con fallback
    // Numerico: 0; Menu: prima voce; Stringa: ''.
    const today = React.useMemo(() => {
        const d = new Date();
        const off = d.getTimezoneOffset();
        const local = new Date(d.getTime() - off * 60000);
        return local.toISOString().slice(0, 10);
    }, []);
    const [bacterialTitreCq, setBacterialTitreCq] = useState(0);        // valori => 0
    const [diagnosticStatus, setDiagnosticStatus] = useState('H');       // menu => prima voce
    const [xylellaSubspecies, setXylellaSubspecies] = useState('pauca'); // menu => prima voce
    const [xylellaSequencingType, setXylellaSequencingType] = useState('NT'); // menu => prima voce
    const [references, setReferences] = useState('');                    // stringhe => ''

    const handleClose = () => {
        setOpen(false)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);

        data.set('treeId', treeId);

        // Normalizza numeri vuoti a "0"
        const ensureNumber = (name) => {
            const v = data.get(name);
            if (v === null || v === undefined || v === '') data.set(name, '0');
        };
        ensureNumber('plantAgeYears');
        ensureNumber('timeSinceInfectionYears');
        ensureNumber('timeSinceInfectionMonths');
        ensureNumber('timeSinceInfectionHours');
        ensureNumber('plantDiameterCm');

        // Cq con arrotondamento a 2 decimali; se non numero, fallback 0
        if (bacterialTitreCq !== '' && bacterialTitreCq !== null) {
            const n = Number.parseFloat(bacterialTitreCq);
            if (!Number.isNaN(n)) {
                data.set('bacterialTitreCq', (Math.round(n * 100) / 100).toString());
            } else {
                data.set('bacterialTitreCq', '0');
            }
        } else {
            data.set('bacterialTitreCq', '0');
        }

        // Stato diagnostico (menu con default alla prima voce)
        data.set('diagnosticStatus', diagnosticStatus);

        // Xylella subspecies e ST (menu con default prima voce)
        data.set('xylellaSubspecies', xylellaSubspecies || 'pauca');
        data.set('xylellaSequencingType', xylellaSequencingType || 'NT');

        // References (stringa => '')
        data.set('references', references ?? '');

        // Stringhe opzionali con default '' se mancanti
        if (!data.has('branch')) data.set('branch', '');
        if (!data.has('notes')) data.set('notes', '');

        // Validazione immagini (multiplo)
        const files = data.getAll('images');
        if (files && files.length) {
            const validTypes = ['image/png', 'image/jpeg'];
            for (const f of files) {
                if (f && f.size && !validTypes.includes(f.type)) {
                    alert("Scegliere immagini in formato .jpg o .png");
                    return;
                }
            }
        }

        axios.post(`${BASE_URL}/api/trees/newReplica`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            if(response.data.success) {
                // non mutare l'array esistente
                setReplicas([...(replicas || []), response.data.replica])
                setOpenSuccess(true)
                handleClose()
            }
        }).catch((e) => {
            console.log(e);
            setOpenFail(true)
        });
    }

    return (
        <>
            <FailAlert open={openFail} setOpen={setOpenFail} message={"Non è stato possibile aggiungere la replica correttamente. Riprovare"} />
            <SuccessAlert open={openSuccess} setOpen={setOpenSuccess} message={'Replica creata con successo'} />
            <Dialog
                open={isOpen}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                    encType: 'multipart/form-data'
                }}
            >
                <DialogTitle>Add a sample</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Samples are linked to a tree. Please fill in the form below to add a new sample for this tree.
                    </DialogContentText>

                    {/* Sampling date - default oggi */}
                    <TextField
                        margin="dense"
                        id="samplingDate"
                        name="samplingDate"
                        label="Sampling date"
                        type="date"
                        fullWidth
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                        defaultValue={today}
                        helperText="Formato: dd/mm/yyyy (select date from calendar)"
                    />

                    {/* Plant age at sampling - default 0 */}
                    <TextField
                        margin="dense"
                        id="plantAgeYears"
                        name="plantAgeYears"
                        label="Plant age at the time of sampling (years)"
                        type="number"
                        inputProps={{ step: 1, min: 0 }}
                        fullWidth
                        variant="standard"
                        defaultValue={0}
                    />

                    {/* Time elapsed since the infection - default 0 */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <TextField
                            id="timeSinceInfectionYears"
                            name="timeSinceInfectionYears"
                            label="Time since infection (years)"
                            type="number"
                            inputProps={{ step: 1, min: 0 }}
                            variant="standard"
                            defaultValue={0}
                        />
                        <TextField
                            id="timeSinceInfectionMonths"
                            name="timeSinceInfectionMonths"
                            label="Time since infection (months)"
                            type="number"
                            inputProps={{ step: 1, min: 0 }}
                            variant="standard"
                            defaultValue={0}
                        />
                        <TextField
                            id="timeSinceInfectionHours"
                            name="timeSinceInfectionHours"
                            label="Time since infection (hours)"
                            type="number"
                            inputProps={{ step: 1, min: 0 }}
                            variant="standard"
                            defaultValue={0}
                        />
                    </Box>

                    {/* Plant diameter (cm) - default 0 */}
                    <TextField
                        margin="dense"
                        id="plantDiameterCm"
                        name="plantDiameterCm"
                        label="Plant diameter (cm) at the time of sampling"
                        type="number"
                        inputProps={{ step: 1, min: 0 }}
                        fullWidth
                        variant="standard"
                        defaultValue={0}
                        helperText="Diameter of the plant 1 m above the ground, without decimal (e.g. 150)"
                    />

                    {/* Symptoms of shoot dieback - default prima voce (già impostato) */}
                    <TextField
                        margin="dense"
                        id="shootDiebackSymptoms"
                        name="shootDiebackSymptoms"
                        label="Symptoms of shoot dieback"
                        select
                        fullWidth
                        variant="standard"
                        defaultValue="No desiccation"
                    >
                        <MenuItem value="No desiccation">No desiccation</MenuItem>
                        <MenuItem value="Mild desiccation">Mild desiccation</MenuItem>
                        <MenuItem value="Severe desiccation">Severe desiccation</MenuItem>
                    </TextField>

                    {/* Sampled tissue/organ/product - default prima voce (già impostato) */}
                    <TextField
                        margin="dense"
                        id="sampledTissue"
                        name="sampledTissue"
                        label="Sampled tissue/organ/product"
                        select
                        fullWidth
                        variant="standard"
                        defaultValue="Leaf"
                    >
                        <MenuItem value="Leaf">Leaf</MenuItem>
                        <MenuItem value="Xylem">Xylem</MenuItem>
                        <MenuItem value="Cortex">Cortex</MenuItem>
                        <MenuItem value="Entire herbaceous stem">Entire herbaceous stem</MenuItem>
                        <MenuItem value="Entire lignified stem">Entire lignified stem</MenuItem>
                        <MenuItem value="Xylem sap">Xylem sap</MenuItem>
                        <MenuItem value="Canopy of ancient plant">Canopy of ancient plant</MenuItem>
                        <MenuItem value="Sucker of ancient plant">Sucker of ancient plant</MenuItem>
                    </TextField>

                    {/* Branch - default '' */}
                    <TextField
                        margin="dense"
                        id="branch"
                        name="branch"
                        label="Branch"
                        fullWidth
                        variant="standard"
                        defaultValue=""
                        helperText="Branch from which the sample is collected"
                    />

                    {/* Bacterial titre (Cq) controllato - default 0 e diagnosis menu default 'H' */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, flexWrap: 'wrap' }}>
                        <TextField
                            margin="dense"
                            id="bacterialTitreCq"
                            name="bacterialTitreCq-ui"
                            label="Bacterial titre (Cq)"
                            type="number"
                            inputProps={{ step: 0.01, min: 0 }}
                            value={bacterialTitreCq}
                            onChange={(e) => {
                                const v = e.target.value;
                                setBacterialTitreCq(v === '' ? 0 : v);
                                const n = Number.parseFloat(v);
                                if (v === '' || Number.isNaN(n)) return;
                                if (n > 33) setDiagnosticStatus('H');
                                else if (n < 33) setDiagnosticStatus('X');
                                else setDiagnosticStatus('NT');
                            }}
                            fullWidth
                            variant="standard"
                            helperText="Insert the Cq value (dwo decimals). Leave empty if not tested (NT)."
                        />
                        <TextField
                            margin="dense"
                            id="diagnosticStatus"
                            name="diagnosticStatus-ui"
                            label="Diagnosis of Xylella infection"
                            select
                            value={diagnosticStatus}
                            onChange={(e) => setDiagnosticStatus(e.target.value)}
                            fullWidth
                            variant="standard"
                        >
                            <MenuItem value="H">H (healthy, if Cq &gt; 33)</MenuItem>
                            <MenuItem value="X">X (Xf-infected, if Cq &lt; 33)</MenuItem>
                            <MenuItem value="NT">NT (qPCR diagnostic test not executed)</MenuItem>
                        </TextField>
                    </Box>

                    {/* Xylella subspecies (menu default prima voce) */}
                    <TextField
                        margin="dense"
                        id="xylellaSubspecies"
                        name="xylellaSubspecies-ui"
                        label="Xylella subspecies"
                        select
                        fullWidth
                        variant="standard"
                        value={xylellaSubspecies}
                        onChange={(e) => setXylellaSubspecies(e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="pauca">pauca</MenuItem>
                        <MenuItem value="fastidiosa">fastidiosa</MenuItem>
                        <MenuItem value="multiplex">multiplex</MenuItem>
                        <MenuItem value="NT">NT</MenuItem>
                    </TextField>

                    {/* Xylella Sequencing Type (ST) (menu default prima voce 'NT') */}
                    <TextField
                        margin="dense"
                        id="xylellaSequencingType"
                        name="xylellaSequencingType-ui"
                        label="Xylella Sequencing Type (ST)"
                        select
                        fullWidth
                        variant="standard"
                        value={xylellaSequencingType}
                        onChange={(e) => setXylellaSequencingType(e.target.value)}
                        sx={{ mt: 2 }}
                    >
                        <MenuItem value="NT">NT</MenuItem>
                        {Array.from({ length: 90 }, (_, i) => `ST${i + 1}`).map(st => (
                            <MenuItem key={st} value={st}>{st}</MenuItem>
                        ))}
                    </TextField>

                    {/* Reference(s) - default '' */}
                    <TextField
                        margin="dense"
                        id="references"
                        name="references-ui"
                        label="Reference(s)"
                        fullWidth
                        variant="standard"
                        value={references}
                        onChange={(e) => setReferences(e.target.value)}
                        helperText="Last and first name of the person(s) to contact for receiving more information about the sample"
                        sx={{ mt: 2 }}
                    />

                    {/* Notes - default '' */}
                    <TextField
                        margin="dense"
                        id="notes"
                        name="notes"
                        label="Note"
                        fullWidth
                        variant="standard"
                        defaultValue=""
                    />

                    {/* Upload immagini multiplo per replica */}
                    <TextField
                        type="file"
                        variant="outlined"
                        margin="normal"
                        name="images"
                        inputProps={{ multiple: true, accept: 'image/png,image/jpeg' }}
                        helperText="Accepted formats: .jpg, .png (you can select multiple images)"
                        label="Select image(s)"
                        InputLabelProps={{ shrink: true }}
                        sx={{ mt: 3 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='error'>Annulla</Button>
                    <Button type="submit">Aggiungi</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}