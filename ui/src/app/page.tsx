'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import FileDownload from '@/components/FileDownload';
import InviteCode from '@/components/InviteCode';
import axios from 'axios';

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');

  const handleFileUpload = async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setCode(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Use the configured API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await axios.post(`${apiUrl}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Backend now returns { "code": "ABC123" }
      setCode(response.data.code);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (code: string) => {
    setIsDownloading(true);

    try {
      // Request download from Java backend using the code
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiUrl}/download/${code}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Try to get filename from response headers
      const contentDisposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition');
      let filename = 'downloaded-file';

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file. Please check the share code and try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-blue-600 mb-4 tracking-tight">FileSharer</h1>
          <p className="text-xl text-gray-600">Secure, Direct P2P File Sharing</p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              className={`flex-1 py-4 text-center font-semibold text-lg transition-colors ${activeTab === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => setActiveTab('upload')}
            >
              Share a File
            </button>
            <button
              className={`flex-1 py-4 text-center font-semibold text-lg transition-colors ${activeTab === 'download'
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => setActiveTab('download')}
            >
              Receive a File
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'upload' ? (
              <div className="animate-fade-in">
                <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />

                {uploadedFile && !isUploading && !code && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800">Selected File:</p>
                      <p className="text-blue-600 truncate max-w-xs">{uploadedFile.name}</p>
                    </div>
                    <span className="text-xs text-blue-500 font-mono bg-white px-2 py-1 rounded border border-blue-100">
                      {Math.round(uploadedFile.size / 1024)} KB
                    </span>
                  </div>
                )}

                {isUploading && (
                  <div className="mt-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-3 text-gray-600 font-medium">Uploading file...</p>
                  </div>
                )}

                <InviteCode code={code} />
              </div>
            ) : (
              <div className="animate-fade-in py-8">
                <FileDownload onDownload={handleDownload} isDownloading={isDownloading} />

                {isDownloading && (
                  <div className="mt-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
                    <p className="mt-3 text-gray-600 font-medium">Downloading file...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>PeerLink &copy; {new Date().getFullYear()} - Built with Java 21 & Next.js 14</p>
        </footer>
      </div>
    </div>
  );
}
