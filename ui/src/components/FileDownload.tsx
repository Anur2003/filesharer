'use client';

import { useState } from 'react';
import { FaDownload } from 'react-icons/fa';

interface FileDownloadProps {
    onDownload: (code: string) => void;
    isDownloading: boolean;
}

export default function FileDownload({ onDownload, isDownloading }: FileDownloadProps) {
    const [code, setCode] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (code.trim().length > 0) {
            onDownload(code.trim().toUpperCase());
        } else {
            alert('Please enter a valid share code');
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="invite-code" className="block text-sm font-medium text-gray-700 mb-1">
                        Enter Share Code
                    </label>
                    <input
                        id="invite-code"
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="e.g., A7X9P2"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase font-mono"
                        disabled={isDownloading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={isDownloading || !code}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FaDownload />
                    <span>{isDownloading ? 'Downloading...' : 'Download File'}</span>
                </button>
            </form>
        </div>
    );
}
