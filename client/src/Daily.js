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
import Left from '@material-ui/icons/ChevronLeft';
import Right from '@material-ui/icons/ChevronRight';
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
  state = {data: this.props.data, date: moment(new Date()).format('YYYY-MM-DD')}
    
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
        //thisRef.getData()
        if(props.data){
            thisRef.setState({data: props.data})
        }
        else{
            props.getData();
        }
    }
    })
  }

  componentWillReceiveProps = (nextProps) => {
    this.setState({data: nextProps.data})
    }

  next = () => {
    let tempDate = this.state.date
    let newDate = moment(tempDate).add(1, 'd').format('YYYY-MM-DD');
    this.setState({date: newDate})
  }

  previous = () => {
    let tempDate = this.state.date
    let newDate = moment(tempDate).subtract(1, 'd').format('YYYY-MM-DD');
    this.setState({date: newDate})
  }

  getDate = (day) => {
    return(this.props.weekdays[moment(this.state.day[day-1]['Date']).isoWeekday()-1] + ' ' + moment(this.state.day[day-1]['Date']).format("YYYY-MM-DD") )
  }

  getData = () => {
     
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
        
         return(<div style={{textAlign: 'center', width: '70%', height: '100%', margin: 'auto', display: 'flex'}}>
                    {this.state.data.length > 0 
                        ?
                        <div>
                            <Grid item sm={8} md={8} lg={8} style={{textAlign: 'center', margin: 'auto'}}>
                                <Grid item sm={2} md={2} lg={2} >
                                    <Left style={{cursor: 'pointer'}} onClick={this.previous}/>
                                </Grid>
                                <Grid item sm={8} md={8} lg={8}>
                                    {this.state.data ? (moment(this.state.date).format('dddd') + ' ' + this.state.date) : ''}
                                </Grid>
                                <Grid item sm={2} md={2} lg={2} >
                                    <Right style={{cursor: 'pointer'}} onClick={this.next}/>
                                </Grid>
                            </Grid>
                            <DayCard 
                                weekdays={this.props.weekdays} 
                                index={moment(this.state.date).format('DD') * 1 - 1} 
                                data={this.state.data}
                            />
                        </div>
                        : 
                        <Card style={{boxShadow: 'none', backgroundColor: '#f5f5f5', height: '25rem', width: '100%'}}/>}
                </div>)
    }
}
  
const dailyWrapped = withStyles(styles)(Daily);
const dailyWrappedWithRouter = withRouter(dailyWrapped)
export default dailyWrappedWithRouter;