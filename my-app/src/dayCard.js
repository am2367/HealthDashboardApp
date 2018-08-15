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
import moment from 'moment';


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

class dayCard extends React.Component {
    state = {
            editable: false,
            day: moment(this.props.date).format('MM/DD/YYYY'),
            Run: {Time: 1, Distance: 0, Cals: 0},
            Swim: {Time: 0, Distance: 2, Cals: 0},
            Bike: {Time: 0, Distance: 3, Cals: 0},
            Workout: {Time: 4, Distance: 0, Cals: 0}
            }

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

    handleChange = (event) => {
        this.setState({value: event.target.value});
    }

    handleErrors = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    save = () => {
        fetch('http://localhost:4200/setStats/Weekly', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'},
            body: JSON.stringify({
                    Date: new Date(this.state.day),
                    Run: this.state.Run,
                    Swim: this.state.Swim,
                    Bike: this.state.Bike,
                    Workout: this.state.Workout })
        })
        .then(this.handleErrors)
        .then(function(response) {
            console.log(response.json())
        })
    }

    render() {
        const { classes } = this.props;

        const field = (id, item) => (
            <TableCell numeric style={{paddingRight: 0}}>
                <TextField
                id={id}
                label="Number"
                type="number"
                fullWidth={true}
                label=''
                value={this.state[id][item]}
                onChange={this.handleChange}
                style={{width: '50px', display: this.state.editable ? '' : 'none'}}
                />
            </TableCell>
        )

        return (<Card style={{backgroundColor: (moment().format('dddd') == this.props.weekdays[this.props.index]) ? '#14e4ff' : ''}} className={classes.Card}>
        <CardHeader title={this.props.weekdays[this.props.index] + ' ' + this.state.day}/>
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
                            Run
                        </TableCell>
                        {field('Run', 'Time')}
                        {field('Run', 'Distance')}
                        {field('Run', 'Cals')}
                    </TableRow>
                </TableBody>
                <TableBody key="Swim">
                    <TableRow>
                        <TableCell component="th" scope="row" style={{paddingRight: 0}}>
                            Swim
                        </TableCell>
                        {field('Swim', 'Time')}
                        {field('Swim', 'Distance')}
                        {field('Swim', 'Cals')}
                    </TableRow>
                </TableBody>
                <TableBody key="Bike">
                    <TableRow>
                        <TableCell component="th" scope="row" style={{paddingRight: 0}}>
                            Bike
                        </TableCell>
                        {field('Bike', 'Time')}
                        {field('Bike', 'Distance')}
                        {field('Bike', 'Cals')}
                    </TableRow>
                </TableBody>
                <TableBody key="Workout">
                    <TableRow>
                        <TableCell component="th" scope="row" style={{paddingRight: 0}}>
                            Workout
                        </TableCell>
                        {field('Workout', 'Time')}
                        {field('Workout', 'Distance')}
                        {field('Workout', 'Cals')}
                    </TableRow>
                </TableBody>
            </Table>   
        </CardContent>
        </Card>)
    }
}
  
const dayCardWrapped = withStyles(styles)(dayCard);

export default dayCardWrapped;