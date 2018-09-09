import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DayCard from './DayCard.js'
import moment from 'moment';
import checkSession from './CheckSession.js'
import { withRouter } from 'react-router'

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
  state = {data: []}
    
  handleErrors = (response) => {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response;
  }

  componentWillMount = () => {
    let props = this.props
    let thisRef = this
    checkSession(function(result){
      if(result == false){
        props.redirect();
      }
      else{
        thisRef.getData()
      }
    })

    
      
  }

  getDate = (day) => {
    return(this.props.weekdays[moment(this.state.data[day]['Date']).isoWeekday()-1] + ' ' + moment(this.state.data[day]['Date']).format("YYYY-MM-DD") )
  }

  getData = () => {
    /*if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"){
        var url = new URL("http://localhost:4200/api/getStats/Weekly");
    }else{
        var url = new URL("https://healthdashboardapp.herokuapp.com/api/getStats/Weekly");
    }*/
     
    let dateStart = moment().startOf("isoWeek").format() 
    let dateEnd = moment().endOf("isoWeek").format()
      //Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

      fetch('/api/getStats/Weekly?dateStart=' + dateStart + '&dateEnd=' + dateEnd)
      .then(this.handleErrors)
      .then(response => response.json())
      .then(data=>{
          if(data == 'Inserted!'){
              this.getData()
          }else{
              this.setState({data: data})
          }
      })
  }
    render() {
        const { classes } = this.props;
        let day = moment().isoWeekday() - 1;
        
         return(<div style={{textAlign: 'center', width: '70%', height: '100%', margin: 'auto'}}>
                    {this.state.data.length > 0 
                        ?
                        <div>
                            <h1>{this.state['data'].length > 0 ? this.getDate(day) : ''}</h1>
                            <DayCard weekdays={this.props.weekdays} index={day} data={this.state.data}/>
                        </div>
                        : 
                        <Card style={{boxShadow: 'none', backgroundColor: '#f5f5f5', height: '25rem', width: '100%'}}/>}
                </div>)
    }
}
  
const dailyWrapped = withStyles(styles)(Daily);
const dailyWrappedWithRouter = withRouter(dailyWrapped)
export default dailyWrappedWithRouter;