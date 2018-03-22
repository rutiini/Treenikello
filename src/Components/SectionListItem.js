import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  card: {
    minWidth: '100%'
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  button: {
    marginRight: 10,
  },
  moveButton: {
    cursor: 'pointer'
  }
});


function SectionListItem(props) {
  const { classes,
    section, 
    moveUp, 
    moveDown, 
    deleteSection, 
    update,
    handleSectionEditToggle } = props;
    
    // open edit dialog from button
    const openEdit = () => {
      handleSectionEditToggle(section);
    }
    const deleteSelf = () => {
      deleteSection(section)
    }
    
    return (
      <Card className={classes.card}>
      <i className={`material-icons ${classes.moveButton}`} onClick={() => moveUp(section) } >arrow_upward</i>
      <CardContent>
      <Typography variant="headline" component="h2">
      {section.name}
      </Typography>
      <Typography className={classes.pos}>{`${section.duration} min`}</Typography>
      <Typography component="p">
      {section.description}
      </Typography>
      </CardContent>
      <CardActions>
      <Button variant="fab" className={classes.button} mini style={{backgroundColor: section.color}} onClick={deleteSelf}>
      <i className="material-icons">delete</i>
      </Button>
      <Button variant="fab" mini style={{backgroundColor: section.color}} onClick={openEdit}>
      <i className="material-icons">settings</i>
      </Button>
      </CardActions>
      <i className={`material-icons ${classes.moveButton}`} onClick={() => moveDown(section) }>arrow_downward</i>
      </Card>
    );
  }
  
  SectionListItem.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(SectionListItem);