import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import DayCard from './DayCard.js'
import moment from 'moment';

const styles = theme => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  }
});

class DayModal extends React.Component {
  state={data: this.props.data}

  handleClose = () => {
    this.props.onClose();
  };

  componentWillReceiveProps(nextProps){
    this.setState({data: nextProps.data})
  }

  getDate = (day) => {
    return(this.props.weekdays[moment(this.state.data['Date']).isoWeekday()-1] + ' ' + moment(this.state.data['Date']).format("YYYY-MM-DD") )
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Modal
          style={{justifyContent: 'center', alignItems: 'center'}}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.props.open}
          onClose={this.handleClose}
        >
          <div style={{textAlign: 'center', backgroundColor: 'white'}}>
            <h1>{this.getDate(this.props.day)}</h1>
            <DayCard weekdays={this.props.weekdays} index={this.props.day} data={this.state.data}/>
          </div>
        </Modal>
      </div>
    );
  }
}

const DayModalWrapped = withStyles(styles)(DayModal);

export default DayModalWrapped;
