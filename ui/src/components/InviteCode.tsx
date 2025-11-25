'use client';

import { FaCopy, FaCheck } from 'react-icons/fa';
import { useState } from 'react';

interface InviteCodeProps {
    code: string | null;
}

export default function InviteCode({ code }: InviteCodeProps) {
    const [copied, setCopied] = useState(false);

    if (!code) return null;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mt-8 p-6 bg-green-50 rounded-lg border border-green-200 text-center animate-fade-in">
            <h3 className="text-lg font-semibold text-green-800 mb-2">File Ready to Share!</h3>
            <p className="text-green-600 mb-4">Share this code with the recipient:</p>

            <div className="flex items-center justify-center space-x-3">
                <div className="text-4xl font-mono font-bold text-gray-800 tracking-wider bg-white px-6 py-3 rounded-md shadow-sm border border-green-100">
                    {code}
                </div>
                <button
                    onClick={copyToClipboard}
                    className="p-3 bg-white rounded-full shadow-sm border border-green-100 hover:bg-green-100 transition-colors text-green-600"
                    title="Copy to clipboard"
                >
                    {copied ? <FaCheck /> : <FaCopy />}
                </button>
            </div>
            <p className="text-xs text-green-500 mt-4">
                The recipient can download the file using this code.
            </p>
        </div>
    );
}
