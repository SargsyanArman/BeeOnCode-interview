import React from 'react';

const ImageList = ({ images }) => {

    return (
        <div>
            <h3>Images</h3>
            {images.map((url, index) => (
                <img key={index} src={url} alt={`image-${index}`} width="200" />
            ))}
        </div>
    );
};

export default ImageList;
