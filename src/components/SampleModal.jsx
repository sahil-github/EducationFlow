import React, { useEffect, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';
import { bios } from '../constants/constants';


export default function SampleModal({ open, onClose, onSelectSample }) {


    const descriptionElementRef =useRef(null);
    useEffect(() => {
        if (open) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [open]);

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                scroll="paper"
                PaperProps={{
                    sx: {
                        backgroundColor: '#1E1E2A',
                        color: '#fff',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        maxWidth: '500px'
                    }
                }}
            >
                <DialogTitle id="scroll-dialog-title" sx={{ fontFamily: 'Poppins', fontWeight: 600 }}>Sample Bios</DialogTitle>
                <DialogContent dividers>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <Box>
                            {bios.map((value, index) =>
                            (
                                <div
                                    className="py-4 border-b border-white/10 last:border-b-0 cursor-pointer group transition-all duration-200 hover:bg-white/5 px-4 -mx-4 rounded-xl"
                                    key={index}
                                    onClick={() => {
                                        onSelectSample(value);
                                        onClose();
                                    }}
                                >
                                    <p
                                        className="text-[14px] leading-relaxed text-[#C7C4D8] font-normal italic font-manrope group-hover:text-white transition-colors"
                                    >{value}</p>
                                </div>
                            ))}
                        </Box>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    );
}