import { ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoldersFromStorage } from "../../Store/Slices/FolderSlices";
import { Button, TextField, Typography, Box, Paper, Input, IconButton } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';

const AddFolderInFolder = ({ initialFolder }) => {
    const dispatch = useDispatch();
    const { folders } = useSelector((state) => state.folders);
    const [file, setFile] = useState(null);
    const [folder, setFolder] = useState(initialFolder || '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchFoldersFromStorage());
    }, [dispatch]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFolderChange = (e) => {
        setFolder(e.target.value);
    };

    const handleUpload = async () => {
        if (!file || !folder) {
            alert('Please select a file and a folder.');
            return;
        }

        setIsLoading(true);
        try {
            const storageRef = ref(storage, `${folder}/${file.name}`);
            await uploadBytes(storageRef, file);
            alert('File uploaded successfully!');
            dispatch(fetchFoldersFromStorage());
            setFile(null);
            setFolder('');
        } catch (error) {
            alert(`Error uploading file: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                padding: 4,
                maxWidth: 400,
                margin: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                backgroundColor: '#f5f5f5',
                borderRadius: 2
            }}
        >
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#6200ea' }}>
                Add New Category
            </Typography>
            <TextField
                fullWidth
                label="Folder Name"
                variant="outlined"
                value={folder}
                onChange={handleFolderChange}
                sx={{
                    backgroundColor: '#fff',
                    borderRadius: '5px',
                }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    sx={{
                        flex: 1,
                        backgroundColor: '#fff',
                        '&:hover': {
                            backgroundColor: '#ddd',
                        },
                    }}
                >
                    Choose File
                    <input type="file" hidden onChange={handleFileChange} />
                </Button>
                <Typography variant="body2" sx={{ color: '#666' }}>
                    {file ? file.name : 'No file selected'}
                </Typography>
            </Box>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={isLoading}
                sx={{
                    backgroundColor: '#6200ea',
                    '&:hover': {
                        backgroundColor: '#3700b3',
                    },
                }}
            >
                {isLoading ? 'Uploading...' : 'Upload'}
            </Button>
        </Paper>
    );
};

export default AddFolderInFolder;
