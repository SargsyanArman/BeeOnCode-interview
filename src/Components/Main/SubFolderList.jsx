import React from 'react';
import { Link } from 'react-router-dom';

const SubfolderList = ({ folders }) => {
    if (folders.length === 0) {
        return <p>No subfolders found.</p>;
    }

    return (
        <div>
            <h3>Subfolders</h3>
            {folders.map((subfolderPath, index) => (
                <div key={index}>
                    <Link to={`/folder/${subfolderPath}`} className="text-blue-600 hover:underline">
                        {subfolderPath.split('/').pop()}
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default SubfolderList;
