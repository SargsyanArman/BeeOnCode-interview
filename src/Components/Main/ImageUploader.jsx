import React, { useState } from 'react';
import { ref, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase';

const ImageUploader = ({ initialFolder }) => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleUpload = async () => {
        if (!file) return;

        const storageRef = ref(storage, `${initialFolder}/${file.name}`); // Здесь используем путь к субкаталогу
        setUploading(true);
        setError(null);

        try {
            await uploadBytes(storageRef, file);
            alert('Upload successful!');
            setFile(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {error && <p>Error: {error}</p>}
        </div>
    );
};

export default ImageUploader;
