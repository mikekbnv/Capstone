import React, { Component } from 'react';
import { List, Space, Table, Tag } from 'antd';


import { AccessClient } from '../jsclient/echo_grpc_web_pb'; 
import { EmptyRequest, DeleteEmployeeRequest } from '../jsclient/echo_pb'; 
import "../App.css";


class ListEmployees extends Component {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      currentPage: 1,
      employeesPerPage: 50
    };
  }

  componentDidMount() {
    const url = window.location.protocol + '//' + window.location.hostname;
    const client = new AccessClient(`${url}`, null, null); 
    const request = new EmptyRequest();

    client.listEmployees(request, {}, (err, response) => {
      if (!err) {
        this.setState({ employees: response.getEmployeesList() });
      } else {
        console.error('Error:', err);
      }
    });
  }

  handleDelete = (id) => {
    const url = window.location.protocol + '//' + window.location.hostname;
    const client = new AccessClient(`${url}`, null, null); 
    const request = new DeleteEmployeeRequest();
    request.setId(id);

    client.deleteEmployee(request, {}, (err, response) => {
      if (!err) {
        this.setState((prevState) => ({
          employees: prevState.employees.filter((employee) => employee.getId() !== id),
        }));
      } else {
        console.error('Error:', err);
      }
    });
  };
  renderTable = () => (
    <Table columns={this.columns} dataSource={this.state.employees} />
  );
  columns = [
    {
      title: 'ID',
      dataIndex: 'Id',
      key: 'Id',
      render: (text, record) => <a>{record.getId()}</a>,
    },
    {
      title: 'First Name',
      dataIndex: 'fname',
      key: 'fname',
      render: (text, record) => <a>{record.getFname()}</a>,
    },
    {
      title: 'Last Name',
      dataIndex: 'lname',
      key: 'lname',
      render: (text, record) => <a>{record.getLname()}</a>,
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (text, record) => <a>{record.getPosition()}</a>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button onClick={() => this.handleDelete(record.getId())}>Delete</button>
        </Space>
      ),
    },
  ];
  render() {
    return (
      <div className="top-margin">
        {this.renderTable()}
      </div>
    );
  }
}

export default ListEmployees;