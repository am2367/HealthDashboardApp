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
  },
  Card: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  viewButtons: {
    backgroundColor: '#14e4ff',
    borderRadius: 0,
    borderRight: '1px solid #3f51b5',
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
  state = {loggedIn: false, data: {}, year: moment().format('YYYY')}

  componentWillMount = () => {
    let thisRef = this
    checkSession(function(result){
      if(result == false){
        thisRef.redirect()
      }
      else{
          thisRef.getUsername();
          thisRef.getData();
      }
    })
      
  }

  getUsername = () => {
    fetch('/api/getUsername')
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data){
            //console.log(data)
            this.setState({username: data})
        }else{
            this.props.history.push('/Login');
            alert('Ran into an error, please login again.')
        }
    })
  }

  getData = () => {
    //console.log('request')
    fetch('/api/getStats/Yearly?year=' + this.state.year)
    .then(this.handleErrors)
    .then(response => response.json())
    .then(data=>{
        if(data == 'Inserted!'){
            console.log(data)
            this.getData()
        }else{
            console.log(data)
            this.setState({data: data})
        }
    })
    }

    getMoreData = (year) => {
      //console.log('request')

      fetch('/api/getStats/Yearly?year=' + year)
      .then(this.handleErrors)
      .then(response => response.json())
      .then(data=>{
          if(data == 'Inserted!'){
              //console.log(data)
              this.getMoreData(year)
          }else{
              //console.log(data)
              let tempData = this.state.data
              tempData = Object.assign(tempData, data);
              console.log(tempData)
              this.setState({data: tempData})
          }
      })
      }


  redirect = () => {
    this.props.history.push('/Login');
  }


  showDaily = () => {
    return(<Daily 
                redirect={this.redirect} 
                loggedIn={this.state.loggedIn}
                data={this.state.data}
                getData={this.getData}
                getMoreData={this.getMoreData}
            />)
  };

  showWeekly = () => {
    return(<Weekly 
                redirect={this.redirect} 
                loggedIn={this.state.loggedIn}
                data={this.state.data}
                getData={this.getData}
                getMoreData={this.getMoreData}
            />)
  }

  showMonthly = () => {
    return(<Monthly 
                redirect={this.redirect} 
                loggedIn={this.state.loggedIn}
                data={this.state.data}
                getData={this.getData}
                getMoreData={this.getMoreData}
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
          <TopNav redirect={this.redirect} username={this.state.username}/>
            <Grid container>
              <Grid item xs={4} sm={4} md={4} lg={4} style={{textAlign: 'center'}}>
                <Button onClick={() => {this.viewChange('Daily')}} style={{backgroundColor: this.state.clicked=='Daily' ? '#e6e6e6' : '#14e4ff'}} fullWidth className={classes.viewButtons}><Link className={classes.viewLinks} to="/Dashboard/Daily">Daily</Link></Button>
              </Grid>
              <Grid item xs={4} sm={4} md={4} lg={4} style={{textAlign: 'center'}}>
                <Button onClick={() => {this.viewChange('Weekly')}} style={{backgroundColor: this.state.clicked=='Weekly' ? '#e6e6e6' : '#14e4ff'}} fullWidth className={classes.viewButtons}><Link className={classes.viewLinks} to="/Dashboard/Weekly">Weekly</Link></Button>
              </Grid>
              <Grid item xs={4} sm={4} md={4} lg={4} style={{textAlign: 'center'}}>
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
