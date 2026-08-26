import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

export default function SubmitQuizDialog({
    open = false,
    onClose,
    onConfirm,
    answeredCount = 0,
    totalQuestions = 15,
    isSubmitting = false,
}) {
    const unansweredCount = Math.max(0, totalQuestions - answeredCount);

    return (
        <Dialog
            open={open}
            onClose={isSubmitting ? undefined : onClose}
            PaperProps={{
                sx: {
                    backgroundColor: "#161B26",
                    color: "#fff",
                    borderRadius: "1.25rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                    padding: "1rem",
                    maxWidth: "420px",
                    width: "100%",
                },
            }}
        >
            <div className="flex items-center gap-3 mb-2 px-3 pt-2">
                <div className="w-10 h-10 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                    <HelpOutlineIcon sx={{ fontSize: 22 }} />
                </div>
                <DialogTitle
                    sx={{
                        padding: 0,
                        color: "#fff",
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                        fontSize: "1.125rem",
                    }}
                >
                    Submit Quiz?
                </DialogTitle>
            </div>

            <DialogContent sx={{ px: 3, py: 1.5 }}>
                <p className="text-xs text-gray-300 font-[Manrope] leading-relaxed">
                    You have answered{" "}
                    <strong className="text-indigo-400 font-semibold font-[Poppins]">
                        {answeredCount} of {totalQuestions}
                    </strong>{" "}
                    questions.
                </p>

                {unansweredCount > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-300 font-[Manrope]">
                        <WarningAmberIcon sx={{ fontSize: 18, shrink: 0, color: "#F59E0B" }} />
                        <span>
                            {unansweredCount} question{unansweredCount > 1 ? "s" : ""} will be marked as incorrect if you submit now.
                        </span>
                    </div>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 2, gap: 1 }}>
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 hover:text-white text-xs font-semibold font-[Poppins] transition-all cursor-pointer disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={onConfirm}
                    className="flex-1 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold font-[Poppins] transition-all shadow-lg shadow-[#6366F1]/20 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                    {isSubmitting ? "Submitting..." : "Submit Quiz"}
                </button>
            </DialogActions>
        </Dialog>
    );
}
