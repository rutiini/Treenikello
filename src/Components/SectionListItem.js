import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
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
});

function SectionListItem(props) {
  const { classes } = props;
  // const bull = <span className={classes.bullet}>•</span>;
  
  const {section} = props;

  return (
    <div>
      <Card className={classes.card}>
      <i class="material-icons">arrow_upward</i>
        <CardContent>
          <Typography variant="headline" component="h2">
          {section.name}
          </Typography>
          {/* <Typography className={classes.title}>{section.description}</Typography> */}
          <Typography className={classes.pos}>{`${section.duration} min`}</Typography>
          <Typography component="p">
          {section.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
        <i class="material-icons">arrow_downward</i>
      </Card>
    </div>
  );
}

SectionListItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SectionListItem);