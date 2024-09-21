import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFoldersFromStorage } from '../../Store/Slices/FolderSlices';
import { Link, useParams } from 'react-router-dom';
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import { AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ImageUpLoadOnFolder from './ImageUpLoadOnFolder';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';

const Main = () => {
    const dispatch = useDispatch();
    const { folders, loading, error } = useSelector((state) => state.folders);
    const { folderName } = useParams();
    const [folderImages, setFolderImages] = useState({});
    const [loadings, setLoadings] = useState(false);
    const [errors, setErrors] = useState(null);

    useEffect(() => {
        dispatch(fetchFoldersFromStorage());
    }, [dispatch]);

    useEffect(() => {
        const fetchImagesForFolders = async () => {
            setLoadings(true);
            try {
                const images = {};
                for (const folder of folders) {
                    const maleRef = ref(storage, `${folder}/male/`);
                    const femaleRef = ref(storage, `${folder}/female/`);

                    const maleRes = await listAll(maleRef);
                    const femaleRes = await listAll(femaleRef);

                    const maleImageUrls = await Promise.all(maleRes.items.map(item => getDownloadURL(item)));
                    const femaleImageUrls = await Promise.all(femaleRes.items.map(item => getDownloadURL(item)));

                    images[folder] = {
                        male: maleImageUrls.length > 0 ? maleImageUrls[0] : null,
                        female: femaleImageUrls.length > 0 ? femaleImageUrls[0] : null,
                    };
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

    return (
        <>
            <AppBar position="static" style={{ backgroundColor: '#6200ea' }}>
                <Toolbar>
                    <div>
                        <IconButton color="inherit">
                            <FemaleIcon />
                        </IconButton>
                        <IconButton color="inherit">
                            <MaleIcon />
                        </IconButton>
                    </div>
                    {loading && <p>Loading folders...</p>}
                    {error && <p>Error: {error}</p>}
                    {folders.map((folder) => (
                        <div key={folder} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginRight: '10px' }}>
                            <Button
                                variant="outlined"
                                color="inherit"
                                style={{ textTransform: 'none', marginRight: '5px' }}
                                component={Link}
                                to={`/folder/${folder}`}
                            >
                                {folder}
                                {folderImages[folder]?.male && (
                                    <img
                                        src={folderImages[folder].male}
                                        alt={`Male Image of ${folder}`}
                                        style={{ width: '30px', height: '30px', borderRadius: '50%', marginLeft: '5px' }}
                                    />
                                )}
                                {folderImages[folder]?.female && (
                                    <img
                                        src={folderImages[folder].female}
                                        alt={`Female Image of ${folder}`}
                                        style={{ width: '30px', height: '30px', borderRadius: '50%', marginLeft: '5px' }}
                                    />
                                )}
                            </Button>
                        </div>
                    ))}
                </Toolbar>
            </AppBar>
            <ImageUpLoadOnFolder />
            <h2 style={{ textAlign: 'center', marginTop: '30px' }}>Welcome to the Image Uploader!</h2>
        </>
    );
};

export default Main;
