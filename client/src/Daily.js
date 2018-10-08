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
      backgroundColor: '#ffffff96'
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
    //console.log(this.props.data)
    let props = this.props
    let thisRef = this
    checkSession(function(result){
    if(result == false){
        props.redirect();
    }
    else{
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
    //console.log(nextProps.data.length)
    }

    next = () => {
        let thisRef = this
        let tempDate = this.state.date
        if(this.state.data['Year'][moment(tempDate).add(3, 'd').format('YYYY')]){
            let newDate = moment(tempDate).add(1, 'd').format('YYYY-MM-DD');
            this.setState({date: newDate})    
        }
        else{
            this.props.getMoreData(moment(tempDate).add(3, "d").format('YYYY'), function() {
                thisRef.next();
            })
        }
    }

    previous = () => {
        let thisRef = this
        let tempDate = this.state.date
        if(this.state.data['Year'][moment(tempDate).subtract(3, 'd').format('YYYY')]){
            let newDate = moment(tempDate).subtract(1, 'd').format('YYYY-MM-DD');
            this.setState({date: newDate})    
        }
        else{
            this.props.getMoreData(moment(tempDate).subtract(3, "d").format('YYYY'), function() {
                thisRef.next();
            })
        }
    }

  getDayData = () => {
    //console.log(this.state.data)
    let year = moment(this.state.date).format('YYYY');
    let month = moment(this.state.date).format('M') * 1;
    let day = moment(this.state.date).format('D') * 1;
    //console.log(this.state.data[year][month][day])
    return(this.state.data['Year'][year]['Month'][month]['Day'][day])
  }

  /*getData = () => {
     
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
    render() {
         const { classes } = this.props;

         return(<div style={{textAlign: 'center', width: '70%', height: '100%', margin: 'auto'}}>
                    {isEmpty(this.state.data) ?
                        <Card style={{boxShadow: 'none', backgroundColor: '#f5f5f5', height: '25rem', width: '100%'}}/>
                        :
                        <div>
                            <Grid item sm={8} md={8} lg={8} style={{justifyContent: 'center', margin: 'auto', display: 'flex', }}>
                                <Grid item sm={2} md={2} lg={2} >
                                    <Left style={{cursor: 'pointer'}} onClick={this.previous}/>
                                </Grid>
                                <Grid item sm={8} md={8} lg={8}>
                                    {moment(this.state.date).format('dddd') + ' ' + this.state.date}
                                </Grid>
                                <Grid item sm={2} md={2} lg={2} >
                                    <Right style={{cursor: 'pointer'}} onClick={this.next}/>
                                </Grid>
                            </Grid>
                            <DayCard 
                                index={moment(this.state.date).format('DD') * 1 - 1} 
                                data={this.getDayData()}
                            />
                        </div>
                        
                    }
                </div>)
    }
}
  
const dailyWrapped = withStyles(styles)(Daily);
const dailyWrappedWithRouter = withRouter(dailyWrapped)
export default dailyWrappedWithRouter;