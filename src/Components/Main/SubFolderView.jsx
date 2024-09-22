import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageUpLoaderSubFolder from './ImageUpLoaderSubFolder';
import ImagesList from './ImagesList';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import { storage } from '../../firebase';

const SubFolderView = () => {
    const { folderName, subFolderName } = useParams();
    const [images, setImages] = useState([]);

    const fetchImages = async () => {
        const subFolderRef = ref(storage, `${folderName}/${subFolderName}/`);
        const res = await listAll(subFolderRef);
        const imageUrls = await Promise.all(res.items.map(item => getDownloadURL(item)));
        setImages(imageUrls);
    };


    useEffect(() => {
        fetchImages();
    }, [folderName, subFolderName]);

    return (
        <div>
            <h3>Subfolder: {subFolderName}</h3>
            <ImageUpLoaderSubFolder initialFolder={`${folderName}/${subFolderName}`} onUpload={fetchImages} />
            <ImagesList images={images} />
        </div>
    );
};

export default SubFolderView;
