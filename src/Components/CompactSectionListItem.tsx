import { createStyles, IconButton, WithStyles, withStyles } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import React from "react";
import { ISection } from "../DataInterfaces";

const styles = createStyles({
    content: {
        width: "100%",
        userSelect: "none",
        display: "flex",
        flexDirection: "row",
        justifyItems: "space-between",
        maxHeight: "50px",
        overflow: "hidden",
        justifyContent: "center",
        textAlign: "center",
        cursor: "grab",
    },
    rightContainer: {
        width: "15%",
    },
    leftContainer: {
        width: "15%",
    },
    middleContainer: {
        width: "70%",
    },
});

interface IProps extends WithStyles {
    section: ISection;
    index: number;
    editSection: (section: ISection) => void;
}

/**
 * This is an evolved version for the sectionList item which has a cumbersome look and does not scale
 * well to mobile UI.
 * Role of this component is to serve as the content of a list item representing an exercise sections properties
 */
const CompactSectionListItem: React.FC<IProps & WithStyles> = (props: IProps) => {
    const { classes, editSection, section } = props;
    const { setupTime, duration, name, description } = section;

    const editSectionClicked = React.useCallback(
        (e: never) => {
            editSection(section);
        },
        [editSection, section],
    );

    const text = `${name} | ${setupTime} | ${duration}`;
    return (
        <div className={classes.content}>
            <div className={classes.leftContainer}>{/*TODO: section icon here when added*/}</div>
            <div className={classes.middleContainer}>
                <Typography variant="h5" className={classes.justifyCenter}>
                    {text}
                </Typography>
                <div style={{ overflow: "ellipsis" }}>{description}</div>
            </div>
            <div className={classes.rightContainer}>
                <IconButton onClick={editSectionClicked}>
                    <i className="material-icons">edit</i>
                </IconButton>
            </div>
        </div>
    );
};

export default withStyles(styles)(CompactSectionListItem);
