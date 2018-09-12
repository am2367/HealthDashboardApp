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
import TopNav from './TopNav.js'
import checkSession from './CheckSession.js';
import moment from 'moment';

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
  state = {loggedIn: false, data: []}

  weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  componentWillMount = () => {
    let thisRef = this
    checkSession(function(result){
      if(result == false){
        thisRef.redirect()
      }
      else{
          thisRef.getData()
      }
    })
      
  }

  getData = () => {
    console.log('request')

    let dateStart = moment().startOf("month").format() 
    let dateEnd = moment().endOf("month").format()

    fetch('/api/getStats/Monthly?dateStart=' + dateStart + '&dateEnd=' + dateEnd)
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data == 'Inserted!'){
            console.log(data)
            this.getData()
        }else{
            this.setState({data: data})
        }
    })
}


  redirect = () => {
    this.props.history.push('/Login');
  }


  showDaily = () => {
    return(<Daily 
                redirect={this.redirect} 
                weekdays={this.weekdays} 
                loggedIn={this.state.loggedIn}
                data={this.state.data}
                getData={this.getData}
            />)
  };

  showWeekly = () => {
    return(<Weekly 
                redirect={this.redirect} 
                weekdays={this.weekdays} 
                loggedIn={this.state.loggedIn}
                data={this.state.data}
                getData={this.getData}
            />)
  }

  showMonthly = () => {
    return(<Monthly 
                redirect={this.redirect} 
                weekdays={this.weekdays} 
                loggedIn={this.state.loggedIn}
                data={this.state.data}
                getData={this.getData}
            />)
  };

  viewChange = (view) => {
    this.setState({clicked: view})
  }

  render(){
    const { classes } = this.props;

    return (
      <Router>
        <div className={classes.root}>
          <TopNav redirect={this.redirect}/>
          <Grid container spacing={24} style={{marginTop: '1%'}}>
            <Grid item sm={4} md={4} lg={4} style={{textAlign: 'center'}}>
              <Button onClick={() => {this.viewChange('Daily')}} style={{backgroundColor: this.state.clicked=='Daily' ? '#e6e6e6' : '#14e4ff'}} fullWidth className={classes.viewButtons}><Link className={classes.viewLinks} to="/Dashboard/Daily">Daily</Link></Button>
            </Grid>
            <Grid item sm={4} md={4} lg={4} style={{textAlign: 'center'}}>
              <Button onClick={() => {this.viewChange('Weekly')}} style={{backgroundColor: this.state.clicked=='Weekly' ? '#e6e6e6' : '#14e4ff'}} fullWidth className={classes.viewButtons}><Link className={classes.viewLinks} to="/Dashboard/Weekly">Weekly</Link></Button>
            </Grid>
            <Grid item sm={4} md={4} lg={4} style={{textAlign: 'center'}}>
              <Button onClick={() => {this.viewChange('Monthly')}} style={{backgroundColor: this.state.clicked=='Monthly' ? '#e6e6e6' : '#14e4ff'}} fullWidth className={classes.viewButtons}><Link className={classes.viewLinks} to="/Dashboard/Monthly">Monthly</Link></Button>
            </Grid>
            <Route path="/Dashboard/Daily" component={this.showDaily} />
            <Route path="/Dashboard/Weekly" component={this.showWeekly} />
            <Route path="/Dashboard/Monthly" component={this.showMonthly} />
          </Grid>  
        </div>
      </Router>  
      )
    }
  }
const dashboardWrapped = withStyles(styles)(Dashboard);
const dashboardWrappedWithRouter = withRouter(dashboardWrapped)
export default dashboardWrappedWithRouter;
