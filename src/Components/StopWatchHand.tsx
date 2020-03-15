import { createStyles, withStyles, WithStyles } from "@material-ui/core";
import React from "react";

interface IProps extends WithStyles<typeof styles> {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    y3: number;
    color: string;
    tipColor: string;
    rotation: number;
    visible: boolean;
}

const styles = createStyles({
    timerHand: {
        stroke: "yellow",
    },
    timerHandTip: {
        stroke: "red",
    },
});

const StopWatchHand: React.FC<IProps> = (props) => {
    return props.visible ? (
        <g id="timerHand" transform={`rotate(${props.rotation} 50 50)`}>
            <line
                id="timer"
                x1={props.x1}
                y1={props.y1}
                x2={props.x2}
                y2={props.y2}
                className={props.classes.timerHand}
            />
            <line
                id="timerTip"
                x1={props.x1}
                y1={props.y2}
                x2={props.x2}
                y2={props.y3}
                className={props.classes.timerHandTip}
            />
        </g>
    ) : null;
};

export default withStyles(styles)(StopWatchHand);
