import React, { Component } from 'react';
import { Input, Button, Modal } from 'antd';

import { AccessClient } from '../jsclient/echo_grpc_web_pb';
import { ExitRequest } from '../jsclient/echo_pb';
import "../App.css";

const ModalFooter = ({ onClose, isAuth }) => (
  <div style={{  textAlign: 'center', margin: '0 auto' }}>
    <Button type="primary" onClick={onClose} danger={!isAuth}>
      {isAuth ? 'Authorized' : 'Not Authorized'}
    </Button>
  </div>
);

class Exit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: '',
      responseText: null,
      isModalOpen: false,
    };
  }

  handleTextChange = (event) => {
    this.setState({ Id: event.target.value });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  }
  

  handleSendRequest = () => {
    const { Id } = this.state;
    const url = window.location.protocol + '//' + window.location.hostname;
    const client = new AccessClient(`${url}`, null, null);
    const request = new ExitRequest();
    request.setId(Id);
    client.exitCheck(request, {}, (err, response) => {
      if (!err) {
        const responseText = response.getAccess();
        this.setState({ isModalOpen: true});
        this.setState({ responseText: responseText, isModalOpen: true });
      } else {
        console.error('Error:', err);
      }
    });
  };
    
  render() {
    return (
      <div className="top-margin">
        <div>
          <Button type="primary" block onClick={this.handleSendRequest}>Exit</Button>
          <br /><br />
          <Input  className="input-text"
            type="text"
            placeholder="Enter ID"
            value={this.state.Id}
            onChange={this.handleTextChange}
          />
        </div>
        <Modal 
          title="Exit" 
          open={this.state.isModalOpen} 
          onCancel={this.closeModal}
          footer={() => <ModalFooter onClose={this.closeModal} isAuth={this.state.responseText} />}
        >
          <p>{this.state.responseText ? 'Bye...' : 'Not allowed'}</p>
        </Modal>

      </div>
    );
  }
}

export default Exit;
