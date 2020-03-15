import { IconButton, Snackbar } from "@material-ui/core";
import React from "react";

interface IProps {
    handleHide: (event: any, reason?: string) => void;
    open: boolean;
}

const NotificationSnackBar: React.FC<IProps> = (props) => {
    const { handleHide, open } = props;
    return (
        <Snackbar
            anchorOrigin={{
                horizontal: "left",
                vertical: "top",
            }}
            open={open}
            autoHideDuration={4000}
            onClose={handleHide}
            message={<span id="message-id">Saved exercises</span>}
            action={[
                <IconButton key="close" aria-label="Close" color="inherit" onClick={handleHide}>
                    <i className="material-icons">close</i>
                </IconButton>,
            ]}
        />
    );
};

export default NotificationSnackBar;
