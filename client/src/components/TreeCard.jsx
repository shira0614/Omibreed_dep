import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";


export default function TreeCard(props) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/${props._id}`);
    }

    const sciName = props.speciesScientificName ?? props.scifiName ?? '';
    const commonName = props.speciesCommonName ?? props.commonName ?? '';
    const subspec = props.subspeciesDropdown ?? props.subSpecie ?? props.subspecies ?? '';
    const growthEnv = props.growthEnvironment ?? '';

    const imageSrc = props.image ?? (Array.isArray(props.imageUrls) ? props.imageUrls[0] : undefined);

    return (
        <Card sx={{
            display: 'flex',
            border: '3px solid',
            borderColor: '#ffffff00',
            m: '1rem',
            width: { xs: '90vw', sm: '50vw' },
            minHeight: 100,
        }}>
            <CardActionArea onClick={handleClick}>
                <Box sx={{ display: 'flex', flexDirection: 'column',
                    width: '100%', flex: '1 0', alignItems: 'center', justifyContent: 'flex-start'}}>
                    <CardContent sx={{ flex: '1' }}>
                        <Typography gutterBottom variant="h5" component="div">
                            {props.treeUniqueId}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {sciName}{commonName ? `, ${commonName}` : ''}{subspec ? `, ${subspec}` : ''}
                        </Typography>
                        <Typography sx={{ mt: 1}}>Growth Environment: {growthEnv || '—'}</Typography>
                    </CardContent>
                </Box>
            </CardActionArea>
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
        </Card>
    );
}