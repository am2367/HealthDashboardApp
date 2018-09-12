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

class Weekly extends React.Component {
    state = {data: this.props.data, week: moment().startOf("isoWeek").format()}
    
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

    getDate = (day) => {
        //let dayInt = moment().format('DD') * 1 + day
        //let dayOfWeek = moment(this.state.data[dayInt]['Date']).format('dddd')
        //return(dayOfWeek + ' ' + moment(this.state.data[(moment().format('DD') * 1) + day - 1]['Date']).format("YYYY-MM-DD"))
        let date = moment(this.state.week).add(day, 'd');
        let dayOfWeek = moment(date).format('dddd')
        return(dayOfWeek + ' ' + moment(date).format("YYYY-MM-DD"))
    }

    getData = () => {
        console.log('request')

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
    }


    daysTop = () => {
        let startOfWeek = moment().startOf("isoWeek").toDate();
        console.log(startOfWeek)
        let days = []
        for(var i=0; i < 3; i++){
            days.push(<Grid item sm={4} md={4} lg={4} style={{textAlign: 'center'}}>
                            <h1>{this.state['data'].length > 0 ? this.getDate(i) : ''}</h1>
                            <DayCard weekdays={this.props.weekdays} index={moment(startOfWeek).add(i, 'd').format("DD") * 1 - 1} data={this.state.data}/>
                        </Grid>);
        }
        return(days)
    }

    daysBottom = () => {
        let startOfWeek = moment().startOf("isoWeek").toDate();
        let days = []
        for(var x=3; x < 7; x++){
            days.push(<Grid item sm={3} md={3} lg={3} style={{textAlign: 'center'}}>
                                <h1>{this.state['data'].length > 0 ? this.getDate(x) : ''}</h1>
                                <DayCard weekdays={this.props.weekdays} index={moment(startOfWeek).add(x, 'd').format("DD") * 1 - 1} data={this.state.data}/>
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

        if (this.state['data'].length > 0){
            return (<div className={classes.root}><Grid container spacing={24}>{this.daysTop()}</Grid><Grid container spacing={24}>{this.daysBottom()}</Grid></div>)
        }
        else{
            return(<div className={classes.root}><Grid container spacing={24}>{daysEmpty}</Grid></div>)
        }
    }
}
  
const weeklyWrapped = withStyles(styles)(Weekly);
const weeklyWrappedWithRouter = withRouter(weeklyWrapped)
export default weeklyWrappedWithRouter;