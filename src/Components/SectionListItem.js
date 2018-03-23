import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  card: {
    minWidth: '100%',
    height: 175
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  content: {
    display: 'flex'
  },
  iconContainer: {
    height: '100%',
    width: '20%'
  },
  textContainer:{
    height: '100%',
    width: '60%',
    userSelect: 'none',
  },
  buttonContainer:{
    height: '100%',
    width: '20%'
  },
  pos: {
    marginTop: 12,
    // marginBottom: 12,
    color: theme.palette.text.secondary,
  },
  button: {
    marginRight: 10,
  },
  moveButton: {
    cursor: 'pointer'
  },
  cover: {
    width: 151,
    height: 151,
  },
  description:{
    display: 'block',
    overflow: 'hidden',
    // whiteSpace: 'nowrap',
    // textOverflow: 'ellipsis',
    height: 60
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
      <CardContent className={classes.content}>
      {/* left edge icon */}
      <div className={classes.iconContainer}>
        <i className="material-icons" style={{fontSize: 60, color: section.color, textShadow: '2px 3px 10px black'}}>directions_run</i>
      <Typography className={classes.pos}>{`${section.duration} min`}</Typography>
      </div>
      {/* text part */}
      <div className={classes.textContainer}>
      <Typography variant="headline" component="h2">
      {section.name}
      </Typography>
      <Typography component="p" className={classes.description}>
      {section.description}
      </Typography>
      </div>
      {/* buttons part */}
      <div className="buttonContainer">
      <CardActions>
      <Button variant="fab" className={classes.button} mini style={{backgroundColor: section.color}} onClick={deleteSelf}>
      <i className="material-icons">delete</i>
      </Button>
      <Button variant="fab" mini style={{backgroundColor: section.color}} onClick={openEdit}>
      <i className="material-icons">settings</i>
      </Button>
      </CardActions>
      </div>
      </CardContent>
      <i className={`material-icons ${classes.moveButton}`} onClick={() => moveDown(section) }>arrow_downward</i>
      </Card>
    );
  }

  SectionListItem.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  export default withStyles(styles)(SectionListItem);