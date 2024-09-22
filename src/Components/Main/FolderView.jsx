import React, { useEffect, useState } from 'react';
import { useParams, Outlet, Link, useLocation } from 'react-router-dom';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase';
import { Box, Button, TextField, Modal, IconButton, BottomNavigation, BottomNavigationAction } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import FolderIcon from '@mui/icons-material/Folder';
import SubFolderList from './SubFolderList';

const FolderView = () => {
    const { folderName } = useParams();
    const location = useLocation(); // Получаем текущий путь
    const [images, setImages] = useState([]);
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newSubfolder, setNewSubfolder] = useState('');
    const [openModal, setOpenModal] = useState(false); // Состояние для модального окна
    const [navValue, setNavValue] = useState(0); // Состояние для BottomNavigation

    const fetchContents = async () => {
        setLoading(true);
        try {
            const folderRef = ref(storage, folderName);
            const res = await listAll(folderRef);

            const folderPromises = res.prefixes.map(async (prefix) => prefix.fullPath);

            const imageUrls = await Promise.all(
                res.items.map(item => getDownloadURL(item))
            );

            setImages(imageUrls);
            setFolders(await Promise.all(folderPromises));
        } catch (err) {
            console.error(err.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchContents();
    }, [folderName]);

    const handleCreateSubfolder = async () => {
        if (!newSubfolder) return;

        const subfolderRef = ref(storage, `${folderName}/${newSubfolder}/placeholder.txt`);
        const placeholder = new Blob(["Placeholder for subfolder"], { type: "text/plain" });

        try {
            await uploadBytes(subfolderRef, placeholder);
            alert('Subfolder created successfully!');
            setNewSubfolder('');
            setOpenModal(false); // Закрыть модальное окно после создания
            fetchContents();
        } catch (error) {
            alert(`Error creating subfolder: ${error.message}`);
        }
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    useEffect(() => {
        // Обновляем значение BottomNavigation при изменении пути
        const activeIndex = folders.findIndex(folder => `/folder/${folder}` === location.pathname);
        setNavValue(activeIndex !== -1 ? activeIndex : 0);
    }, [location.pathname, folders]);

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Bottom Navigation для роутинга между папками */}
            <BottomNavigation
                value={navValue}
                onChange={(event, newValue) => setNavValue(newValue)}
                showLabels
                sx={{ backgroundColor: "#f0f0f0" }}
            >
                {folders.map((folderPath, index) => (
                    <BottomNavigationAction
                        key={index}
                        label={folderPath.split('/').pop()}
                        icon={<FolderIcon />}
                        component={Link}
                        to={`/folder/${folderPath}`}
                    />
                ))}
                <BottomNavigationAction
                    icon={<AddIcon />}
                    label="New Folder"
                    onClick={handleOpenModal}
                />
            </BottomNavigation>

            <Outlet />

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="create-subfolder-modal"
                aria-describedby="create-subfolder-form"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                    }}
                >
                    <TextField
                        label="New Subfolder Name"
                        variant="outlined"
                        value={newSubfolder}
                        onChange={(e) => setNewSubfolder(e.target.value)}
                        fullWidth
                    />
                    <Button variant="contained" onClick={handleCreateSubfolder}>
                        Create Subfolder
                    </Button>
                    <Button onClick={handleCloseModal} color="secondary">
                        Cancel
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default FolderView;
