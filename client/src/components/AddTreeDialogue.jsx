import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import { Typography, TextField, Fab } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
// import Calendar from "./Calendar.jsx";
import { useState, useRef, useEffect } from 'react';
import { useMemo } from 'react';
import Button from "@mui/material/Button";
import CloseIcon from '@mui/icons-material/Close';
import '../index.css';
import axios from 'axios'
import SuccessAlert from "./SuccessAlert.jsx";
import FailAlert from "./FailAlert.jsx";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import * as React from 'react';
import { useContext } from "react";
import {TreeContext} from "./context/TreeContext.jsx";

const BASE_URL = import.meta.env.VITE_API_URL;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddTreeDialogue(props) {
    const [inoculated, setInoculated] = useState(true);
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openFail, setOpenFail] = useState(false);
    const formRef = useRef(null);
    const { treeList, setTreeList } = useContext(TreeContext);

    // Stato per "Taxonomy"
    const speciesMap = { Olive: 'Olea europaea', Almond: 'Prunus dulcis', Cherry: 'Prunus avium' };
    const [speciesCommonName, setSpeciesCommonName] = useState('Olive');
    const [speciesScientificName, setSpeciesScientificName] = useState(speciesMap['Olive']);
    const [scientificMode, setScientificMode] = useState('select'); // 'select' | 'custom'
    const isOlea = speciesScientificName === 'Olea europaea';

    const [subspeciesDropdown, setSubspeciesDropdown] = useState('');
    const [subspeciesText, setSubspeciesText] = useState('');
    const [variety, setVariety] = useState('');
    const [cultivarOrSeedling, setCultivarOrSeedling] = useState('Cultivar');

    // Sezione "Cultivar"
    const [cultivarName, setCultivarName] = useState('');
    const [cultivarCode, setCultivarCode] = useState('');
    const [originCountry, setOriginCountry] = useState('');
    const [cultivarList, setCultivarList] = useState([]);

    // Sezione "Seedling"
    const [seedlingId, setSeedlingId] = useState('');
    const [parent1, setParent1] = useState('');
    const [parent2, setParent2] = useState('');
    const [seedlingList, setSeedlingList] = useState([]);

    // Nuovi campi comuni (Cultivar/Seedling)
    const [collectionLocation, setCollectionLocation] = useState('');
    const [xfResponse, setXfResponse] = useState('');

    // Sezione "Genetic characterization"
    const [dnaCode, setDnaCode] = useState('');
    const [dnaRepository, setDnaRepository] = useState('');
    const [foundingInstitution, setFoundingInstitution] = useState('');
    const [geneticSSRs, setGeneticSSRs] = useState('');
    const [geneticSNPs, setGeneticSNPs] = useState(''); // 'Yes' | 'No' | ''
    const [geneticMap, setGeneticMap] = useState('');   // 'Yes' | 'No' | ''
    const [wgsAvailable, setWgsAvailable] = useState(''); // 'Yes' | 'No' | ''
    const [stressType, setStressType] = useState('');   // enum come da schema

    // Sezione "Plant location"
    const [plantCollectionName, setPlantCollectionName] = useState('');
    const [plantPositionInCollection, setPlantPositionInCollection] = useState('');
    const [growthEnvironment, setGrowthEnvironment] = useState('');
    const [controlledFacilityName, setControlledFacilityName] = useState('');
    const [propagationYear, setPropagationYear] = useState('');
    const [demarcatedArea, setDemarcatedArea] = useState('');
    const isControlledEnv = growthEnvironment === 'Experimental facility' || growthEnvironment === 'Greenhouse';
    // Nuovi stati per Open field conditions
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [rowCode, setRowCode] = useState('');
    const [positionInRow, setPositionInRow] = useState('');
    const [yearOfPlanting, setYearOfPlanting] = useState('');
    const [ancientPlant, setAncientPlant] = useState(''); // 'Yes' | 'No'

    // Sezione "Image"
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Nuovi stati: “Altre informazioni”
    const [agronomicPractice, setAgronomicPractice] = useState(''); // enum
    const [expositionType, setExpositionType] = useState('');       // 'Natural' | 'Artificial'
    const [inoculationType, setInoculationType] = useState('');     // 'Xf inoculated' | 'Mock inoculated'

    const years = useMemo(() => {
        const current = new Date().getFullYear();
        const start = 1950;
        const arr = [];
        for (let y = current; y >= start; y--) arr.push(y);
        return arr;
    }, []);

    // Carica elenco cultivar dal backend quando serve (solo Olea + Cultivar)
    useEffect(() => {
        if (isOlea && cultivarOrSeedling === 'Cultivar') {
            axios.get(`${BASE_URL}/api/trees/cultivars`, { withCredentials: true })
                .then(res => {
                    if (res.data?.success && Array.isArray(res.data.cultivars)) {
                        setCultivarList(res.data.cultivars);
                    }
                })
                .catch(() => {});
        }
    }, [isOlea, cultivarOrSeedling]);

    // Carica elenco seedling dal backend quando serve (solo Seedling)
    useEffect(() => {
        if (cultivarOrSeedling === 'Seedling') {
            axios.get(`${BASE_URL}/api/trees/seedlings`, { withCredentials: true })
                .then(res => {
                    if (res.data?.success && Array.isArray(res.data.seedlings)) {
                        setSeedlingList(res.data.seedlings);
                    }
                })
                .catch(() => {});
        }
    }, [cultivarOrSeedling]);

    // Auto-mapping nome comune -> scientifico
    useEffect(() => {
        if (scientificMode === 'select') {
            setSpeciesScientificName(speciesMap[speciesCommonName] || '');
        }
    }, [speciesCommonName, scientificMode]);

    // Reset campi non validi quando non è Olea europaea
    useEffect(() => {
        if (!isOlea) {
            setVariety('');
            setSubspeciesDropdown('');
        }
    }, [isOlea]);

    // Aggiorna anteprima immagine
    useEffect(() => {
        if (imageFile) {
            const objectUrl = URL.createObjectURL(imageFile);
            setImagePreview(objectUrl);
            // Rilascia l'oggetto URL dopo un certo periodo (5 secondi)
            const timer = setTimeout(() => {
                URL.revokeObjectURL(objectUrl);
            }, 5000);
            return () => clearTimeout(timer);
        } else {
            setImagePreview('');
        }
    }, [imageFile]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(formRef.current);
        // rimuove invii non più necessari
        // data.append('inoculated', inoculated);
        // data.append('timestamp', date);

        // Imposta forzatamente i valori controllati per aderire allo schema backend
        data.set('speciesCommonName', speciesCommonName);
        if (scientificMode === 'custom') {
            // speciesScientificName arriva dal campo testo (già nel form), ma lo assicuriamo
            data.set('speciesScientificName', speciesScientificName || '');
        } else {
            data.set('speciesScientificName', speciesScientificName);
        }

        // Subspecies: usa dropdown per Olea, altrimenti testo libero
        if (isOlea) {
            data.delete('subspecies'); // non inviare il testo libero
            if (subspeciesDropdown) data.set('subspeciesDropdown', subspeciesDropdown);
        } else {
            data.delete('subspeciesDropdown'); // non inviare il dropdown
            if (subspeciesText) data.set('subspecies', subspeciesText);
        }

        // Variety: solo per Olea
        if (isOlea && variety) {
            data.set('variety', variety); // 'var. europaea' | 'var. sylvestris'
        } else {
            data.delete('variety');
        }

        // Cultivar/Seedling
        data.set('cultivarOrSeedling', cultivarOrSeedling);
        if (cultivarOrSeedling === 'Cultivar') {
            if (cultivarName) data.set('cultivar', cultivarName);
            // auto codice univoco (facoltativo: backend lo calcola comunque)
            if (cultivarCode) data.set('cultivarCode', cultivarCode);
            // country usato come "Origin country of cultivar"
            if (originCountry) data.set('country', originCountry);
            data.delete('seedlingId');
            data.delete('parent1');
            data.delete('parent2');
        } else {
            // Seedling
            data.delete('cultivar');
            data.delete('cultivarCode');
            if (originCountry) data.delete('country');
            if (seedlingId) data.set('seedlingId', seedlingId);
            if (parent1) data.set('parent1', parent1);
            if (parent2) data.set('parent2', parent2);
        }

        // Nuovi campi: imposta solo se selezionati per aderire all'enum backend
        if (collectionLocation) data.set('collectionLocation', collectionLocation); else data.delete('collectionLocation');
        if (xfResponse) data.set('xfInfectionResponse', xfResponse); else data.delete('xfInfectionResponse');

        // Genetic characterization
        if (dnaCode) data.set('dnaCode', dnaCode); else data.delete('dnaCode');
        if (dnaRepository) data.set('dnaRepository', dnaRepository); else data.delete('dnaRepository');
        if (foundingInstitution) data.set('foundingInstitution', foundingInstitution); else data.delete('foundingInstitution');
        if (geneticSSRs) data.set('geneticIdentificationSSRs', geneticSSRs); else data.delete('geneticIdentificationSSRs');

        // Booleani: converti Yes/No -> 'true'/'false' per coercizione Mongoose
        if (geneticSNPs) data.set('geneticIdentificationSNPs', geneticSNPs === 'Yes' ? 'true' : 'false'); else data.delete('geneticIdentificationSNPs');
        if (geneticMap) data.set('geneticMapAvailable', geneticMap === 'Yes' ? 'true' : 'false'); else data.delete('geneticMapAvailable');
        if (wgsAvailable) data.set('resequencingWgsAvailable', wgsAvailable === 'Yes' ? 'true' : 'false'); else data.delete('resequencingWgsAvailable');

        if (stressType) data.set('stressType', stressType); else data.delete('stressType');

        // Plant location
        if (plantCollectionName) data.set('plantCollectionName', plantCollectionName); else data.delete('plantCollectionName');
        if (plantPositionInCollection) data.set('plantPositionInCollection', plantPositionInCollection); else data.delete('plantPositionInCollection');
        if (growthEnvironment) data.set('growthEnvironment', growthEnvironment); else data.delete('growthEnvironment');
        if (growthEnvironment === 'Experimental facility' || growthEnvironment === 'Greenhouse') {
            if (controlledFacilityName) data.set('controlledFacilityName', controlledFacilityName); else data.delete('controlledFacilityName');
            if (propagationYear) data.set('propagationYear', String(propagationYear)); else data.delete('propagationYear');
            data.delete('demarcatedArea');
            // Elimina campi Open field se non pertinenti
            data.delete('latitude');
            data.delete('longitude');
            data.delete('country');
            data.delete('region');
            data.delete('province');
            data.delete('city');
            data.delete('row');
            data.delete('positionInRow');
            data.delete('yearOfPlanting');
            data.delete('ancientPlant');
        } else if (growthEnvironment === 'Open field') {
            if (demarcatedArea) data.set('demarcatedArea', demarcatedArea); else data.delete('demarcatedArea');
            data.delete('controlledFacilityName');
            data.delete('propagationYear');
            // Nuovi campi Open field
            if (latitude !== '') data.set('latitude', String(latitude)); else data.delete('latitude');
            if (longitude !== '') data.set('longitude', String(longitude)); else data.delete('longitude');
            if (country) data.set('country', country); else data.delete('country');
            if (region) data.set('region', region); else data.delete('region');
            if (province) data.set('province', province); else data.delete('province');
            if (city) data.set('city', city); else data.delete('city');
            if (rowCode) data.set('row', rowCode); else data.delete('row');
            if (positionInRow) data.set('positionInRow', positionInRow); else data.delete('positionInRow');
            if (yearOfPlanting) data.set('yearOfPlanting', String(yearOfPlanting)); else data.delete('yearOfPlanting');
            if (ancientPlant) data.set('ancientPlant', ancientPlant === 'Yes' ? 'true' : 'false'); else data.delete('ancientPlant');
        } else {
            data.delete('controlledFacilityName');
            data.delete('propagationYear');
            data.delete('demarcatedArea');
            // Elimina campi Open field se ambiente non selezionato
            data.delete('latitude');
            data.delete('longitude');
            data.delete('country');
            data.delete('region');
            data.delete('province');
            data.delete('city');
            data.delete('row');
            data.delete('positionInRow');
            data.delete('yearOfPlanting');
            data.delete('ancientPlant');
        }

        // “Altre informazioni” -> nuovi campi
        if (agronomicPractice) data.set('agronomicManagementPractice', agronomicPractice); else data.delete('agronomicManagementPractice');
        if (expositionType) {
            data.set('typeOfExpositionToXfInfection', expositionType);
            if (expositionType === 'Artificial' && inoculationType) {
                data.set('typeOfInoculation', inoculationType);
            } else {
                data.delete('typeOfInoculation');
            }
        } else {
            data.delete('typeOfExpositionToXfInfection');
            data.delete('typeOfInoculation');
        }

        // Validazione immagini multiple
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

        // Debug
        // for (let [key, value] of data.entries()) { console.log(`${key}:`, value); }

        axios.post(`${BASE_URL}/api/trees/addTree`, data, {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((response) => {
            if(response.data.success) {
                console.log(response.data);
                setTreeList([...treeList, response.data.tree]);
                setOpenSuccess(true);
            }
        }).catch((e) => {
            console.log(e);
            setOpenFail(true);
        });
    }

    const handleClose = () => {
        props.setOpen(false);
    };

    return (
        <>
            <FailAlert open={openFail} setOpen={setOpenFail} message={"Non è stato possibile aggiungere l'albero correttamente. Riprovare"}></FailAlert>
            <SuccessAlert open={openSuccess} setOpen={setOpenSuccess} message={'Albero creato con successo'}/>
            {/*TODO aggiustare in caso di responsive */}
            <Dialog
                fullScreen
                open={props.open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    ref: formRef,
                    onSubmit: handleSubmit,
                    encType: 'multipart/form-data'
                }}
                TransitionComponent={Transition}
            >
                <AppBar sx={{position: 'relative'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <CloseIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                            Nuova coltura
                        </Typography>
                        <Button autoFocus color="inherit" onClick={handleSubmit}>
                            Aggiungi
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box sx={{display: 'flex', flexDirection: 'column', width: '100vw'}}>
                    <Typography variant='h6' color='text.secondary' sx={{ ml: 3, mt: 3}}>
                        All fields are necessary to properly add a new tree.
                    </Typography>

                    <FormControl
                        sx={{ m: 5, display: 'flex', flexDirection: 'row', alignItems: 'stretch', flex: '1', flexWrap: 'wrap', gap: '3rem' }}
                    >
                        {/* Sezione Taxonomy */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 'min(1200px, 95vw)' }}>
                            <Typography sx={{ mb: 2 }} variant='h6'>Taxonomy</Typography>

                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
                                {/* Plant ID + Species */}
                                <TextField id="supplierPlantId" label="Plant ID" variant="outlined" type='text' name='supplierPlantId' />
                                <TextField id="species-common" select label="Species (common name)" name='speciesCommonName' value={speciesCommonName} onChange={(e) => setSpeciesCommonName(e.target.value)} sx={{ minWidth: 300 }} InputLabelProps={{ shrink: true }}>
                                    <MenuItem value='Olive'>Olive</MenuItem>
                                    <MenuItem value='Almond'>Almond</MenuItem>
                                    <MenuItem value='Cherry'>Cherry</MenuItem>
                                </TextField>
                                <TextField id="species-scientific" select label="Species (scientific name)" name='speciesScientificName' value={speciesScientificName} onChange={(e) => setSpeciesScientificName(e.target.value)} sx={{ minWidth: 300 }} InputLabelProps={{ shrink: true }}>
                                    <MenuItem value='Olea europaea'>Olea europaea</MenuItem>
                                    <MenuItem value='Prunus dulcis'>Prunus dulcis</MenuItem>
                                    <MenuItem value='Prunus avium'>Prunus avium</MenuItem>
                                </TextField>

                                {/* Subspecies */}
                                {isOlea ? (
                                    <TextField id="subspecies-olea" select label="Subspecies" name='subspeciesDropdown' value={subspeciesDropdown} onChange={(e) => setSubspeciesDropdown(e.target.value)} sx={{ minWidth: 300 }} InputLabelProps={{ shrink: true }}>
                                        <MenuItem value='subsp. cuspidata'>Subsp. cuspidata</MenuItem>
                                        <MenuItem value='subsp. maroccana'>Subsp. maroccana</MenuItem>
                                        <MenuItem value='subsp. cerasiformis'>Subsp. cerasiformis</MenuItem>
                                        <MenuItem value='subsp. guanchica'>Subsp. guanchica</MenuItem>
                                        <MenuItem value='subsp. laperrinei'>Subsp. laperrinei</MenuItem>
                                        <MenuItem value='subsp. europaea'>Subsp. europaea</MenuItem>
                                    </TextField>
                                ) : (
                                    <TextField id="subspecies-generic" label="Subspecies" variant="outlined" type='text' name='subspecies' value={subspeciesText} onChange={(e) => setSubspeciesText(e.target.value)} />
                                )}

                                {/* Variety (solo Olea) */}
                                {isOlea && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <FormLabel id="variety">Variety</FormLabel>
                                        <RadioGroup row name="variety" value={variety} onChange={(e) => setVariety(e.target.value)}>
                                            <FormControlLabel value="var. europaea" control={<Radio/>} label="Var. europaea (cultivated)"/>
                                            <FormControlLabel value="var. sylvestris" control={<Radio/>} label="Var. sylvestris (wild)"/>
                                        </RadioGroup>
                                    </Box>
                                )}

                                {/* Cultivar / Seedling */}
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <FormLabel id="cultivarOrSeedling">Cultivar / Seedling</FormLabel>
                                    <RadioGroup row name="cultivarOrSeedling" value={cultivarOrSeedling} onChange={(e) => setCultivarOrSeedling(e.target.value)}>
                                        <FormControlLabel value="Cultivar" control={<Radio/>} label="Cultivar"/>
                                        <FormControlLabel value="Seedling" control={<Radio/>} label="Seedling"/>
                                    </RadioGroup>
                                </Box>

                                {/* Nuovo: Cultivar/seedling collection */}
                                <TextField
                                    id="collection-location"
                                    select
                                    label="Cultivar/seedling collection"
                                    variant="outlined"
                                    name="collectionLocation"
                                    value={collectionLocation}
                                    onChange={(e) => setCollectionLocation(e.target.value)}
                                    sx={{ minWidth: 260 }}
                                    InputLabelProps={{ shrink: true }}
                                >
                                    <MenuItem value="Almar">Almar</MenuItem>
                                    <MenuItem value="Bexyl">Bexyl</MenuItem>
                                    <MenuItem value="Boneggio">Boneggio</MenuItem>
                                    <MenuItem value="Follonica">Follonica</MenuItem>
                                    <MenuItem value="Lugnano">Lugnano</MenuItem>
                                    <MenuItem value="Parabita">Parabita</MenuItem>
                                    <MenuItem value="Pastene">Pastene</MenuItem>
                                    <MenuItem value="Repository DNA">Repository DNA</MenuItem>
                                    <MenuItem value="not reported">not reported</MenuItem>
                                </TextField>

                                {/* Nuovo: Response of cultivar/seedling to Xf infection */}
                                <TextField
                                    id="xf-response"
                                    select
                                    label="Response to Xf infection"
                                    variant="outlined"
                                    name="xfInfectionResponse"
                                    value={xfResponse}
                                    onChange={(e) => setXfResponse(e.target.value)}
                                    sx={{ minWidth: 260 }}
                                    InputLabelProps={{ shrink: true }}
                                >
                                    <MenuItem value="HR">HR = Highly Resistant</MenuItem>
                                    <MenuItem value="R">R = Resistant</MenuItem>
                                    <MenuItem value="T">T = Tolerant</MenuItem>
                                    <MenuItem value="S">S = Susceptible</MenuItem>
                                    <MenuItem value="HS">HS = Highly Susceptible</MenuItem>
                                </TextField>
                            </Box>
                        </Box>

                        {/* Sezione Cultivar (solo quando è selezionato "Cultivar") */}
                        {cultivarOrSeedling === 'Cultivar' && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 'min(1200px, 95vw)' }}>
                                <Typography sx={{ mb: 2 }} variant='h6'>Cultivar</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
                                    {/* Cultivar: dropdown solo per Olea, altrimenti disabilitato */}
                                    {isOlea ? (
                                        <TextField
                                            id="cultivar-name"
                                            select
                                            label="Cultivar"
                                            variant="outlined"
                                            name='cultivar'
                                            value={cultivarName}
                                            onChange={(e) => {
                                                const name = e.target.value;
                                                setCultivarName(name);
                                                const found = cultivarList.find(c => c.name === name);
                                                setCultivarCode(found?.code || '');
                                            }}
                                            sx={{ minWidth: 360 }}
                                            InputLabelProps={{ shrink: true }}
                                        >
                                            {cultivarList.map(c => (
                                                <MenuItem key={c.code} value={c.name}>{c.name}</MenuItem>
                                            ))}
                                        </TextField>
                                    ) : (
                                        <TextField
                                            id="cultivar-name-disabled"
                                            label="Cultivar"
                                            variant="outlined"
                                            name='cultivar'
                                            value=""
                                            disabled
                                            helperText="Non disponibile per questa specie"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    )}

                                    {/* Unique cultivar code: readonly, auto */}
                                    <TextField
                                        id="cultivar-code"
                                        label="Unique cultivar code"
                                        variant="outlined"
                                        name='cultivarCode'
                                        value={cultivarCode}
                                        InputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                        helperText="Automatically assigned by the system"
                                    />

                                    {/* Origin country of cultivar (salvato su 'country') */}
                                    <TextField
                                        id="origin-country"
                                        select
                                        label="Origin country of cultivar"
                                        variant="outlined"
                                        name='country'
                                        value={originCountry}
                                        onChange={(e) => setOriginCountry(e.target.value)}
                                        sx={{ minWidth: 300 }}
                                        InputLabelProps={{ shrink: true }}
                                    >
                                        <MenuItem value="Italy">Italy</MenuItem>
                                        <MenuItem value="Spain">Spain</MenuItem>
                                        <MenuItem value="Greece">Greece</MenuItem>
                                        <MenuItem value="Portugal">Portugal</MenuItem>
                                        <MenuItem value="France">France</MenuItem>
                                        <MenuItem value="Turkey">Turkey</MenuItem>
                                        <MenuItem value="Morocco">Morocco</MenuItem>
                                        <MenuItem value="Tunisia">Tunisia</MenuItem>
                                        <MenuItem value="Other">Other</MenuItem>
                                    </TextField>
                                </Box>
                            </Box>
                        )}

                        {/* Sezione Seedling (solo quando è selezionato "Seedling") */}
                        {cultivarOrSeedling === 'Seedling' && (
                            <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 'min(1200px, 95vw)' }}>
                                <Typography sx={{ mb: 2 }} variant='h6'>Seedling</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
                                    <TextField
                                        id="seedling-id-select"
                                        select
                                        label="Seedling ID"
                                        variant="outlined"
                                        name="seedlingId"
                                        value={seedlingId}
                                        onChange={(e) => {
                                            const v = e.target.value;
                                            setSeedlingId(v);
                                            const found = seedlingList.find(s => s.id === v);
                                            setParent1(found?.parent1 || '');
                                            setParent2(found?.parent2 || '');
                                        }}
                                        sx={{ minWidth: 300 }}
                                        InputLabelProps={{ shrink: true }}
                                    >
                                        {seedlingList.map(s => (
                                            <MenuItem key={s.id} value={s.id}>{s.id}</MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        id="parent1"
                                        label="Parent 1"
                                        variant="outlined"
                                        name="parent1"
                                        value={parent1}
                                        InputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                    <TextField
                                        id="parent2"
                                        label="Parent 2"
                                        variant="outlined"
                                        name="parent2"
                                        value={parent2}
                                        InputProps={{ readOnly: true }}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Box>
                            </Box>
                        )}

                        {/* Nuova sezione: Genetic characterization */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 'min(1200px, 95vw)' }}>
                            <Typography sx={{ mb: 2, mt: 2 }} variant='h6'>Genetic characterization</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
                                <TextField
                                    id="dna-code"
                                    label="DNA code"
                                    variant="outlined"
                                    name="dnaCode"
                                    value={dnaCode}
                                    onChange={(e) => setDnaCode(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    id="dna-repo"
                                    label="DNA repository"
                                    variant="outlined"
                                    name="dnaRepository"
                                    value={dnaRepository}
                                    onChange={(e) => setDnaRepository(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    id="founding-inst"
                                    label="Founding Institution"
                                    variant="outlined"
                                    name="foundingInstitution"
                                    value={foundingInstitution}
                                    onChange={(e) => setFoundingInstitution(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    id="gen-ssrs"
                                    label="Genetic identification using SSRs"
                                    variant="outlined"
                                    name="geneticIdentificationSSRs"
                                    value={geneticSSRs}
                                    onChange={(e) => setGeneticSSRs(e.target.value)}
                                    sx={{ minWidth: 360 }}
                                    InputLabelProps={{ shrink: true }}
                                    helperText="Enter the identified variety/genotype or a new record"
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 220 }}>
                                  <FormLabel id="gen-snps-label">Genetic identification by SNPs</FormLabel>
                                  <RadioGroup
                                    row
                                    name="geneticIdentificationSNPs"
                                    value={geneticSNPs}
                                    onChange={(e) => setGeneticSNPs(e.target.value)}
                                    aria-labelledby="gen-snps-label"
                                  >
                                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="No" control={<Radio />} label="No" />
                                  </RadioGroup>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 220 }}>
                                  <FormLabel id="genetic-map-label">Genetic map available</FormLabel>
                                  <RadioGroup
                                    row
                                    name="geneticMapAvailable"
                                    value={geneticMap}
                                    onChange={(e) => setGeneticMap(e.target.value)}
                                    aria-labelledby="genetic-map-label"
                                  >
                                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="No" control={<Radio />} label="No" />
                                  </RadioGroup>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 280 }}>
                                  <FormLabel id="wgs-available-label">Resequencing by WGS available</FormLabel>
                                  <RadioGroup
                                    row
                                    name="resequencingWgsAvailable"
                                    value={wgsAvailable}
                                    onChange={(e) => setWgsAvailable(e.target.value)}
                                    aria-labelledby="wgs-available-label"
                                  >
                                    <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                    <FormControlLabel value="No" control={<Radio />} label="No" />
                                  </RadioGroup>
                                </Box>
                                <TextField
                                    id="stress-type"
                                    select
                                    label="Type of biotic/abiotic stress"
                                    variant="outlined"
                                    name="stressType"
                                    value={stressType}
                                    onChange={(e) => setStressType(e.target.value)}
                                    sx={{ minWidth: 300 }}
                                    InputLabelProps={{ shrink: true }}
                                >
                                    <MenuItem value="Drought stress">Drought stress</MenuItem>
                                    <MenuItem value="Cold stress">Cold stress</MenuItem>
                                    <MenuItem value="Agronomic traits">Agronomic traits</MenuItem>
                                    <MenuItem value="GWAS Xf">GWAS Xf</MenuItem>
                                    <MenuItem value="GWAS drought stress">GWAS drought stress</MenuItem>
                                    <MenuItem value="GWAS cold stress">GWAS cold stress</MenuItem>
                                </TextField>
                            </Box>
                        </Box>

                        {/* Sezione Plant location */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 'min(1200px, 95vw)' }}>
                            <Typography sx={{ mb: 2, mt: 2 }} variant='h6'>Plant location</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
                                <TextField
                                    id="plant-collection-name"
                                    label="Plant collection name"
                                    variant="outlined"
                                    name="plantCollectionName"
                                    value={plantCollectionName}
                                    onChange={(e) => setPlantCollectionName(e.target.value)}
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    id="plant-position"
                                    label="Plant position in collection"
                                    variant="outlined"
                                    name="plantPositionInCollection"
                                    value={plantPositionInCollection}
                                    onChange={(e) => setPlantPositionInCollection(e.target.value)}
                                    helperText="Enter the unique position code (or row/column if not present)"
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    id="growth-environment"
                                    select
                                    label="Growth environment"
                                    variant="outlined"
                                    name="growthEnvironment"
                                    value={growthEnvironment}
                                    onChange={(e) => setGrowthEnvironment(e.target.value)}
                                    sx={{ minWidth: 280 }}
                                    InputLabelProps={{ shrink: true }}
                                >
                                    <MenuItem value="Experimental facility">Experimental facility</MenuItem>
                                    <MenuItem value="Greenhouse">Greenhouse</MenuItem>
                                    <MenuItem value="Open field">Open field</MenuItem>
                                </TextField>
                            </Box>

                            {/* Controlled conditions */}
                            {isControlledEnv && (
                                <>
                                    <Typography sx={{ mt: 2 }} variant='subtitle1' color='text.secondary'>Controlled conditions</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5, flexWrap: 'wrap', mt: 1 }}>
                                        <TextField
                                            id="controlled-facility-name"
                                            label="Experimental facility/greenhouse name"
                                            variant="outlined"
                                            name="controlledFacilityName"
                                            value={controlledFacilityName}
                                            onChange={(e) => setControlledFacilityName(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                            required
                                        />
                                        <TextField
                                            id="propagation-year"
                                            select
                                            label="Year of propagation (yyyy)"
                                            variant="outlined"
                                            name="propagationYear"
                                            value={propagationYear}
                                            onChange={(e) => setPropagationYear(e.target.value)}
                                            sx={{ minWidth: 200 }}
                                            InputLabelProps={{ shrink: true }}
                                            required
                                        >
                                            {years.map(y => (
                                                <MenuItem key={y} value={y}>{y}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                </>
                            )}

                            {/* Open field conditions */}
                            {growthEnvironment === 'Open field' && (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                                    <Typography variant='subtitle1' color='text.secondary'>Open field conditions</Typography>
                                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
                                        <TextField
                                            id="demarcated-area"
                                            select
                                            label="Demarcated area"
                                            variant="outlined"
                                            name="demarcatedArea"
                                            value={demarcatedArea}
                                            onChange={(e) => setDemarcatedArea(e.target.value)}
                                            sx={{ minWidth: 260 }}
                                            InputLabelProps={{ shrink: true }}
                                        >
                                            <MenuItem value="Xf-free zone">Xf-free zone</MenuItem>
                                            <MenuItem value="Xf-infected area">Xf-infected area</MenuItem>
                                            <MenuItem value="Xf-buffer area">Xf-buffer area</MenuItem>
                                        </TextField>
                                        <TextField
                                            id="latitude"
                                            label="Latitude"
                                            variant="outlined"
                                            name="latitude"
                                            type="number"
                                            inputProps={{ step: 'any', min: -90, max: 90 }}
                                            value={latitude}
                                            onChange={(e) => setLatitude(e.target.value)}
                                            helperText="e.g. 39.929889"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            id="longitude"
                                            label="Longitude"
                                            variant="outlined"
                                            name="longitude"
                                            type="number"
                                            inputProps={{ step: 'any', min: -180, max: 180 }}
                                            value={longitude}
                                            onChange={(e) => setLongitude(e.target.value)}
                                            helperText="e.g. 18.186083"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            id="country"
                                            select
                                            label="Country"
                                            variant="outlined"
                                            name="country"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            sx={{ minWidth: 240 }}
                                            InputLabelProps={{ shrink: true }}
                                        >
                                            <MenuItem value="Italy">Italy</MenuItem>
                                            <MenuItem value="Spain">Spain</MenuItem>
                                            <MenuItem value="Greece">Greece</MenuItem>
                                            <MenuItem value="Portugal">Portugal</MenuItem>
                                            <MenuItem value="France">France</MenuItem>
                                            <MenuItem value="Turkey">Turkey</MenuItem>
                                            <MenuItem value="Morocco">Morocco</MenuItem>
                                            <MenuItem value="Tunisia">Tunisia</MenuItem>
                                            <MenuItem value="Other">Other</MenuItem>
                                        </TextField>
                                        <TextField
                                            id="region"
                                            label="Region"
                                            variant="outlined"
                                            name="region"
                                            value={region}
                                            onChange={(e) => setRegion(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            id="province"
                                            label="Province"
                                            variant="outlined"
                                            name="province"
                                            value={province}
                                            onChange={(e) => setProvince(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            id="city"
                                            label="City"
                                            variant="outlined"
                                            name="city"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            id="row-code"
                                            label="Row"
                                            variant="outlined"
                                            name="row"
                                            value={rowCode}
                                            onChange={(e) => setRowCode(e.target.value)}
                                            helperText="Row where the sampled plant is located"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            id="position-in-row"
                                            label="Position in the row"
                                            variant="outlined"
                                            name="positionInRow"
                                            value={positionInRow}
                                            onChange={(e) => setPositionInRow(e.target.value)}
                                            helperText="Position occupied in the row by the sampled plant"
                                            InputLabelProps={{ shrink: true }}
                                        />
                                        <TextField
                                            id="year-of-planting"
                                            select
                                            label="Year of planting (yyyy)"
                                            variant="outlined"
                                            name="yearOfPlanting"
                                            value={yearOfPlanting}
                                            onChange={(e) => setYearOfPlanting(e.target.value)}
                                            sx={{ minWidth: 200 }}
                                            InputLabelProps={{ shrink: true }}
                                        >
                                            {years.map(y => (
                                                <MenuItem key={y} value={y}>{y}</MenuItem>
                                            ))}
                                        </TextField>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 220 }}>
                                            <FormLabel id="ancient-plant-label">Ancient plant (monumental tree)</FormLabel>
                                            <RadioGroup
                                                row
                                                name="ancientPlant"
                                                value={ancientPlant}
                                                onChange={(e) => setAncientPlant(e.target.value)}
                                                aria-labelledby="ancient-plant-label"
                                            >
                                                <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                                                <FormControlLabel value="No" control={<Radio />} label="No" />
                                            </RadioGroup>
                                        </Box>
                                    </Box>
                                </Box>
                            )}

                        </Box>

                        {/* Sezione Altre informazioni (riscritta) */}
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ mb: 2, mt: 2 }} variant='h6'>Additional information</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
                                <TextField
                                    id="agronomic-management-practice"
                                    select
                                    label="Agronomic management practice"
                                    variant="outlined"
                                    name="agronomicManagementPractice"
                                    value={agronomicPractice}
                                    onChange={(e) => setAgronomicPractice(e.target.value)}
                                    sx={{ minWidth: 260 }}
                                    InputLabelProps={{ shrink: true }}
                                >
                                    <MenuItem value="Auto-rooted">Auto-rooted</MenuItem>
                                    <MenuItem value="Grafted">Grafted</MenuItem>
                                    <MenuItem value="Cultivated in vitro">Cultivated in vitro</MenuItem>
                                    <MenuItem value="Propagated by seed">Propagated by seed</MenuItem>
                                    <MenuItem value="Potted plant">Potted plant</MenuItem>
                                    <MenuItem value="Field plant">Field plant</MenuItem>
                                </TextField>

                                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 320 }}>
                                    <FormLabel id="exposition-type-label">Type of exposition to Xf infection</FormLabel>
                                    <RadioGroup
                                        row
                                        name="typeOfExpositionToXfInfection"
                                        value={expositionType}
                                        onChange={(e) => {
                                            setExpositionType(e.target.value);
                                            if (e.target.value !== 'Artificial') setInoculationType('');
                                        }}
                                        aria-labelledby="exposition-type-label"
                                    >
                                        <FormControlLabel value="Natural" control={<Radio />} label="Natural" />
                                        <FormControlLabel value="Artificial" control={<Radio />} label="Artificial" />
                                    </RadioGroup>
                                </Box>

                                {expositionType === 'Artificial' && (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 320 }}>
                                        <FormLabel id="inoculation-type-label">Type of inoculation</FormLabel>
                                        <RadioGroup
                                            row
                                            name="typeOfInoculation"
                                            value={inoculationType}
                                            onChange={(e) => setInoculationType(e.target.value)}
                                            aria-labelledby="inoculation-type-label"
                                        >
                                            <FormControlLabel value="Xf inoculated" control={<Radio />} label="Xf inoculated" />
                                            <FormControlLabel value="Mock inoculated" control={<Radio />} label="Mock inoculated" />
                                        </RadioGroup>
                                    </Box>
                                )}
                            </Box>

                            {/* Upload immagini multiplo */}
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 3 }}>
                                <TextField
                                    type="file"
                                    variant="outlined"
                                    margin="normal"
                                    name="images"
                                    inputProps={{ multiple: true, accept: 'image/png,image/jpeg' }}
                                    helperText="Accepted fomats: .jpg, .png. It is possible to select multiple images."
                                    label="Select images"
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Box>
                        </Box>
                    </FormControl>
                </Box>
            </Dialog>
        </>
    )
}
