import React from "react";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
export default function SelectField({
    label,
    name,
    value,
    options,
    placeholder,
    onChange,
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-white text-sm font-medium font-[Manrope]">
                {label}
            </label>

            <select
                name={name}
                value={value}
                onChange={onChange}
                className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/40 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500/50 text-sm transition-all font-[Manrope] cursor-pointer"
            >
                <option value="" disabled className="bg-[#16161A] text-gray-500 p-2">
                    {placeholder}
                </option>

                {options.map((option) => (
                    <option
                        key={option}
                        value={option}
                        className="bg-[#16161A] text-white p-2"
                    >
                        {option}
                    </option>
                ))}
            </select>
        </div>
        // <FormControl fullWidth>
        //     <InputLabel>Profession</InputLabel>

        //     <Select
        //         value={value}
        //         onChange={handleChange}
        //         IconComponent={KeyboardArrowDownIcon}
        //         MenuProps={{
        //             PaperProps: {
        //                 sx: {
        //                     maxHeight: 300,
        //                 },
        //             },
        //         }}
        //     >
        //         {options.map(option => (
        //             <MenuItem key={option} value={option}>
        //                 {option}
        //             </MenuItem>
        //         ))}
        //     </Select>
        // </FormControl>
    );
}