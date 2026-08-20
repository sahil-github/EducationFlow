import React from 'react';

export default function SettingsActionBar({ onDiscard, onSave, loading }) {
    return (
        <div className="w-full flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-4 pb-12">
            <button
                type="button"
                onClick={onDiscard}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-[#94A3B8] hover:text-white transition-colors cursor-pointer disabled:opacity-50 font-[Poppins] text-center"
            >
                Discard Changes
            </button>

            <button
                type="button"
                onClick={onSave}
                disabled={loading}
                className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold bg-[#1D61E7] hover:bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50 font-[Poppins] text-center"
            >
                {loading ? 'Saving Updates...' : 'Save All Updates'}
            </button>
        </div>
    );
}
