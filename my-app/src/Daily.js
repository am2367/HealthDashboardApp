import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import DayCard from './dayCard.js'
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

class Daily extends React.Component {
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
    if (process.env.appURL){ 
        var url = new URL(process.env.appURL + "/getStats/Weekly");
    }else{
        var url = new URL("http://localhost:4200/getStats/Weekly");
    }
      const params = {dateStart: moment().startOf("isoWeek").format(), 
                      dateEnd: moment().endOf("isoWeek").format()}

      Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))

      fetch(url)
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
        
        /*fetch('http://localhost:4200/')
        .then(response => response.json())
        .then(posts => (console.log(posts)))*/
         return(<div style={{textAlign: 'center', width: '70%', height: '100%', margin: 'auto'}}>
                  <DayCard weekdays={this.props.weekdays} index={day} data={this.state.data}/>
                </div>)
    }
}
  
const dailyWrapped = withStyles(styles)(Daily);

export default dailyWrapped;