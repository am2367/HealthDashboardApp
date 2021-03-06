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

class MonthlyCard extends React.Component {

    state={open: false, 
           index: this.props.index,
           data: this.props.data}

    open = () => {
      this.setState({open: true}, () => this.props.setOpen(this.state.index))
    }

    close = () => {
      this.setState({open: false}, () => this.props.setClose())
    }

    componentWillReceiveProps = (nextProps) => {
      //console.log(nextProps.data)
      this.setState({data: nextProps.data})
    }

    isTodayCard = () =>{
      if(moment(this.state.data['Date']).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')){
          return true
      }
      else{
          return false
      }
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
        return(
            <Card onClick={() => { this.open() }} style={{cursor: 'pointer',backgroundColor: this.isTodayCard() ? '#14e4ff' : ''}} className={classes.Card}>
                <CardHeader title={moment(this.props.data['Date']).format('D')}/>
            </Card>)
    }
}
  
const MonthlyCardWrapped = withStyles(styles)(MonthlyCard);

export default MonthlyCardWrapped;