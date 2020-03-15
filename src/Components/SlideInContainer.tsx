import * as React from "react";
import { createStyles, Theme, withStyles, WithStyles } from "@material-ui/core";

const styles = (theme: Theme) =>
    createStyles({
        root: {
            overflow: "hidden",
            userSelect: "none",
            height: "100%"
        },
        list: {
            "height": "100%",
            "overflow": "auto",
            "transition": "transform 300ms ease-in-out",
            "$root.expanded>&": {
                transform: "translateY(-100%)",
                overflow: "auto"
            }
        },
        editor: {
            "height": "100%",
            "overflow": "auto",
            "transition": "transform 300ms ease-in-out",
            "$root.expanded>&": {
                transform: "translateY(-100%)"
            }
        }
    });

    /** A wrapper component to work as an animated slide in component */
const SlideInContainer: React.FC<{ open: boolean } & WithStyles> = (props) => {
    const childrenArray = React.Children.toArray(props.children);
    if (childrenArray.length !== 2) {
        throw new Error("SlideInContainer requires exactly 2 children!");
    }

    return (
        <div className={`${props.classes.root} ${props.open ? "expanded" : "collapsed"}`}>
            <div className={props.classes.list}>{childrenArray[0]}</div>
            <div className={props.classes.editor}>{childrenArray[1]}</div>
        </div>
    );
};

export default withStyles(styles)(SlideInContainer);
