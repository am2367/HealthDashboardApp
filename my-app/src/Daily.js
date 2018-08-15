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

class Daily extends React.Component {
    render() {
        const { classes } = this.props;
        let d = new Date();
        let day = d.getDay() || 7 - 1;
        
        /*fetch('http://localhost:4200/')
        .then(response => response.json())
        .then(posts => (console.log(posts)))*/
         return(<div style={{textAlign: 'center', width: '70%', height: '100%', margin: 'auto'}}>
        <Card className={classes.Card}>
            <CardHeader title={this.props.weekdays[day-1]}/>
        </Card>
        </div>)
    }
}
  
const dailyWrapped = withStyles(styles)(Daily);

export default dailyWrapped;