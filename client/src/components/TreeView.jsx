import * as React from 'react'
import DrawerAppBar from './DrawerAppBar'
import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import { getApi } from "../utils/apiEndpoints.js";
import Loading from "./Loading.jsx";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ReplicaCard from "./ReplicaCard.jsx";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import AddReplicaDialogue from "./AddReplicaDialogue.jsx";
import {dateFormatter} from "../utils/treeUtils.js";
import { SingleTreeContext } from "./context/TreeContext.jsx";

export default function TreeView() {
    const { treeId } = useParams();
    const [tree, setTree] = useState(null);
    const [replicas, setReplicas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [imageUrls, setImageUrls] = useState([]); // was imageUrl
    const [open, setOpen] = useState(false)
    const treeValue = { tree, setTree, replicas, setReplicas };

    useEffect(() => {
        getApi(`trees/${treeId}`)
            .then((response) => {
                response.tree.timestamp = dateFormatter(response.tree.timestamp);
                setTree(response.tree);
                setImageUrls(response.imageUrls || []); // use array of images

                getApi(`trees/${treeId}/replicas`).then((response) => {
                    setReplicas(response);
                    setLoading(false);
                })
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            })
    }, [treeId]);

    const handleClick = () => {
        setOpen(true)
    }

    if (loading) {
        return <Loading />
    }

    const subspecies = tree?.subspeciesDropdown || tree?.subspecies || '';
    const isControlledEnv = tree?.growthEnvironment === 'Experimental facility' || tree?.growthEnvironment === 'Greenhouse';
    const isOpenField = tree?.growthEnvironment === 'Open field';
    const isCultivar = tree?.cultivarOrSeedling === 'Cultivar';
    const isSeedling = tree?.cultivarOrSeedling === 'Seedling';

    return (
        <Box sx={{ overflowY: 'auto' }}>
            <SingleTreeContext.Provider value={treeValue}>
                <AddReplicaDialogue isOpen={open} setOpen={setOpen} treeId={treeId}/>
                <DrawerAppBar />
                <Typography variant='h4' sx={{ mb: '2%', ml: '3%' }}>
                    Plant ID: {tree.treeUniqueId}
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'row', width: '100vw', flexWrap: 'wrap', justifyContent: 'space-between', ml: '3%', alignContent: 'space-between'}}>
                    {/* Colonna sinistra: attributi albero */}
                    <Box sx={{ flex: 2, minWidth: '28rem', pr: 3 }}>
                        {/* Taxonomy */}
                        <Typography variant='h5'>Taxonomy</Typography>
                        <Box sx={{ mt: 1 }}>
                            <Typography fontWeight='bold'>Plant ID (provided by supplier): <Typography display='inline'> {tree.supplierPlantId || ''}</Typography></Typography>
                            <Typography fontWeight='bold'>Species (common name): <Typography display='inline'> {tree.speciesCommonName || ''}</Typography></Typography>
                            <Typography fontWeight='bold'>Species (scientific name): <Typography display='inline'> {tree.speciesScientificName || ''}</Typography></Typography>
                            <Typography fontWeight='bold'>Subspecies: <Typography display='inline'> {subspecies}</Typography></Typography>
                            {tree.speciesScientificName === 'Olea europaea' && (
                                <Typography fontWeight='bold'>Variety: <Typography display='inline'> {tree.variety || ''}</Typography></Typography>
                            )}
                            <Typography fontWeight='bold'>Cultivar / Seedling: <Typography display='inline'> {tree.cultivarOrSeedling || ''}</Typography></Typography>
                            <Typography fontWeight='bold'>Cultivar/seedling collection: <Typography display='inline'> {tree.collectionLocation || ''}</Typography></Typography>
                            <Typography fontWeight='bold'>Response to Xf infection: <Typography display='inline'> {tree.xfInfectionResponse || ''}</Typography></Typography>
                        </Box>

                        {/* Cultivar (solo se selezionato) */}
                        {isCultivar && (
                            <>
                                <Typography variant='h5' sx={{ mt: 2 }}>Cultivar</Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Typography fontWeight='bold'>Cultivar: <Typography display='inline'> {tree.cultivar || ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Unique cultivar code: <Typography display='inline'> {tree.cultivarCode || ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Origin country of cultivar: <Typography display='inline'> {tree.country || ''}</Typography></Typography>
                                </Box>
                            </>
                        )}

                        {/* Seedling (solo se selezionato) */}
                        {isSeedling && (
                            <>
                                <Typography variant='h5' sx={{ mt: 2 }}>Seedling</Typography>
                                <Box sx={{ mt: 1 }}>
                                    <Typography fontWeight='bold'>Seedling ID: <Typography display='inline'> {tree.seedlingId || ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Parent 1: <Typography display='inline'> {tree.parent1 || ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Parent 2: <Typography display='inline'> {tree.parent2 || ''}</Typography></Typography>
                                </Box>
                            </>
                        )}

                        {/* Genetic characterization */}
                        <Typography variant='h5' sx={{ mt: 2 }}>Genetic characterization</Typography>
                        <Box sx={{ mt: 1 }}>
                            <Typography fontWeight='bold'>DNA code: <Typography display='inline'> {tree.dnaCode || ''}</Typography></Typography>
                            <Typography fontWeight='bold'>DNA repository: <Typography display='inline'> {tree.dnaRepository || ''}</Typography></Typography>
                            <Typography fontWeight='bold'>Founding Institution: <Typography display='inline'> {tree.foundingInstitution || ''}</Typography></Typography>
                            <Typography fontWeight='bold'>Genetic identification using SSRs: <Typography display='inline'> {tree.geneticIdentificationSSRs || ''}</Typography></Typography>
                            <Typography fontWeight='bold'>Genetic identification by SNPs: <Typography display='inline'> {tree.geneticIdentificationSNPs ? 'Yes' : 'No'}</Typography></Typography>
                            <Typography fontWeight='bold'>Genetic map available: <Typography display='inline'> {tree.geneticMapAvailable ? 'Yes' : 'No'}</Typography></Typography>
                            <Typography fontWeight='bold'>Resequencing by WGS available: <Typography display='inline'> {tree.resequencingWgsAvailable ? 'Yes' : 'No'}</Typography></Typography>
                            <Typography fontWeight='bold'>Type of biotic/abiotic stress: <Typography display='inline'> {tree.stressType || ''}</Typography></Typography>
                        </Box>

                        {/* Plant location */}
                        <Typography variant='h5' sx={{ mt: 2 }}>Plant location</Typography>
                        <Box sx={{ mt: 1 }}>
                            <Typography fontWeight='bold'>Plant collection name: <Typography display='inline'> {tree.plantCollectionName || ''}</Typography></Typography>
                            <Typography fontWeight='bold'>Plant position in collection: <Typography display='inline'> {tree.plantPositionInCollection || ''}</Typography></Typography>
                            <Typography fontWeight='bold'>Growth environment: <Typography display='inline'> {tree.growthEnvironment || ''}</Typography></Typography>

                            {/* Controlled conditions */}
                            {isControlledEnv && (
                                <>
                                    <Typography variant='subtitle1' color='text.secondary' sx={{ mt: 1 }}>Controlled conditions</Typography>
                                    <Typography fontWeight='bold'>Experimental facility/greenhouse name: <Typography display='inline'> {tree.controlledFacilityName || ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Year of propagation (yyyy): <Typography display='inline'> {tree.propagationYear || ''}</Typography></Typography>
                                </>
                            )}

                            {/* Open field conditions */}
                            {isOpenField && (
                                <>
                                    <Typography variant='subtitle1' color='text.secondary' sx={{ mt: 1 }}>Open field conditions</Typography>
                                    <Typography fontWeight='bold'>Demarcated area: <Typography display='inline'> {tree.demarcatedArea || ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Latitude: <Typography display='inline'> {tree.latitude ?? ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Longitude: <Typography display='inline'> {tree.longitude ?? ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Country: <Typography display='inline'> {tree.country || ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Region: <Typography display='inline'> {tree.region || ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Province: <Typography display='inline'> {tree.province || ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>City: <Typography display='inline'> {tree.city || ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Row: <Typography display='inline'> {tree.row || ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Position in the row: <Typography display='inline'> {tree.positionInRow || ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Year of planting (yyyy): <Typography display='inline'> {tree.yearOfPlanting || ''}</Typography></Typography>
                                    <Typography fontWeight='bold'>Ancient plant (monumental tree): <Typography display='inline'> {tree.ancientPlant ? 'Yes' : 'No'}</Typography></Typography>
                                </>
                            )}
                        </Box>

                        {/* Additional information */}
                        <Typography variant='h5' sx={{ mt: 2 }}>Additional information</Typography>
                        <Box sx={{ mt: 1 }}>
                            <Typography fontWeight='bold'>Agronomic management practice: <Typography display='inline'> {tree.agronomicManagementPractice || ''}</Typography></Typography>
                            <Typography fontWeight='bold'>Type of exposition to Xf infection: <Typography display='inline'> {tree.typeOfExpositionToXfInfection || ''}</Typography></Typography>
                            {tree.typeOfExpositionToXfInfection === 'Artificial' && (
                                <Typography fontWeight='bold'>Type of inoculation: <Typography display='inline'> {tree.typeOfInoculation || ''}</Typography></Typography>
                            )}
                        </Box>
                    </Box>

                    {/* Colonna centrale: Repliche */}
                    <Box sx={{ flex: 1, ml: 3, minWidth: '30rem', overflow: 'auto', pl: 2 }}>
                        <Typography variant='h5'>Repliche</Typography>
                        <Fab color='forest' size="small" onClick={handleClick} sx={{ mt: 1, mb: 1, '&:hover': { backgroundColor: '#3d8864' } }}>
                            <AddIcon sx={{ color: '#ffffff' }}/>
                        </Fab>
                        {replicas.map((replica) => {
                            return (
                                <ReplicaCard
                                    key={replica._id}
                                    replicaUniqueId={replica.replicaUniqueId}
                                    image={Array.isArray(replica.imageUrls) && replica.imageUrls.length ? replica.imageUrls[0] : undefined}
                                    sample={replica.sample}
                                    notes={replica.notes}
                                    replica={replica}
                                />
                            )
                        })}
                    </Box>

                    {/* Colonna destra: tutte le immagini del tree una sotto l'altra */}
                    {Array.isArray(imageUrls) && imageUrls.length > 0 && (
                        <Box
                            sx={{
                                flex: 1,
                                minWidth: '32rem',
                                maxWidth: '50%',
                                overflowY: 'auto',
                                pl: '5%',
                                pr: '5%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 2
                            }}
                        >
                            {imageUrls.map((url, idx) => (
                                <Box
                                    key={idx}
                                    component='img'
                                    alt={`Tree image ${idx + 1}`}
                                    src={url}
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        borderRadius: 1,
                                        boxShadow: 1
                                    }}
                                />
                            ))}
                        </Box>
                    )}
                </Box>
            </SingleTreeContext.Provider>
        </Box>
    )
}