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
import MonthlyCard from './MonthlyCard.js';

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
           data: ''}
    open = (i) => {
      this.setState({open: true, openDay: i, data: []}, () => this.getData(i))
    }

    close = () => {
      this.setState({open: false})
    }

    getData = (i) => {
      /*if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"){
          var url = new URL("http://localhost:4200/api/getStats/Weekly");
      }else{
          var url = new URL("https://healthdashboardapp.herokuapp.com/api/getStats/Weekly");
      }*/
      let date = moment().startOf("month").add(i, 'day').toDate().toISOString();
        //Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

        fetch('/api/getStats/Daily?date=' + date)
        .then(this.handleErrors)
        .then(response => response.json())
        .then(data=>{
            if(data == 'Inserted!'){
                this.getData(i)
            }else{
                let data1 = data[0]
                let temp = {[i]: data1}
                this.setState({data: temp})
            }
        })
    }

    render() {
        const { classes } = this.props;
        let d = new Date();
        let dayNumber = d.getDate();
        let month = d.getMonth();
        let year = d.getYear();
        let day = d.getDay() || 7 - 1;
        let dayCount = new Date(month, year, 0).getDate();
        let days = []
        let daysEmpty = []

        for(var i=0; i < dayCount; i++){
          
          days.push(<Grid item sm={2} md={2} lg={2} style={{textAlign: 'center'}}><MonthlyCard setClose={()=>{this.close()}} setOpen={(i)=>{this.open(i)}} index={i} data={this.state.data}/></Grid>);
        }

        /*for(var i=0; i < dayCount; i++){
          
          daysEmpty.push(<Grid item sm={2} md={2} lg={2} style={{textAlign: 'center'}}><Card style={{boxShadow: 'none', backgroundColor: '#f5f5f5', height: '25rem', width: '100%'}}/></Grid>);
        }*/
        

        return (<div className={classes.root}><Grid container spacing={24}><DayModal day={this.state.openDay} open={this.state.open} onClose={this.close} weekdays={this.props.weekdays} data={this.state.data}/>{days}</Grid></div>)
    }
}
  
const monthlyWrapped = withStyles(styles)(Monthly);

export default monthlyWrapped;