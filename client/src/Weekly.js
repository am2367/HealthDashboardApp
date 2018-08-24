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
    state = {data: []}
    
    handleErrors = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }
    componentWillMount = () => {
        this.getData()
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
        let daysTop = [];
        let daysBottom = [];
        var startOfWeek = moment().startOf("'isoWeek'").toDate();

        for(var i=0; i < 3; i++){
            let day = moment().startOf("'isoWeek'").add(i, 'day').toDate();
            daysTop.push(<Grid item sm={4} md={4} lg={4} style={{textAlign: 'center'}}>
                            <DayCard weekdays={this.props.weekdays} index={i} date={day} data={this.state.data}/>
                        </Grid>);
        }
        for(var x=3; x < 7; x++){
            let day = moment().startOf("'isoWeek'").add(x, 'day').toDate();
            daysBottom.push(<Grid item sm={3} md={3} lg={3} style={{textAlign: 'center'}}>
                                <DayCard weekdays={this.props.weekdays} index={x} date={day} data={this.state.data}/>
                            </Grid>);
        }

        if (this.state['data'].length > 0){
            return (<div className={classes.root}><Grid container spacing={24}>{daysTop}</Grid><Grid container spacing={24}>{daysBottom}</Grid></div>)
        }
        else{
            return null
        }
    }
}
  
const weeklyWrapped = withStyles(styles)(Weekly);

export default weeklyWrapped;