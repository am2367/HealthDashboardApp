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
        const field = (id, item, expected) => (
            <TableCell numeric style={{paddingRight: 0, display: this.state.editable ? '' : 'none', textAlign: 'center'}}>
                <TextField
                id={id}
                label="Actual"
                fullWidth={true}
                type="number"
                value={this.state.data[id][item]}
                onChange={(e) => this.handleChange(id, item, e)}
                style={{width: '70px'}}
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                id={id}
                label="Expected"
                fullWidth={true}
                type="number"
                value={this.state.data[id][expected]}
                onChange={(e) => this.handleChange(id, expected, e)}
                style={{width: '70px'}}
                variant="outlined"
                InputLabelProps={{
                    shrink: true,
                  }}
                />
            </TableCell>
        )
        const dataCell = (id, item, expected) => (
            <TableCell numeric style={{paddingRight: 0, display: this.state.editable ? 'none' : '', textAlign: 'center'}}>
                {this.state.data[id][item]} | {this.state.data[id][expected]}
            </TableCell>
        )
        if (this.state.data){
            return (<Card style={{backgroundColor: this.isTodayCard() ? '#14e4ff' : ''}} className={classes.Card}>
            {/*<CardHeader title={this.props.weekdays[moment(this.state.data[this.props.index]['Date']).isoWeekday()-1] + ' ' + moment(this.state.data[this.props.index]['Date']).format("YYYY-MM-DD")}/>*/}
            <Grid container style={{margin: 'auto', display: 'flex', paddingLeft: '24px', paddingRight: '24px'}}>
                <Grid item sm={4} md={4} lg={4} style={{textAlign: 'start'}}>
                    <Typography variant="caption"> Actual | Expected </Typography>
                </Grid>
                <Grid item sm={8} md={8} lg={8} 
                      style={{display: 'flex', alignItems: 'flex-end', flexDirection: 'row-reverse'}}>
                    <Button 
                        style={{backgroundColor: this.state.editable ? '#ff0000b3' : '#008000b3'}}  
                        onClick={() => { this.edit() }}>
                        {this.state.editable ? 'Cancel' : 'Edit'}
                    </Button>
                    <Button 
                        style={{backgroundColor: '#008000b3', display: this.state.editable ? '' : 'none'}} 
                        onClick={() => { this.save() }}>
                        Save
                    </Button>
                </Grid>
            </Grid>
            <CardContent style={{overflowX: 'auto'}}>
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell 
                            numeric 
                            style={{paddingRight: 0, textAlign: 'left', width: '50px'}}>
                            Activity
                        </TableCell>
                        <TableCell 
                            numeric 
                            style={{paddingRight: 0, textAlign: 'center', width: '70px'}}>
                            Time(H)
                        </TableCell>
                        <TableCell 
                            numeric 
                            style={{paddingRight: 0, textAlign: 'center', width: '70px', paddingLeft: '15px'}}>
                            Distance(M)
                        </TableCell>
                        <TableCell 
                            numeric 
                            style={{paddingRight: 0, textAlign: 'center', width: '70px', paddingLeft: '15px'}}>
                            Intensity(%)
                        </TableCell>
                        <TableCell 
                            numeric 
                            style={{paddingRight: 0, textAlign: 'center', width: '70px', paddingLeft: '15px'}}>
                            kCals
                        </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody key="Run">
                        <TableRow>
                            <TableCell component="th" scope="row" style={{paddingRight: 0}}>
                                <Icon><RunIcon/></Icon>
                            </TableCell>
                            {dataCell('Run', 'Time', 'TimeExpected')}
                            {dataCell('Run', 'Distance','DistanceExpected')}
                            {dataCell('Run', 'Intensity', 'IntensityExpected')}
                            {dataCell('Run', 'Cals', 'CalsExpected')}
                            {field('Run', 'Time', 'TimeExpected')}
                            {field('Run', 'Distance', 'DistanceExpected')}
                            {field('Run', 'Intensity', 'IntensityExpected')}
                            {field('Run', 'Cals', 'CalsExpected')}
                        </TableRow>
                    </TableBody>
                    <TableBody key="Swim">
                        <TableRow>
                            <TableCell component="th" scope="row" style={{paddingRight: 0}}>
                                <Icon><SwimIcon/></Icon>
                            </TableCell>
                            {dataCell('Swim', 'Time', 'TimeExpected')}
                            {dataCell('Swim', 'Distance', 'DistanceExpected')}
                            {dataCell('Swim', 'Intensity', 'IntensityExpected')}
                            {dataCell('Swim', 'Cals', 'CalsExpected')}
                            {field('Swim', 'Time', 'TimeExpected')}
                            {field('Swim', 'Distance', 'DistanceExpected')}
                            {field('Swim', 'Intensity', 'IntensityExpected')}
                            {field('Swim', 'Cals', 'CalsExpected')}
                        </TableRow>
                    </TableBody>
                    <TableBody key="Bike">
                        <TableRow>
                            <TableCell component="th" scope="row" style={{paddingRight: 0}}>
                                <Icon><BikeIcon/></Icon>
                            </TableCell>
                            {dataCell('Bike', 'Time', 'TimeExpected')}
                            {dataCell('Bike', 'Distance', 'DistanceExpected')}
                            {dataCell('Bike', 'Intensity', 'IntensityExpected')}
                            {dataCell('Bike', 'Cals', 'CalsExpected')}
                            {field('Bike', 'Time', 'TimeExpected')}
                            {field('Bike', 'Distance', 'DistanceExpected')}
                            {field('Bike', 'Intensity', 'IntensityExpected')}
                            {field('Bike', 'Cals', 'CalsExpected')}
                        </TableRow>
                    </TableBody>
                    <TableBody key="Workout">
                        <TableRow>
                            <TableCell component="th" scope="row" style={{paddingRight: 0}}>
                                <Icon><WorkoutIcon/></Icon>
                            </TableCell>
                            {dataCell('Workout', 'Time', 'TimeExpected')}
                            {dataCell('Workout', 'Distance', 'DistanceExpected')}
                            {dataCell('Workout', 'Intensity', 'IntensityExpected')}
                            {dataCell('Workout', 'Cals', 'CalsExpected')}
                            {field('Workout', 'Time', 'TimeExpected')}
                            {field('Workout', 'Distance', 'DistanceExpected')}
                            {field('Workout', 'Intensity', 'IntensityExpected')}
                            {field('Workout', 'Cals', 'CalsExpected')}
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