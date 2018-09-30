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
import isEmpty from './isEmpty.js'
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

class Weekly extends React.Component {
    state = {data: this.props.data, 
             week: moment().startOf("isoWeek").format()}
    
    handleErrors = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    next = () => {
        let thisRef = this
        let tempWeek = this.state.week
        if(this.state.data['Year'][moment(tempWeek).add(1, 'w').format('YYYY')]){
          let newWeek = moment(tempWeek).add(1, 'w').format('YYYY-MM-DD');
          this.setState({week: newWeek})    
        }
        else{
            this.props.getMoreData(moment(tempWeek).add(3, "w").format('YYYY'));
        }
    }
    
    previous = () => {
        let thisRef = this
        let tempWeek = this.state.week
        if(this.state.data['Year'][moment(tempWeek).subtract(1, 'w').format('YYYY')]){
            let newWeek = moment(tempWeek).subtract(1, 'w').format('YYYY-MM-DD');
            this.setState({week: newWeek})    
        }
        else{
            this.props.getMoreData(moment(tempWeek).subtract(3, "w").format('YYYY'));
        }
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

    getDate = (day) => {
        //let dayInt = moment().format('DD') * 1 + day
        //let dayOfWeek = moment(this.state.data[dayInt]['Date']).format('dddd')
        //return(dayOfWeek + ' ' + moment(this.state.data[(moment().format('DD') * 1) + day - 1]['Date']).format("YYYY-MM-DD"))
        let date = moment(this.state.week).add(day, 'd');
        let dayOfWeek = moment(date).format('dddd')
        return(dayOfWeek + ' ' + moment(date).format("YYYY-MM-DD"))
    }

    /*getData = () => {
        //console.log('request')

        let dateStart = moment().startOf("isoWeek").format() 
        let dateEnd = moment().endOf("isoWeek").format()

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
    }*/

    getDayData = (weekIndex) => {
        //console.log(this.state.data)
        let year = moment(this.state.week).format('YYYY');
        let month = moment(this.state.week).format('M') * 1;
        let day = moment(this.state.week).add(weekIndex, 'd').format('D') * 1;
        //console.log(month, day)
        //console.log(this.state.data[year][month][day])
        return(this.state.data['Year'][year]['Month'][month]['Day'][day])
      }

    daysTop = () => {
        let startOfWeek = moment().startOf("isoWeek").toDate();
        //console.log(startOfWeek)
        let days = []
        for(var i=0; i < 3; i++){
            days.push(<Grid item sm={4} md={4} lg={4} style={{textAlign: 'center'}}>
                            <h1>{this.getDate(i)}</h1>
                            <DayCard weekdays={this.props.weekdays} index={moment(startOfWeek).add(i, 'd').format("DD") * 1} data={this.getDayData(i)}/>
                        </Grid>);
        }
        return(days)
    }

    daysBottom = () => {
        let startOfWeek = moment().startOf("isoWeek").toDate();
        let days = []
        for(var x=3; x < 7; x++){
            days.push(<Grid item sm={3} md={3} lg={3} style={{textAlign: 'center'}}>
                                <h1>{this.getDate(x)}</h1>
                                <DayCard weekdays={this.props.weekdays} index={moment(startOfWeek).add(x, 'd').format("DD") * 1} data={this.getDayData(x)}/>
                            </Grid>);
        }
        return(days)
    }

    render() {
        const { classes } = this.props;
 
        let daysEmpty = [];

        for(var i=0; i < 3; i++){
            daysEmpty.push(<Grid item sm={4} md={4} lg={4}>
                             <Card style={{boxShadow: 'none', backgroundColor: '#f5f5f5', height: '25rem', width: '100%'}}/>
                           </Grid>)
        }
        for(var i=3; i < 7; i++){
            daysEmpty.push(<Grid item sm={3} md={3} lg={3}>
                             <Card style={{boxShadow: 'none', backgroundColor: '#f5f5f5', height: '25rem', width: '100%'}}/>
                           </Grid>)
        }

        
        return (isEmpty(this.state.data)
                ?
            <div className={classes.root}>
                <Grid container spacing={24}>
                    {daysEmpty}
                </Grid>
            </div>
            :
            <div className={classes.root}>
                <Grid item sm={8} md={8} lg={8} style={{textAlign: 'center', margin: 'auto', display: 'flex'}}>
                    <Grid item sm={2} md={2} lg={2} >
                        <Left style={{cursor: 'pointer'}} onClick={this.previous}/>
                    </Grid>
                    <Grid item sm={8} md={8} lg={8}>
                        {moment(this.state.week).format('MM/DD/YYYY') + ' - ' + moment(this.state.week).endOf("isoWeek").format('MM/DD/YYYY')}
                    </Grid>
                    <Grid item sm={2} md={2} lg={2} >
                        <Right style={{cursor: 'pointer'}} onClick={this.next}/>
                    </Grid>
                </Grid>
                <Grid container spacing={24}>{this.daysTop()}</Grid>
                <Grid container spacing={24}>{this.daysBottom()}</Grid>
            </div>)
    }
}
  
const weeklyWrapped = withStyles(styles)(Weekly);
const weeklyWrappedWithRouter = withRouter(weeklyWrapped)
export default weeklyWrappedWithRouter;