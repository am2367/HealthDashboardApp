import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
    root: {
      flexGrow: 1,
      padding: 10
    },
    Card: {
      padding: theme.spacing.unit * 2,
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    viewButtons: {
      backgroundColor: '#14e4ff',
      padding: '0'
    },
    viewLinks: {
      display: 'block', 
      height: '100%', 
      width: '100%', 
      textDecoration: 'none'
    }
  });

class Monthly extends React.Component {
    render() {
        const { classes } = this.props;
        let d = new Date();
        let dayNumber = d.getDate();
        let month = d.getMonth();
        let year = d.getYear();
        let day = d.getDay() || 7 - 1;
        let dayCount = new Date(month, year, 0).getDate();
        let days = []
        for(var i=0; i < dayCount; i++){
        days.push(<Grid item sm={2} md={2} lg={2} style={{textAlign: 'center'}}><Card style={{backgroundColor: (dayNumber == i+1) ? '#14e4ff' : ''}} className={classes.Card}><CardHeader title={i+1}/></Card></Grid>);
        }
        return (<div className={classes.root}><Grid container spacing={24}>{days}</Grid></div>)
    }
}
  
const monthlyWrapped = withStyles(styles)(Monthly);

export default monthlyWrapped;