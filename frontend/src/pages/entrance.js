import React, { Component } from 'react';
import { Input, Button, Modal } from 'antd';

import { AccessClient } from '../jsclient/echo_grpc_web_pb';
import { EntranceRequest } from '../jsclient/echo_pb';
import "../App.css";

const ModalFooter = ({ onClose, isAuth }) => (
  <div style={{  textAlign: 'center', margin: '0 auto' }}>
    <Button type="primary" onClick={onClose} danger={!isAuth}>
      {isAuth ? 'Authorized' : 'Not Authorized'}
    </Button>
  </div>
);

class Entrance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Id: '',
      videoStream: null,
      responseText: '',
      isModalOpen: false,
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
    // setState -> useState => [value, setValue]
    // setVideoStream(null)

      this.setState({ videoStream: null });
    }
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  }

  handleSendRequest = () => {
    const { Id } = this.state;
    const videoElement = this.videoRef.current;

    if (videoElement) {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height );
      canvas.toBlob((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          const imageBytes = new Uint8Array(reader.result);
          var timestamp = Date.now(); 
          var uniqueIdentifier = Math.random().toString(36).substring(7);
          const url = 'http' + '//' + window.location.hostname;
          console.log(url);
          const client = new AccessClient(`${url}:8080`, null, null);
          const request = new EntranceRequest();
          request.setId(Id);
          request.setFileName(`${Id}_${timestamp}_${uniqueIdentifier}.jpg`);
          request.setChunk(imageBytes);

          client.accessCheck(request, {}, (err, response) => {
            if (!err) {
              const responseText = response.getAccess();
              this.setState({ isModalOpen: true});
              console.log('Response:', responseText);
              this.setState({ responseText: responseText, isModalOpen: true });
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
    // useEffect
    this.startCamera();
  }

  componentWillUnmount() {
    // useEffect

    this.stopCamera();
  }

  render() {
    return (
      <div className="top-margin">
        <div>
          <Button type="primary" block onClick={this.handleSendRequest}>Get access</Button>
          <br /><br />
          <Input  className="input-text"
            type="text"
            placeholder="Enter ID"
            value={this.state.Id}
            onChange={this.handleTextChange}
          />
        </div>
        <div>
          <video className="camera-caption" ref={this.videoRef} autoPlay />
        </div>
        <Modal 
          title="Access" 
          open={this.state.isModalOpen} 
          onCancel={this.closeModal}
          footer={() => <ModalFooter onClose={this.closeModal} isAuth={this.state.responseText} />}
        >
          <p>{this.state.responseText ? 'Welcome ...' : 'Not allowed'}</p>
        </Modal>
      </div>
    );
  }
}

export default Entrance;
