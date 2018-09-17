import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Icon from '@material-ui/core/Icon';
import moment from 'moment';
import RunIcon from '@material-ui/icons/DirectionsRun';
import SwimIcon from '@material-ui/icons/Pool';
import BikeIcon from '@material-ui/icons/DirectionsBike';
import WorkoutIcon from '@material-ui/icons/FitnessCenter';
import { ListItemSecondaryAction } from "../node_modules/@material-ui/core";

const styles = theme => ({
    root: {
      flexGrow: 1,
      padding: 10
    },
    container: {
        display: 'flex',
        flexWrap: 'wrap'
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

class DayCard extends React.Component {
    state = {data: this.props.data,
             editable: false,
             index: this.props.index,
             temp: []}
    
    edit = () => {
        if(this.state.editable){
            this.setState({editable: false})
        }
        else{
            this.setState({editable: true})
        }
    }

    getVal = (event) => {
        let val = event.target.id
        return(this.state.this.val)
    }

    handleChange = (id, item, event) => {
        let temp = this.state.data;
        temp[id][item] = event.target.value
        
        //change editable state twice to update stateless input
        this.setState({editable: false})
        this.setState({editable: true})
    }

    componentWillReceiveProps(nextProps){
        this.setState({data: nextProps.data, index: nextProps.index})
    }

    handleErrors = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    isTodayCard = () =>{
        if(moment(this.state.data['Date']).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')){
            return true
        }
        else{
            return false
        }
    }

    save = () => {


        fetch('/api/setStats', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'},
            body: JSON.stringify({
                    Date: new Date(this.state.data['Date']),
                    Run: this.state.data['Run'],
                    Swim: this.state.data['Swim'],
                    Bike: this.state.data['Bike'],
                    Workout: this.state.data['Workout']})
        })
        .then(response => response.json())
        .then(data=>{
            if(data == 'Saved!'){
                this.edit()
                alert('Saved!')
            }
        })
    }

    render() {
        const { classes } = this.props;
        //console.log(this.state.data)
        const field = (id, item) => (
            <TableCell numeric style={{paddingRight: 0, display: this.state.editable ? '' : 'none', textAlign: 'center'}}>
                <TextField
                id={id}
                label="Number"
                type="number"
                fullWidth={true}
                label=''
                value={this.state.data[id][item]}
                onChange={(e) => this.handleChange(id, item, e)}
                style={{width: '50px'}}
                />
            </TableCell>
        )
        const dataCell = (id, item) => (
            <TableCell numeric style={{paddingRight: 0, display: this.state.editable ? 'none' : '', textAlign: 'center'}}>
                {this.state.data[id][item]}
            </TableCell>
        )
        if (this.state.data){
            return (<Card style={{backgroundColor: this.isTodayCard() ? '#14e4ff' : ''}} className={classes.Card}>
            {/*<CardHeader title={this.props.weekdays[moment(this.state.data[this.props.index]['Date']).isoWeekday()-1] + ' ' + moment(this.state.data[this.props.index]['Date']).format("YYYY-MM-DD")}/>*/}
            <Button style={{backgroundColor: this.state.editable ? 'red' : 'green'}}  onClick={() => { this.edit() }}>{this.state.editable ? 'Cancel' : 'Edit'}</Button>
            <Button style={{backgroundColor: 'green', display: this.state.editable ? '' : 'none'}}  onClick={() => { this.save() }}>Save</Button>
            <CardContent>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell numeric style={{paddingRight: 0, textAlign: 'left'}}>Activity</TableCell>
                        <TableCell numeric style={{paddingRight: 0, textAlign: 'center'}}>Time</TableCell>
                        <TableCell numeric style={{paddingRight: 0, textAlign: 'center'}}>Distance</TableCell>
                        <TableCell numeric style={{paddingRight: 0, textAlign: 'center'}}>kCals</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody key="Run">
                        <TableRow>
                            <TableCell component="th" scope="row" style={{paddingRight: 0}}>
                                <Icon><RunIcon/></Icon>
                            </TableCell>
                            {dataCell('Run', 'Time')}
                            {dataCell('Run', 'Distance')}
                            {dataCell('Run', 'Cals')}
                            {field('Run', 'Time')}
                            {field('Run', 'Distance')}
                            {field('Run', 'Cals')}
                        </TableRow>
                    </TableBody>
                    <TableBody key="Swim">
                        <TableRow>
                            <TableCell component="th" scope="row" style={{paddingRight: 0}}>
                                <Icon><SwimIcon/></Icon>
                            </TableCell>
                            {dataCell('Swim', 'Time')}
                            {dataCell('Swim', 'Distance')}
                            {dataCell('Swim', 'Cals')}
                            {field('Swim', 'Time')}
                            {field('Swim', 'Distance')}
                            {field('Swim', 'Cals')}
                        </TableRow>
                    </TableBody>
                    <TableBody key="Bike">
                        <TableRow>
                            <TableCell component="th" scope="row" style={{paddingRight: 0}}>
                                <Icon><BikeIcon/></Icon>
                            </TableCell>
                            {dataCell('Bike', 'Time')}
                            {dataCell('Bike', 'Distance')}
                            {dataCell('Bike', 'Cals')}
                            {field('Bike', 'Time')}
                            {field('Bike', 'Distance')}
                            {field('Bike', 'Cals')}
                        </TableRow>
                    </TableBody>
                    <TableBody key="Workout">
                        <TableRow>
                            <TableCell component="th" scope="row" style={{paddingRight: 0}}>
                                <Icon><WorkoutIcon/></Icon>
                            </TableCell>
                            {dataCell('Workout', 'Time')}
                            {dataCell('Workout', 'Distance')}
                            {dataCell('Workout', 'Cals')}
                            {field('Workout', 'Time')}
                            {field('Workout', 'Distance')}
                            {field('Workout', 'Cals')}
                        </TableRow>
                    </TableBody>
                </Table>   
            </CardContent>
            </Card>)
        }
        else{
            return null
        }
    }
}
  
const DayCardWrapped = withStyles(styles)(DayCard);

export default DayCardWrapped;