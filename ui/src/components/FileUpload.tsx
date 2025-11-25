'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaFile } from 'react-icons/fa';

interface FileUploadProps {
    onFileUpload: (file: File) => void;
    isUploading: boolean;
}

export default function FileUpload({ onFileUpload, isUploading }: FileUploadProps) {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            onFileUpload(acceptedFiles[0]);
        }
    }, [onFileUpload]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        disabled: isUploading,
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-4">
                <FaCloudUploadAlt className="text-5xl text-blue-500" />
                <div className="text-gray-600">
                    {isDragActive ? (
                        <p className="font-medium">Drop the file here...</p>
                    ) : (
                        <>
                            <p className="font-medium text-lg">Drag & drop a file here</p>
                            <p className="text-sm">or click to select a file</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
