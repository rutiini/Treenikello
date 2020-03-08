import { createStyles, Theme, WithStyles, withStyles } from "@material-ui/core";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import React from "react";

interface IProps extends WithStyles<typeof styles> {}

interface IState {
    selectedTab: number;
}

const styles = (theme: Theme) =>
    createStyles({
        root: {
            color: theme.palette.primary.main
        }
    });

const SimpleBottomNavigation: React.FC<IProps> = props => {
    const [selectedTab, setSelectedTab] = React.useState<number>(0);

    const handleChange = React.useCallback(
        (event: Event, updatedTab: number) => {
            setSelectedTab(updatedTab);
        },
        [setSelectedTab]
    );

    return (
        <BottomNavigation value={selectedTab}>
            <BottomNavigationAction
                classes={{ root: props.classes.root }}
                label="Workout"
                icon={<i className="material-icons">timer</i>}
            />
            <BottomNavigationAction
                classes={{ root: props.classes.root }}
                label="Sections"
                icon={<i className="material-icons">build</i>}
            />
            <BottomNavigationAction
                classes={{ root: props.classes.root }}
                label="Exercises"
                icon={<i className="material-icons">fitness_center</i>}
            />
        </BottomNavigation>
    );
};

export default withStyles(styles)(SimpleBottomNavigation);
