import React, { forwardRef, useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Input = forwardRef(
    ({ className = "", error, leftIcon, label, rightElement, type, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const isPassword = type === "password";
        const inputType = isPassword && showPassword ? "text" : type;

        return (
            <div className="w-full space-y-1.5">
                {/* Label row */}
                {(label || rightElement) && (
                    <div className="flex items-center justify-between">
                        {label && (
                            <label
                                className="text-white text-sm font-medium"
                                style={{ fontFamily: "Manrope" }}
                            >
                                {label}
                            </label>
                        )}
                        {rightElement && <div>{rightElement}</div>}
                    </div>
                )}

                {/* Input field */}
                <div className="relative flex items-center">
                    {leftIcon && (
                        <div className="absolute left-4 flex items-center justify-center text-white/40 pointer-events-none">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        ref={ref}
                        type={inputType}
                        {...props}
                        className={`w-full
                        ${leftIcon ? "pl-11" : "px-4"}
                        ${isPassword ? "pr-11" : "pr-4"}
                        py-2
                        rounded-xl
                        border
                        ${error ? "border-red-500" : "border-white/10"}
                        focus:outline-none
                        focus:ring-1
                        ${error ? "focus:ring-red-500/50" : "focus:ring-indigo-500/50"}
                        text-sm
                        transition-all
                        placeholder:text-gray-500
                        ${className}
                        `}
                    />

                    {/* Password toggle */}
                    {isPassword && (
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-4 flex items-center justify-center text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                            tabIndex={-1}
                        >
                            {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                        </button>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <p className="ml-1 text-[11px] font-medium text-red-500">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
