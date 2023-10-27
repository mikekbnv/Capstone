import React, { Component } from 'react';
import { Input, Button, Modal, Upload, message } from 'antd';

import { AccessClient } from '../jsclient/echo_grpc_web_pb'; 
import { EmployeeRequest, Employee } from '../jsclient/echo_pb'; 
import "../App.css";

const ModalFooter = ({ onClose, isAuth }) => (
  <div style={{ textAlign: 'center', margin: '0 auto' }}>
    <Button type="primary" onClick={onClose} danger={!isAuth}>
      { 'Okay'}
    </Button>
  </div>
);

class AddEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: '',
      lname: '',
      position: '',
      photoBytes: '',
      photoName: '',
      photoUrl: null,
      responseText: '',
      isModalOpen: false,
    };
  }

  handleTextChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleFileChange = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const photoBytes = new Uint8Array(event.target.result);
      if (!photoBytes || photoBytes.length === 0) {
        message.error('Error reading the selected photo.');
        return;
      }
      this.setState({ photoBytes }); 
      this.setState({ photoName: file.name });
      const photoUrl = URL.createObjectURL(file);
      this.setState({ photoUrl });
    };
    reader.readAsArrayBuffer(file);
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  }

  handleSendRequest = () => {
    const {fname, lname, position, photoBytes } = this.state;
    const url = window.location.origin;
    const client = new AccessClient(`${url}:8080`, null, null); 
    const request = new EmployeeRequest();
    const employee = new Employee();
    employee.setFname(fname);
    employee.setLname(lname);
    employee.setPosition(position);
    employee.setPhoto(photoBytes);
    request.setEmployee(employee);

    client.addEmployee(request, {}, (err, response) => {
      if (!err) {
        const responseText = response.getId();
        this.setState({ isModalOpen: true });
        console.log('Response:', responseText);
        this.setState({ responseText: responseText.toString()});
      } else {
        console.error('Error:', err);
      }
    });
  };

  render() {
    return (
      <div className="top-margin">
        <div>
          <Button type="primary" block onClick={this.handleSendRequest}>Add Employee</Button>
          <br /><br />
          <Input className="input-text"
            type="text"
            placeholder="First Name"
            name="fname"
            value={this.state.fname}
            onChange={this.handleTextChange}
          />
          <Input className="input-text"
            type="text"
            placeholder="Last Name"
            name="lname"
            value={this.state.lname}
            onChange={this.handleTextChange}
          />
          <Input className="input-text"
            type="text"
            placeholder="Position"
            name="position"
            value={this.state.position}
            onChange={this.handleTextChange}
          />
          <Upload
            accept="image/*"
            showUploadList={false}
            beforeUpload={this.handleFileChange}
          >
            <Button>Select Photo</Button>
          </Upload>
          {this.state.photoName && (
            <p>Selected Photo: {this.state.photoName}</p>
          )}
          {this.state.photoUrl && (
            <img src={this.state.photoUrl} alt="Preview" />
            )}
        </div>
        <Modal
          title="Add Employee"
          visible={this.state.isModalOpen}
          onCancel={this.closeModal}
          footer={() => <ModalFooter onClose={this.closeModal} isAuth={true} />}
        >
          <p>{'Employee added with ID: ' + this.state.responseText}</p>
          
        </Modal>
      </div>
    );
  }
}

export default AddEmployee;
