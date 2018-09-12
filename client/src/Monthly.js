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

class Monthly extends React.Component {

    state={open: false, 
           openDay: 0,
           data: this.props.data}

    open = (i) => {
      this.setState({open: true, openDay: i, data: this.props.data})
    }

    close = () => {
      this.setState({open: false})
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

        for(var i=0; i < dayCount-1; i++){
          
          days.push(<Grid item sm={2} md={2} lg={2} style={{textAlign: 'center'}}><MonthlyCard setClose={()=>{this.close()}} setOpen={(i)=>{this.open(i)}} index={i} data={this.state.data}/></Grid>);
        }

        for(var i=0; i < dayCount-1; i++){
          
          daysEmpty.push(<Grid item sm={2} md={2} lg={2} style={{textAlign: 'center'}}><Card style={{boxShadow: 'none', backgroundColor: '#f5f5f5', height: '15rem', width: '100%'}}/></Grid>);
        }
        
        if (this.state['data'].length > 0){
          return (<div className={classes.root}><Grid container spacing={24}><DayModal day={this.state.openDay} open={this.state.open} onClose={this.close} weekdays={this.props.weekdays} data={this.state.data}/>{days}</Grid></div>)
        }
        else{
          return (<div className={classes.root}><Grid container spacing={24}><DayModal day={this.state.openDay} open={this.state.open} onClose={this.close} weekdays={this.props.weekdays} data={this.state.data}/>{daysEmpty}</Grid></div>)
        }
    } 
}
  
const monthlyWrapped = withStyles(styles)(Monthly);
const monthlyWrappedWithRouter = withRouter(monthlyWrapped)
export default monthlyWrappedWithRouter;