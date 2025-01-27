import { useCallback, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            marginBottom: theme.spacing(1),
        },
    },
    mediaField: {
        cursor: 'pointer',
        '& input': {
            cursor: 'pointer'
        }
    }
}));

export default function AnkiDialog(props) {
    const classes = useStyles();
    const {open, disabled, text: initialText, onProceed, onCancel, onViewImage, audioClip, image, source} = props;
    const [definition, setDefinition] = useState("");
    const [text, setText] = useState();
    const [word, setWord] = useState();

    useEffect(() => {
        setText(initialText);
    }, [initialText]);

    useEffect(() => {
        if (open) {
             setDefinition("");
             setWord("");
        }
    }, [open]);

    const handlePlayAudio = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        audioClip.play();
    }, [audioClip]);

    const handleViewImage = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        onViewImage(image);
    }, [image, onViewImage]);

    return (
        <Dialog
            open={open}
            disableEnforceFocus
            fullWidth
            maxWidth="sm"
            onBackdropClick={() => onCancel()}
        >
            <DialogTitle>Anki Export</DialogTitle>
            <DialogContent>
                <form className={classes.root}>
                    <TextField
                        variant="filled"
                        multiline
                        fullWidth
                        rowsMax={8}
                        label="Sentence"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <TextField
                        variant="filled"
                        multiline
                        fullWidth
                        rows={8}
                        label="Definition"
                        value={definition}
                        onChange={(e) => setDefinition(e.target.value)}
                    />
                    <TextField
                        variant="filled"
                        fullWidth
                        label="Word"
                        value={word}
                        onChange={(e) => setWord(e.target.value)}
                    />
                    {audioClip && (
                        <div
                            className={classes.mediaField}
                            onClick={handlePlayAudio}
                        >
                            <TextField
                                variant="filled"
                                fullWidth
                                value={audioClip.name}
                                label="Audio"
                            />
                        </div>
                    )}
                    {image && (
                        <div
                            className={classes.mediaField}
                            onClick={handleViewImage}
                        >
                            <TextField
                                variant="filled"
                                fullWidth
                                value={image.name}
                                label="Image"
                            />
                        </div>
                    )}
                    <TextField
                        variant="filled"
                        fullWidth
                        label="Source"
                        value={source}
                    />
                </form>
            </DialogContent>
            <DialogActions>
                <Button
                    disabled={disabled}
                    onClick={() => onCancel()}>
                    Cancel
                </Button>
                <Button
                    disabled={disabled}
                    onClick={() => onProceed(text, definition, audioClip, image, word, source)}
                >
                    Export
                </Button>
            </DialogActions>
        </Dialog>
    );
}