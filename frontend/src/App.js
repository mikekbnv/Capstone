import React, { Component } from 'react';
import { AccessClient } from './jsclient/echo_grpc_web_pb';
import { AccessRequest } from './jsclient/echo_pb';


class GrpcClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      selectedFile: null,
      responseText: '',
    };
  }

  handleTextChange = (event) => {
    this.setState({ inputText: event.target.value });
  };

  handleFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  handleSendRequest = () => {
    const { inputText, selectedFile } = this.state;

    const client = new AccessClient('http://localhost:8080', null, null);

    const reader = new FileReader();
    reader.onload = () => {
      const imageBytes = new Uint8Array(reader.result);

      const request = new AccessRequest();
      request.setId(inputText);
      request.setFileName(selectedFile.name);
      request.setChunk(imageBytes);
      
      client.accessCheck(request, {}, (err, response) => {
        if (!err) {
          const responseText = response.getAccess();
          console.log('Response:', responseText);
          this.setState({ responseText: response.getAccess().toString() });
        } else {
          console.error('Error:', err);
        }
      });
    };

    if (selectedFile) {
      reader.readAsArrayBuffer(selectedFile);
    } else {
      console.error('No file selected.');
    }
  };

  render() {
    return (
      <div>
        <h1>Client</h1>
        <div>
          <input
            type="text"
            placeholder="Enter text"
            value={this.state.inputText}
            onChange={this.handleTextChange}
          />
          <input
            type="file"
            accept="image/*"
            onChange={this.handleFileChange}
          />
          <button onClick={this.handleSendRequest}>Send Request</button>
        </div>
        <div>
          <p>Response:</p>
          <p>{this.state.responseText}</p>
        </div>
      </div>
    );
  }
}

export default GrpcClient;
