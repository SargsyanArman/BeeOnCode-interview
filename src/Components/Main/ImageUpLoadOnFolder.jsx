import { ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { storage } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchFoldersFromStorage } from "../../Store/Slices/FolderSlices";

const ImageUploadOnFolder = ({ initialFolder }) => {
    const dispatch = useDispatch();
    const { folders } = useSelector((state) => state.folders);
    const [file, setFile] = useState(null);
    const [folder, setFolder] = useState(initialFolder || '');

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

        try {
            const storageRef = ref(storage, `${folder}/${file.name}`);
            await uploadBytes(storageRef, file);
            alert('File uploaded successfully!');
            dispatch(fetchFoldersFromStorage()); // Обновляем список папок
        } catch (error) {
            alert(`Error uploading file: ${error.message}`);
        }
    };


    return (
        <div>
            <h1>Upload Image</h1>
            <input type="text" placeholder="Folder Name" value={folder} onChange={handleFolderChange} />
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default ImageUploadOnFolder;