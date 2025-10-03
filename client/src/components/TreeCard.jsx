import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useContext, useState } from 'react';
import { TreeContext } from './context/TreeContext.jsx';

const BASE_URL = import.meta.env.VITE_API_URL;

export default function TreeCard(props) {
    const navigate = useNavigate();
    const { treeList, setTreeList } = useContext(TreeContext);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleClick = () => {
        navigate(`/${props._id}`);
    }

    const sciName = props.speciesScientificName ?? props.scifiName ?? '';
    const commonName = props.speciesCommonName ?? props.commonName ?? '';
    const subspec = props.subspeciesDropdown ?? props.subSpecie ?? props.subspecies ?? '';
    const growthEnv = props.growthEnvironment ?? '';

    const imageSrc = props.image ?? (Array.isArray(props.imageUrls) ? props.imageUrls[0] : undefined);

    const handleOpenConfirm = (e) => {
        e.stopPropagation();
        setConfirmOpen(true);
    };

    const handleCloseConfirm = () => setConfirmOpen(false);

    const handleDelete = async () => {
        try {
            await axios.delete(`${BASE_URL}/api/trees/${props._id}`, { withCredentials: true });
            setTreeList(treeList.filter(t => t._id !== props._id));
        } catch (e) {
            console.error('Delete tree error', e);
        } finally {
            setConfirmOpen(false);
        }
    };

    return (
        <Card sx={{
            display: 'flex',
            border: '3px solid',
            borderColor: '#ffffff00',
            m: '1rem',
            width: { xs: '90vw', sm: '50vw' },
            minHeight: 100,
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, position: 'relative' }}>
                    <CardActionArea onClick={handleClick}>
                        <CardContent sx={{ flex: '1' }}>
                            <Typography gutterBottom variant="h5" component="div">
                                {props.treeUniqueId}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {sciName}{commonName ? `, ${commonName}` : ''}{subspec ? `, ${subspec}` : ''}
                            </Typography>
                            <Typography sx={{ mt: 1}}>Growth Environment: {growthEnv || '—'}</Typography>
                        </CardContent>
                    </CardActionArea>

                    {/* Icona cestino in overlay: occupa solo lo spazio dell'icona */}
                    <IconButton
                        aria-label="delete tree"
                        color="error"
                        onClick={handleOpenConfirm}
                        title="Delete tree"
                        sx={{ position: 'absolute', bottom: 8, right: 8 }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Box>

                {
                    imageSrc ? <CardMedia
                        component="img"
                        alt="plant image"
                        sx={{ display: 'flex', width: 250, flex: '0 1', alignItems: 'flex-end', objectFit: 'contain' }}
                        image={imageSrc}
                    /> : <CardMedia
                        component="img"
                        alt="logo"
                        sx={{ width: 200, height: 200, m: 2, objectFit: 'contain' }}
                        image={logo}
                    />
                }
            </Box>

            <Dialog open={confirmOpen} onClose={handleCloseConfirm}>
                <DialogTitle>Sei sicuro di voler eliminare questo albero?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseConfirm}>Annulla</Button>
                    <Button color="error" onClick={handleDelete}>Elimina</Button>
                </DialogActions>
            </Dialog>
        </Card>
    );
}