import React, { Component } from 'react';
import { AccessClient } from '../jsclient/echo_grpc_web_pb';
import { EntranceRequest } from '../jsclient/echo_pb';

class Entrance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: '',
      videoStream: null,
      responseText: '',
    };
    this.videoRef = React.createRef();
  }

  handleTextChange = (event) => {
    this.setState({ Id: event.target.value });
  };

  startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      this.setState({ videoStream: stream });
      this.videoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  stopCamera = () => {
    const { videoStream } = this.state;
    if (videoStream) {
      videoStream.getTracks().forEach((track) => track.stop());
      this.setState({ videoStream: null });
    }
  };

  handleSendRequest = () => {
    const { Id } = this.state;
    const videoElement = this.videoRef.current;

    if (videoElement) {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const imageBytes = new Uint8Array(reader.result);
          var timestamp = Date.now(); 
          var uniqueIdentifier = Math.random().toString(36).substring(7);
          const client = new AccessClient('http://0.0.0.0:8080', null, null);
          const request = new EntranceRequest();
          request.setId(Id);
          request.setFileName(`${Id}_${timestamp}_${uniqueIdentifier}.jpg`);
          request.setChunk(imageBytes);

          client.accessCheck(request, {}, (err, response) => {
            if (!err) {
              const responseText = response.getAccess();
              console.log('Response:', responseText);
              this.setState({ responseText: responseText.toString() });
            } else {
              console.error('Error:', err);
            }
          });
        };
        reader.readAsArrayBuffer(blob);
      });
    } else {
      console.error('Camera not started.');
    }
  };

  componentDidMount() {
    this.startCamera();
  }

  componentWillUnmount() {
    this.stopCamera();
  }

  render() {
    return (
      <div>
        <h1>Entrance</h1>
        <div>
          <input
            type="text"
            placeholder="Enter ID"
            value={this.state.Id}
            onChange={this.handleTextChange}
          />
          <button onClick={this.handleSendRequest}>Send Request</button>
        </div>
        <div>
          <p>Camera:</p>
          <video ref={this.videoRef} autoPlay />
        </div>
        <div>
          <p>Response:</p>
          <p>{this.state.responseText}</p>
        </div>
      </div>
    );
  }
}

export default Entrance;
