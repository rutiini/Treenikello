import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem } from 'material-ui/List';
import Button from 'material-ui/Button';
import SectionListItem from './SectionListItem';

const styles = theme => ({
  root: {
    // width: '100%',
    height: 300,
    backgroundColor: theme.palette.background.paper,
    // justify: 'center'
  },
  nav:{
    // height: 'inherit',
    // overflowY: 'auto'
  },
  listItem: {
    width: '100%',
    textAlign: 'center',
    justifyContent: 'center'
  },
  listCard: {
    width: '100%'
  }
});

function SectionListTab(props) {
  const { classes, 
          exercise, 
          moveUp, 
          moveDown, 
          deleteSection, 
          update,
          handleSectionEditToggle } = props;
  // const draftsIcon = <i className="material-icons">drafts</i>
  // const inboxIcon = <i className="material-icons">inbox</i>
  
  
    const sections = exercise.defaultSections.map((sectionItem,index) => {
      let inputBoxKey = sectionItem.key;
      // MUI style elments
      return (
        <ListItem className={classes.listItem} key={inputBoxKey}>
        <SectionListItem className={classes.listCard}
        section={sectionItem} 
        moveUp={moveUp} 
        moveDown={moveDown} 
        update={update} 
        deleteSection={deleteSection}
        handleSectionEditToggle={handleSectionEditToggle}
        />
        </ListItem>
      )
    })
    
  return (
    <div className={classes.root}>
    <List component="nav" className={classes.nav}>
    {sections}
    <ListItem className={classes.listItem} key="add-section-button">
    <Button variant="fab" size="medium" color="secondary" aria-label="add" onClick={handleSectionEditToggle}><i className="material-icons">add</i></Button>
    </ListItem>
    
    </List>
    </div>
  );
}

SectionListTab.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SectionListTab);