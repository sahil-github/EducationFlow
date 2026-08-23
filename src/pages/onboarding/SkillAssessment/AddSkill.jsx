import React, { useState } from 'react';

import Button from '../../../components/Button';

function AddSkill({ open, onClose, onAddSkill }) {
    const [skillName, setSkillName] = useState('');

    if (!open) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        onAddSkill(skillName);

        setSkillName('');
    };

    const handleClose = () => {
        setSkillName('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
            <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-[#171923] p-6 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-white font-[Poppins]">
                        Add another skill
                    </h2>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-white text-xl"
                    >
                        ×
                    </button>

                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>

                    <label className="block text-sm text-gray-300 mb-2 font-[Manrope]">
                        Skill name
                    </label>

                    <input
                        type="text"
                        value={skillName}
                        onChange={(e) => setSkillName(e.target.value)}
                        placeholder="e.g. React, Java, Node.js"
                        autoFocus
                        className="w-full rounded-xl border border-gray-700 bg-[#0F172A] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-500 focus:border-[#6366F1]"
                    />

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6">

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleClose}
                            className="px-4 py-2 text-sm text-gray-400"
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            variant="primary"
                            disabled={!skillName.trim()}
                            className="px-5 py-2 rounded-xl bg-[#6366F1] text-white text-sm disabled:opacity-50"
                        >
                            Add Skill
                        </Button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddSkill;