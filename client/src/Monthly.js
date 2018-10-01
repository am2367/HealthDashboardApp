import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DayModal from './DayModal.js';
import moment from 'moment';
import isEmpty from './isEmpty.js'
import MonthlyCard from './MonthlyCard.js';
import checkSession from './CheckSession.js'
import { withRouter } from 'react-router'
import Left from '@material-ui/icons/ChevronLeft';
import Right from '@material-ui/icons/ChevronRight';

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

    state={open: false, 
           openDay: 0,
           data: this.props.data,
           month: moment().startOf('month').format('MM/DD/YYYY')}

    open = (i) => {
      this.setState({open: true, 
                     openDay: i, 
                     data: this.props.data,
                     })
    }

    close = () => {
      this.setState({open: false})
    }

    next = () => {
      let tempMonth = this.state.month
      let thisRef = this
      if(this.state.data['Year'][moment(tempMonth).add(3, 'M').format('YYYY')]){
        let newMonth = moment(tempMonth).add(1, 'M').format('YYYY-MM-DD');
        this.setState({month: newMonth})    
      }
      else{
        this.props.getMoreData(moment(tempMonth).add(3, "M").format('YYYY'));
      }
    }
  
    previous = () => {
      let tempMonth = this.state.month
      let thisRef = this
      if(this.state.data['Year'][moment(tempMonth).subtract(3, 'M').format('YYYY')]){
        let newMonth = moment(tempMonth).subtract(1, 'M').format('YYYY-MM-DD');
        this.setState({month: newMonth})    
      }
      else{
        this.props.getMoreData(moment(tempMonth).subtract(3, "M").format('YYYY'));
      }
    }

    getDayData = (monthIndex) => {
      //console.log(this.state.data, this.state.month, monthIndex)
      let year = moment(this.state.month).format('YYYY');
      let month = moment(this.state.month).format('M') * 1;
      let day = moment(this.state.month).add(monthIndex, 'd').format('D') * 1;
      //console.log(year, month, day)
      //console.log(this.state.data[year][month][day])
      return(this.state.data['Year'][year]['Month'][month]['Day'][day])
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
            if(!isEmpty(props.data)){
              //console.log(props.data)
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


    render() {
        const { classes } = this.props;
        let d = new Date();
        let dayNumber = d.getDate();
        let month = d.getMonth();
        let year = d.getYear();
        let day = d.getDay() || 7 - 1;
        //let dayCount = new Date(month, year, 0).getDate();
        let days = []
        let daysEmpty = []

        let dayCount = moment(this.state.month).daysInMonth();

        if(!isEmpty(this.state.data)){
          for(var i=0; i < dayCount; i++){
            
            days.push(<Grid item xs={4} sm={2} md={2} lg={2} style={{textAlign: 'center'}}><MonthlyCard setClose={()=>{this.close()}} setOpen={(i)=>{this.open(i)}} index={i} data={this.getDayData(i)}/></Grid>);
          }
        }

        for(var i=0; i < dayCount; i++){
          
          daysEmpty.push(<Grid item xs={4} sm={2} md={2} lg={2} style={{textAlign: 'center'}}><Card style={{boxShadow: 'none', backgroundColor: '#f5f5f5', height: '15rem', width: '100%'}}/></Grid>);
        }
        
        return (isEmpty(this.state.data) ?
          <div className={classes.root}>
            <Grid container spacing={24}>
              {daysEmpty}
            </Grid>
          </div>
          :
          <div className={classes.root}>
            <Grid item xs={8} sm={8} md={8} lg={8} style={{textAlign: 'center', margin: 'auto', display: 'flex'}}>
                <Grid item xs={2} sm={2} md={2} lg={2} >
                    <Left style={{cursor: 'pointer'}} onClick={this.previous}/>
                </Grid>
                <Grid item xs={8} sm={8} md={8} lg={8}>
                    {moment(this.state.month).format('MMMM') + ' ' + moment(this.state.month).format('YYYY')}
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={2} >
                    <Right style={{cursor: 'pointer'}} onClick={this.next}/>
                </Grid>
            </Grid>
            <Grid container spacing={24}>
              <DayModal day={this.state.openDay} open={this.state.open} onClose={this.close} weekdays={this.props.weekdays} data={this.getDayData(this.state.openDay)}/>
              {days}
            </Grid>
          </div>)
    } 
}
  
const monthlyWrapped = withStyles(styles)(Monthly);
const monthlyWrappedWithRouter = withRouter(monthlyWrapped)
export default monthlyWrappedWithRouter;