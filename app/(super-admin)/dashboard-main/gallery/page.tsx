"use client"
import { apiUrl } from '@/lib/apiConfig';
import React, { useContext, useEffect, useState } from 'react';
import { GlobalStateContext } from '../../layout';
import { useRouter } from 'next/navigation';
import { getMediaUrlPath } from '@/lib/mediaUrl';

const Gallery = () => {
    const [mediaFiles, setMediaFiles] = useState<File[]>([]);
    const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
    const { setglobalState } = useContext<any>(GlobalStateContext);
    const [dragOver, setDragOver] = useState(false);
    const router = useRouter();
    useEffect(() => {
        getGallery();
    }, []);


    // Get all media
    const getGallery = async () => {
        try {
            let adminToken = localStorage.getItem("adminToken")
            const response = await fetch(`${apiUrl}/admin/post/getGallery`, {
                method: "GET",
                headers: { Authorization: "Bearer " + adminToken }
            });
            if (response.ok) {
                const data = await response.json();
                setMediaFiles(data.rows)
                // window.location.href = "/dashboard/create-post"; // Navigate to create post
            } else {
                console.error("Upload failed.");
            }

        } catch (error) {
            console.error("Error:", error);
        }

    };
    // delete single media
    const deleteSingleMedia = async (fileId: string, filePath: string, usedInArticle: boolean) => {
        try {
            let adminToken = localStorage.getItem("adminToken")
            const response = await fetch(`${apiUrl}/admin/post/deleteSingleMedia/${fileId}/${filePath}/${usedInArticle}`, {
                method: "DELETE",
                headers: { Authorization: "Bearer " + adminToken }
            });

            if (response.ok) {
                getGallery();
                // window.location.href = "/dashboard/create-post"; // Navigate to create post
            } else {
                console.error("Upload failed.");
            }

        } catch (error) {
            console.error("Error:", error);
        }

    };
    // Handle file drop in drag-and-drop area
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        const files = Array.from(e.dataTransfer.files);
        setMediaFiles((prev) => [...prev, ...files]);
    };

    // Handle drag over effect
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(true);
    };

    // Handle drag leave effect
    const handleDragLeave = () => {
        setDragOver(false);
    };

    // Handle file upload from input
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setMediaFiles((prev) => [...prev, ...filesArray]);
            const formData = new FormData();
            filesArray.forEach((file) => {
                formData.append("files", file); // 'images' should match the field name used in multer
            });

            try {
                let adminToken = localStorage.getItem("adminToken")
                const response = await fetch(`${apiUrl}/admin/post/upload`, {
                    method: "POST",
                    body: formData,
                    headers: { Authorization: "Bearer " + adminToken }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data.message); // Handle success response
                    getGallery();
                    // window.location.href = "/dashboard/create-post"; // Navigate to create post
                } else {
                    console.error("Upload failed.");
                }

            } catch (error) {
                console.error("Error:", error);
            }
        } else {
            return
        }
    };

    // Handle media selection
    const handleSelectMedia = (file: File) => {
        setSelectedMedia((prev) => {
            if (prev.includes(file)) {
                return prev.filter((item) => item !== file);
            }
            return [...prev, file];
        });
    };

    // Handle media removal
    const handleRemoveMedia = async (fileId: string, filePath: string, usedInArticle: boolean) => {
        await deleteSingleMedia(fileId, filePath, usedInArticle)
    };


    const handleSaveSelection = async () => {
        setglobalState({ mediaItems: selectedMedia });
        let oldRoute = localStorage.getItem("oldRoute");
        router.push(`${oldRoute}`)
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 pt-20">
            <h1 className="text-2xl font-bold mb-5 text-center">Manage Media Gallery</h1>

            {/* Drag-and-drop area */}
            <div
                className={`border-2 border-dashed rounded-lg p-10 text-center mb-5 transition ${dragOver ? 'border-blue-500 bg-blue-100' : 'border-gray-300'
                    }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <p className="text-gray-500 mb-3">Drag & drop files here or</p>
                <label htmlFor="file-upload" className="bg-blue-500 text-white py-2 px-4 rounded cursor-pointer">
                    Browse Files
                </label>
                <input
                    id="file-upload"
                    type="file"
                    name='files'
                    multiple
                    accept="image/*,video/*" // This allows all file types
                    onChange={handleFileUpload}
                    className="hidden"
                />
            </div>

            {/* Display uploaded media */}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
                {mediaFiles && mediaFiles.map((file: any, index) => (
                    <div
                        key={index}
                        className={`relative border-2 rounded-lg overflow-hidden cursor-pointer transition ${selectedMedia.includes(file) ? 'border-blue-500' : 'border-transparent'
                            }`}
                        onClick={() => handleSelectMedia(file)}
                    >
                        {true ? (
                            <img
                                src={
                                    getMediaUrlPath(file.filePath)}
                                alt="Uploaded"
                                className="w-full h-40 object-cover border-2"
                            />
                        ) : (
                            <video controls className="w-full h-40 object-cover border-2">
                                <source src={getMediaUrlPath(file.filePath)} type={file.type} />
                            </video>
                        )}
                        {/* Selected indicator */}
                        {selectedMedia.includes(file) && (
                            <span className="absolute top-2 right-2 px-3 bg-blue-500 text-white rounded-full p-1">
                                ✔
                            </span>
                        )}
                        {/* Remove button */}
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent click from selecting the file
                                handleRemoveMedia(file.id, file.filePath, file.usedInArticle);
                            }}
                            className="absolute bottom-2 p-2 opacity-60 hover:opacity-90 right-2 bg-black text-white rounded-full border transition"
                        >
                            <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" id="Cross-2--Streamline-Radix" height="16" width="16"><desc>Cross 2 Streamline Icon: https://streamlinehq.com</desc><path fill-rule="evenodd" clip-rule="evenodd" d="M12.567039999999999 4.300341333333334c0.23957333333333333 -0.23951999999999998 0.23957333333333333 -0.6278613333333334 0 -0.8673813333333332 -0.23946666666666666 -0.23951999999999998 -0.62784 -0.23951999999999998 -0.8673066666666667 0L8.000053333333334 7.132608 4.300416 3.43296c-0.23953066666666667 -0.23951999999999998 -0.627872 -0.23951999999999998 -0.867392 0 -0.23951999999999998 0.23951999999999998 -0.23951999999999998 0.6278613333333334 0 0.8673813333333332l3.699648 3.699648 -3.699648 3.6996373333333334c-0.23951999999999998 0.23957333333333333 -0.23951999999999998 0.62784 0 0.8674133333333334 0.23951999999999998 0.23946666666666666 0.6278613333333334 0.23946666666666666 0.867392 0l3.6996373333333334 -3.6996693333333335 3.69968 3.6996693333333335c0.23946666666666666 0.23946666666666666 0.62784 0.23946666666666666 0.8673066666666667 0 0.23957333333333333 -0.23957333333333333 0.23957333333333333 -0.62784 0 -0.8674133333333334L8.867434666666666 7.999989333333334l3.699605333333333 -3.699648Z" fill="#ffffff" stroke-width="1"></path></svg>
                        </button>
                    </div>
                ))}
            </div>


            {/* Save selection button */}
            {selectedMedia.length > 0 && (
                <button
                    onClick={handleSaveSelection}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                >
                    Save and Continue
                </button>
            )}
        </div>
    );
};

export default Gallery;
