import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase';
import ImageUploader from './ImageUploader';
import { TextField, Button, Box } from '@mui/material';
import SubFolderList from './SubFolderList';
import ImagesList from './ImagesList';
import SubFolderView from './SubFolderView';

const FolderView = () => {
    const { folderName } = useParams();
    const [images, setImages] = useState([]);
    const [folders, setFolders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [newSubfolder, setNewSubfolder] = useState('');
    const [currentSubfolder, setCurrentSubfolder] = useState(folderName); // Состояние для текущей подпапки

    const fetchContents = async () => {
        setLoading(true);
        try {
            const folderRef = ref(storage, folderName);
            const res = await listAll(folderRef);

            const folderPromises = res.prefixes.map(async (prefix) => {
                return prefix.fullPath;
            });

            const imageUrls = await Promise.all(
                res.items.map(item => getDownloadURL(item))
            );

            setImages(imageUrls);
            setFolders(await Promise.all(folderPromises));
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchContents();
    }, [folderName]);

    const handleUploadSuccess = () => {
        fetchContents();
    };

    const handleCreateSubfolder = async () => {
        if (!newSubfolder) return;

        const subfolderRef = ref(storage, `${folderName}/${newSubfolder}/placeholder.txt`);
        const placeholder = new Blob(["Placeholder for subfolder"], { type: "text/plain" });

        try {
            await uploadBytes(subfolderRef, placeholder);
            alert('Subfolder created successfully!');
            setNewSubfolder('');
            fetchContents();
        } catch (error) {
            alert(`Error creating subfolder: ${error.message}`);
        }
    };

    const handleSelectSubfolder = (subfolderPath) => {
        setCurrentSubfolder(subfolderPath);
    };

    if (loading) return <p>Loading content...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Contents in folder: {folderName}</h2>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                    label="New Subfolder Name"
                    variant="outlined"
                    value={newSubfolder}
                    onChange={(e) => setNewSubfolder(e.target.value)}
                />
                <Button variant="contained" onClick={handleCreateSubfolder}>
                    Create Subfolder
                </Button>
            </Box>
            <SubFolderView initialFolder={currentSubfolder} onUploadSuccess={handleUploadSuccess} />
            <SubFolderList folders={folders} onSelectSubfolder={handleSelectSubfolder} />
            <ImagesList images={images} />
        </div>
    );
};

export default FolderView;
