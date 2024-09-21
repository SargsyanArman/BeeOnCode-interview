import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase';
import ImageUploader from './ImageUploader';
import ImageUploadOnFolder from './ImageUpLoadOnFolder';

const FolderView = () => {
    const { folderName } = useParams();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const folderRef = ref(storage, `${folderName}/`);
            const res = await listAll(folderRef);
            const imageUrls = await Promise.all(
                res.items.map(item => getDownloadURL(item))
            );
            setImages(imageUrls);
        } catch (err) {
            setError(err.message);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchImages();
    }, [folderName]);

    const handleUploadSuccess = () => {
        fetchImages(); // Обновляем список изображений после загрузки
    };

    if (loading) return <p>Loading images...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Images in folder: {folderName}</h2>
            <ImageUploadOnFolder initialFolder={folderName} onUploadSuccess={handleUploadSuccess} />
            <ImageUploader initialFolder={folderName} onUploadSuccess={handleUploadSuccess} />
            <div>
                {images.length > 0 ? (
                    images.map((url, index) => (
                        <img key={index} src={url} alt={`image-${index}`} width="200" />
                    ))
                ) : (
                    <p>No images found in this folder.</p>
                )}
            </div>
        </div>
    );
};

export default FolderView;