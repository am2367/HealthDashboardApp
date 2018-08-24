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

class DayCard extends React.Component {
    state = {data: this.props.data,
             editable: false,
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
        temp[this.props.index][id][item] = event.target.value
        
        //change editable state twice to update stateless input
        this.setState({editable: false})
        this.setState({editable: true})
    }

    componentWillReceiveProps(nextProps){
        this.setState({data: nextProps.data})
    }

    handleErrors = (response) => {
        if (!response.ok) {
            throw Error(response.statusText);
        }
        return response;
    }

    save = () => {
        /*if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"){
            var url = new URL("http://localhost:4200/api/setStats/Weekly");
        }else{
            var url = new URL("https://healthdashboardapp.herokuapp.com/api/setStats/Weekly");
        }*/
        fetch('/api/setStats/Weekly', {
            method: 'post',
            headers: {
                'Content-type': 'application/json'},
            body: JSON.stringify({
                    Date: new Date(this.state.data[this.props.index]['Date']),
                    Run: this.state.data[this.props.index]['Run'],
                    Swim: this.state.data[this.props.index]['Swim'],
                    Bike: this.state.data[this.props.index]['Bike'],
                    Workout: this.state.data[this.props.index]['Workout']})
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
        console.log(this.state.data)
        const field = (id, item) => (
            <TableCell numeric style={{paddingRight: 0}}>
                <TextField
                id={id}
                label="Number"
                type="number"
                fullWidth={true}
                label=''
                value={this.state.data[this.props.index][id][item]}
                onChange={(e) => this.handleChange(id, item, e)}
                style={{width: '50px', display: this.state.editable ? '' : 'none'}}
                />
            </TableCell>
        )

        const dataCell = (id, item) => (
            <TableCell numeric style={{paddingRight: 0, display: this.state.editable ? 'none' : ''}}>
                {this.state.data[this.props.index][id][item]}
            </TableCell>
        )
        if (Object.keys(this.state.data).length != 0){
            return (<Card style={{backgroundColor: (moment().format('dddd') == this.props.weekdays[this.props.index]) ? '#14e4ff' : ''}} className={classes.Card}>
            <CardHeader title={this.props.weekdays[this.props.index] + ' ' + moment(this.state.data[this.props.index]['Date']).format("YYYY-MM-DD")}/>
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
                                Swim
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
                                Bike
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
                                Workout
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