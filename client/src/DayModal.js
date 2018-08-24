import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import DayCard from './DayCard.js'

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
            <DayCard weekdays={this.props.weekdays} index={this.props.day} data={this.state.data}/>
        </Modal>
      </div>
    );
  }
}

const DayModalWrapped = withStyles(styles)(DayModal);

export default DayModalWrapped;
