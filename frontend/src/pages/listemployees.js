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
    const client = new AccessClient(`${url}:8080`, null, null);  // Replace with your gRPC server URL
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
    const client = new AccessClient(`${url}`, null, null);  // Replace with your gRPC server URL
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

  // // render() {
  // //   const { employees, currentPage, employeesPerPage } = this.state;

  // //   const indexOfLastEmployee = currentPage * employeesPerPage;
  // //   const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  // //   const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // //   return (
  // //     <div className="top-margin">
  // //       <table>
  // //         <thead>
  // //           <tr>
  // //             <th>ID</th>
  // //             <th>First Name</th>
  // //             <th>Last Name</th>
  // //             <th>Position</th>
  // //             <th>Action</th>
  // //           </tr>
  // //         </thead>
  // //         <tbody>
  // //           {currentEmployees.map((employee) => (
  // //             <tr key={employee.getId()}>
  // //               <td>{employee.getId()}</td>
  // //               <td>{employee.getFname()}</td>
  // //               <td>{employee.getLname()}</td>
  // //               <td>{employee.getPosition()}</td>
  // //               <td>
  // //                 <button onClick={() => this.handleDelete(employee.getId())}>Delete</button>
  // //               </td>
  // //             </tr>
  // //           ))}
  // //         </tbody>
  // //       </table>
  // //       <Pagination
  // //         employeesPerPage={employeesPerPage}
  // //         totalEmployees={employees.length}
  // //         paginate={(pageNumber) => this.setState({ currentPage: pageNumber })}
  // //       />
  // //     </div>
  // //   );
  // }
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
  // ListEmployees = () => <Table columns={columns} dataSource={this.employees} />;
}

export default ListEmployees;
// const Pagination = ({ employeesPerPage, totalEmployees, paginate }) => {
//   const pageNumbers = [];

//   for (let i = 1; i <= Math.ceil(totalEmployees / employeesPerPage); i++) {
//     pageNumbers.push(i);
//   }

//   return (
//     <nav>
//       <ul className='pagination'>
//         {pageNumbers.map(number => (
//           <li key={number} className='page-item'>
//             <a onClick={() => paginate(number)} className='page-link'>
//               {number}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// };

// export default ListEmployees;
