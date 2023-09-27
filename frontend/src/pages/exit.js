import React, { Component } from 'react';
import { AccessClient } from '../jsclient/echo_grpc_web_pb';
import { ExitRequest } from '../jsclient/echo_pb';


class Exit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputText: '',
      responseText: '',
    };
  }

  handleTextChange = (event) => {
    this.setState({ inputText: event.target.value });
  };

  handleSendRequest = () => {
    const { inputText } = this.state;

    const client = new AccessClient('http://0.0.0.0:8080', null, null);
    const request = new ExitRequest();
    request.setId(inputText);
    client.exitCheck(request, {}, (err, response) => {
        if (!err) {
          const responseText = response.getAccess();
          console.log('Response:', responseText);
          this.setState({ responseText: response.getAccess().toString() });
        } else {
          console.error('Error:', err);
        }
    });
  };

  render() {
    return (
      <div>
        <h1>Exit</h1>
        <div>
          <input
            type="text"
            placeholder="Enter ID"
            value={this.state.inputText}
            onChange={this.handleTextChange}
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

export default Exit;
