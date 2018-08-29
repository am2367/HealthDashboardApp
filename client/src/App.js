import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { withRouter } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Weekly from './Weekly.js';
import Monthly from './Monthly.js';
import Daily from './Daily.js';

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

class Dashboard extends React.Component {
  state = {clicked: ''}

  weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  showDaily = () => {
    return(<Daily weekdays={this.weekdays}/>)
  };

  showWeekly = () => {
    return(<Weekly weekdays={this.weekdays}/>)
  }

  showMonthly = () => {
    return(<Monthly weekdays={this.weekdays}/>)
  };

  viewChange = (view) => {
    this.setState({clicked: view})
  }

  render(){
    const { classes } = this.props;

    return (
      <Router>
      <div className={classes.root}>
        <Grid container spacing={24}>
          <Grid item sm={4} md={4} lg={4} style={{textAlign: 'center'}}>
            <Button onClick={() => {this.viewChange('Daily')}} style={{backgroundColor: this.state.clicked=='Daily' ? '#e6e6e6' : '#14e4ff'}} fullWidth className={classes.viewButtons}><Link className={classes.viewLinks} to="/Daily">Daily</Link></Button>
          </Grid>
          <Grid item sm={4} md={4} lg={4} style={{textAlign: 'center'}}>
            <Button onClick={() => {this.viewChange('Weekly')}} style={{backgroundColor: this.state.clicked=='Weekly' ? '#e6e6e6' : '#14e4ff'}} fullWidth className={classes.viewButtons}><Link className={classes.viewLinks} to="/Weekly">Weekly</Link></Button>
          </Grid>
          <Grid item sm={4} md={4} lg={4} style={{textAlign: 'center'}}>
            <Button onClick={() => {this.viewChange('Monthly')}} style={{backgroundColor: this.state.clicked=='Monthly' ? '#e6e6e6' : '#14e4ff'}} fullWidth className={classes.viewButtons}><Link className={classes.viewLinks} to="/Monthly">Monthly</Link></Button>
          </Grid>
          <Route path="/Daily" component={this.showDaily} />
          <Route path="/Weekly" component={this.showWeekly} />
          <Route path="/Monthly" component={this.showMonthly} />
        </Grid>      
      </div>
    </Router>  
    )
  }
}
const dashboardWrapped = withStyles(styles)(Dashboard);

export default dashboardWrapped;
