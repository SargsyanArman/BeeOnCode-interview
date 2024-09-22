import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoldersFromStorage } from '../../Store/Slices/FolderSlices';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import { AppBar, Toolbar, IconButton, Button, Modal, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import ImageUploadOnFolder from './ImageUpLoadOnFolder';
import AddIcon from '@mui/icons-material/Add';

const Main = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate(); // Используйте useNavigate
    const { folders, loading, error } = useSelector((state) => state.folders);
    const { folderName } = useParams();
    const [folderImages, setFolderImages] = useState({});
    const [loadings, setLoadings] = useState(false);
    const [errors, setErrors] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(() => {
        dispatch(fetchFoldersFromStorage());
    }, [dispatch]);

    useEffect(() => {
        const fetchImagesForFolders = async () => {
            setLoadings(true);
            try {
                const images = {};
                for (const folder of folders) {
                    const folderRef = ref(storage, `${folder}/`);
                    const res = await listAll(folderRef);
                    const imageUrls = await Promise.all(
                        res.items.map(item => getDownloadURL(item))
                    );

                    if (imageUrls.length > 0) {
                        images[folder] = imageUrls[0];
                    }
                }
                setFolderImages(images);
            } catch (err) {
                setErrors(err.message);
            }
            setLoadings(false);
        };

        if (folders.length > 0) {
            fetchImagesForFolders();
        }
    }, [folders]);

    const handleFolderClick = async (folder) => {
        const folderRef = ref(storage, folder);
        const res = await listAll(folderRef);
        if (res.prefixes.length > 0) {
            // Перенаправить на первый подкаталог
            navigate(`/folder/${res.prefixes[0].fullPath}`);
        } else {
            // Если подкаталогов нет, просто перенаправить на основную папку
            navigate(`/folder/${folder}`);
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    {loading && <p>Loading folders...</p>}
                    {error && <p>Error: {error}</p>}
                    <IconButton color="inherit">
                        <FemaleIcon />
                    </IconButton>
                    <IconButton color="inherit">
                        <MaleIcon />
                    </IconButton>
                    {folders.map((folder) => {
                        const isActive = location.pathname === `/folder/${folder}`;
                        return (
                            <div key={folder} style={{ display: 'flex', alignItems: 'center', marginRight: '10px' }}>
                                <Button
                                    variant="outlined"
                                    color="inherit"
                                    style={{
                                        textTransform: 'none',
                                        marginRight: '5px',
                                        backgroundColor: isActive ? '#6200ea' : 'transparent'
                                    }}
                                    onClick={() => handleFolderClick(folder)} // Обновленный обработчик клика
                                >
                                    {folder}
                                    {folderImages[folder] && (
                                        <img
                                            src={folderImages[folder]}
                                            alt={`Image of ${folder}`}
                                            style={{ width: '30px', height: '30px', borderRadius: '50%' }}
                                        />
                                    )}
                                </Button>
                            </div>
                        );
                    })}

                    <IconButton onClick={handleOpen}>
                        <AddIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <ImageUploadOnFolder />
                    <Button onClick={handleClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Close
                    </Button>
                </Box>
            </Modal>
        </>
    );
};

export default Main;
