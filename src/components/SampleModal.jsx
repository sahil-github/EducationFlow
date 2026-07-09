import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';


const bios = [
    "Passionate Full Stack Developer focused on building modern, scalable web applications and continuously learning new technologies.",
    "Tech enthusiast who enjoys solving real-world problems through clean code, innovative solutions, and continuous learning.",
    "Frontend developer dedicated to creating responsive, user-friendly interfaces with React and modern JavaScript.",
    "Aspiring software engineer passionate about web development, problem-solving, and building impactful digital products.",
    "Lifelong learner exploring web technologies, UI/UX design, and software engineering best practices every day."
];




export default function SampleModal({ open, onClose }) {
    const [scroll, setScroll] = React.useState('paper');

    const handleClickOpen = (scrollType) => () => {
        setScroll(scrollType);
    };


    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
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
                scroll={scroll}
            // aria-labelledby="scroll-dialog-title"
            // aria-describedby="scroll-dialog-description"
            >
                <DialogTitle id="scroll-dialog-title">Sample Bios</DialogTitle>
                <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        <Box>
                            {bios.map((value, index) =>
                            (
                                <div
                                    key={index}
                                >
                                    <p>{value}</p>
                                </div>
                            ))}
                        </Box>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    );
}