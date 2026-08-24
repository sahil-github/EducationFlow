import React, { useState, useMemo, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import AddIcon from '@mui/icons-material/Add';

/**
 * ItemSelectorModal
 *
 * Reusable modal for editing Skills, Interests, and Learning Goals.
 * Faithfully matches the provided reference screenshot design.
 *
 * Props:
 *   isOpen       - boolean
 *   onClose      - () => void (cancels changes and closes)
 *   onSave       - (selectedItems: string[]) => Promise<void> | void
 *   title        - string (e.g. "Edit Skills & Expertise")
 *   subtitle     - string (e.g. "Update your skills & expertise")
 *   initialItems - string[] (currently selected items from profile)
 *   availableItems - string[] (all available preset options)
 *   allowCustom  - boolean (allow user to add arbitrary custom tags)
 *   saving       - boolean
 */
export default function ItemSelectorModal({
    isOpen,
    onClose,
    onSave,
    title = "Edit Skills & Expertise",
    subtitle = "Update your skills & expertise",
    initialItems = [],
    availableItems = [],
    allowCustom = true,
    saving = false,
}) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [modalItems, setModalItems] = useState([]);
    // Reset local selection when modal opens with fresh initialItems
    useEffect(() => {
        if (!isOpen) return;

        const available = Array.isArray(availableItems)
            ? availableItems
            : [];

        const selected = Array.isArray(initialItems)
            ? initialItems
            : [];

        // Take a snapshot when modal opens.
        // Parent changes to availableItems while modal is open
        // will NOT remove items from this modal.
        const uniqueItems = Array.from(
            new Set([...available, ...selected])
        );

        setModalItems(uniqueItems);
        setSelectedItems([...selected]);
        setSearchQuery("");
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen && !saving) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, saving]);

    // Union of all available presets + any already-selected custom items
    const allKnownItems = useMemo(() => {
        return Array.from(
            new Set([...modalItems, ...selectedItems])
        );
    }, [modalItems, selectedItems]);

    // Filter items based on search query
    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return allKnownItems;
        return allKnownItems.filter((item) =>
            item.toLowerCase().includes(query)
        );
    }, [allKnownItems, searchQuery]);

    const isExactMatch = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return allKnownItems.some((item) => item.toLowerCase() === query);
    }, [allKnownItems, searchQuery]);

    const toggleItem = (item) => {
        setSelectedItems((prev) => {
            if (prev.includes(item)) {
                return prev.filter((i) => i !== item);
            }
            return [...prev, item];
        });
    };

    const handleAddCustom = () => {
        const trimmed = searchQuery.trim();
        if (!trimmed) return;
        if (!selectedItems.includes(trimmed)) {
            setSelectedItems((prev) => [...prev, trimmed]);
        }
        setSearchQuery('');
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!isExactMatch && allowCustom && searchQuery.trim()) {
                handleAddCustom();
            } else if (filteredItems.length > 0) {
                toggleItem(filteredItems[0]);
            }
        }
    };

    const handleSave = () => {
        if (onSave) {
            onSave(selectedItems);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn">
            {/* Modal Container */}
            <div
                className="w-full max-w-2xl bg-[#121318] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-hidden animate-scaleUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-white font-bold text-2xl font-[Poppins] tracking-tight">
                            {title}
                        </h2>
                        <p className="text-[#94A3B8] text-xs sm:text-sm font-[Manrope]">
                            {subtitle}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="text-[#94A3B8] hover:text-white p-1 rounded-xl hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
                        title="Close"
                    >
                        <CloseIcon sx={{ fontSize: 22 }} />
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                        <SearchIcon sx={{ fontSize: 20 }} />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyDown}
                        placeholder="Search..."
                        autoFocus
                        className="w-full bg-[#16171D] border border-white/10 text-white rounded-2xl pl-10 pr-4 py-3 text-sm font-[Manrope] focus:outline-none focus:border-blue-500 transition-all placeholder-gray-500"
                    />
                </div>

                {/* Chips Grid (Scrollable) */}
                <div className="flex-1 overflow-y-auto pr-1 flex flex-wrap gap-2.5 max-h-[360px] scrollbar-thin">
                    {filteredItems.map((item) => {
                        const isSelected = selectedItems.includes(item);
                        return (
                            <button
                                key={item}
                                type="button"
                                onClick={() => toggleItem(item)}
                                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer select-none ${isSelected
                                    ? 'bg-[#fff] text-[#121318] shadow-md hover:bg-[#fff]'
                                    : 'bg-[#181B22] hover:bg-[#181B22] text-white border border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <span>{item}</span>
                                {isSelected ? (
                                    <CheckIcon sx={{ fontSize: 16, strokeWidth: 2.5 }} />
                                ) : (
                                    <AddIcon sx={{ fontSize: 16, color: '#94A3B8' }} />
                                )}
                            </button>
                        );
                    })}

                    {/* Add Custom Tag Option */}
                    {allowCustom && searchQuery.trim() && !isExactMatch && (
                        <button
                            type="button"
                            onClick={handleAddCustom}
                            className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-semibold border border-dashed border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <AddIcon sx={{ fontSize: 16 }} />
                            <span>Add &ldquo;{searchQuery.trim()}&rdquo;</span>
                        </button>
                    )}

                    {filteredItems.length === 0 && !searchQuery.trim() && (
                        <div className="w-full py-8 text-center text-gray-500 text-xs font-[Manrope]">
                            No items available.
                        </div>
                    )}
                </div>

                {/* Footer / Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/5">
                    <span className="text-[#94A3B8] text-xs font-[Manrope] self-center sm:self-auto">
                        {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
                    </span>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-semibold text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all cursor-pointer disabled:opacity-50 font-[Poppins]"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#1D61E7] hover:bg-blue-600 text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50 font-[Poppins] flex items-center justify-center gap-2"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
