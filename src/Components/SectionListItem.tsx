import {
  Button,
  Card,
  CardActions,
  CardContent,
  createStyles,
  Typography,
  withStyles
} from '@material-ui/core';
import React, { PureComponent } from 'react';
import { ISection } from '../DataInterfaces';

const styles = createStyles({
  button: {
    margin: 5,
  },
  buttonContainer: {
    height: '100%',
    justifyContent: 'center',
    verticalAlign: 'middle',
    width: '20%',
  },
  card: {
    minWidth: '100%'
  },
  cellContainer: {
    textAlign: 'center'
  },
  content: {
    display: 'flex'
  },
  description: {
    display: 'block',
    height: 60,
    overflow: 'hidden',
    // whiteSpace: 'nowrap',
    // textOverflow: 'ellipsis',
  },
  exerciseSymbol: {
    fontSize: 60,
    textShadow: '0px 0px 3px black'
  },
  iconContainer: {
    height: '100%',
    width: '20%'
  },
  moveButton: {
    cursor: 'pointer'
  },
  pos: {
    // color: theme.palette.text.secondary,
    // marginBottom: 12,
    marginTop: 12,
  },
  textContainer: {
    height: '100%',
    userSelect: 'none',
    width: '60%',
  },
  title: {
    // color: theme.palette.text.secondary,
    fontSize: 14,
    marginBottom: 16,
  },
});

interface IProps{
  classes: any,
  section: ISection,
  deleteSection: (section: ISection) => void,
  handleSectionEditToggle: (section: ISection) => void,
  moveUp: (section: ISection) => void,
  moveDown: (section: ISection) => void
}


class SectionListItem extends PureComponent<IProps>{

  public render(){
    
    const { classes,
      section } = this.props;

    return (
      <Card className={classes.card}>
        <i className={`material-icons ${classes.moveButton}`} onClick={this.moveUpClick} >arrow_upward</i>
        <CardContent className={classes.content}>
          {/* left edge icon */}
          <div className={classes.iconContainer}>
            <i className={`material-icons ${classes.exerciseSymbol}`} style={{ color: section.color }}>directions_run</i>
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
          <div className={classes.buttonContainer}>
            <CardActions>
              <table className={classes.cellContainer}>
                <tbody>
                  <tr>
                    <td>
                      <Button variant="fab" className={classes.button} mini={true} style={{ backgroundColor: section.color }} onClick={this.deleteSelf}>
                        <i className="material-icons">delete</i>
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <Button variant="fab" mini={true} style={{ backgroundColor: section.color }} onClick={this.openEdit}>
                        <i className="material-icons">settings</i>
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </CardActions>
          </div>
        </CardContent>
        <i className={`material-icons ${classes.moveButton}`} onClick={this.moveDownClick}>arrow_downward</i>
      </Card>
    );
  } 
  
  // open edit dialog from button
  public openEdit = () => {
    this.props.handleSectionEditToggle(this.props.section);
  }
  public deleteSelf = () => {
    this.props.deleteSection(this.props.section)
  }
  private moveUpClick = () =>{
    this.props.moveUp(this.props.section);
  }
  private moveDownClick = () =>{
    this.props.moveDown(this.props.section);
  }
}

export default withStyles(styles)(SectionListItem);