import React, { useEffect, useState } from "react";
import "./StartingPageContent.module.css";

const StartingPageContent = () => {
  const [loggedUserData, setLoggedUserData] = useState([]);
  const [usersData, setUsersData] = useState([]);

  const getCurrentUser = async () => {
    const response = await fetch(
      "http://localhost:3000/api/main/getCurrentUserInfo/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      }
    );
    const data = await response.json();
    setLoggedUserData(data);
  };

  const getAllUsers = async () => {
    const response = await fetch(
      "http://localhost:3000/api/main/getAllUsers/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      }
    );
    const data = await response.json();
    setUsersData(data);
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const renderUser = (user) => {
    return (
      <tr
        style={{
          color: user.status === "On Vacation" ? "red" : "black",
        }}
        key={user.email}
      >
        <td>{user.name}</td>
        <td>{user.email}</td>
        <td>{user.status}</td>
      </tr>
    );
  };

  const RenderLoggedInUser = () => {
    getCurrentUser();
    return (
      <div>
        <h5>
          Shalom {loggedUserData.name}, your current status is:{" "}
          {loggedUserData.status}
        </h5>
      </div>
    );
  };

  const RenderUserList = () => {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <td>
                <b>Name</b>
              </td>
              <td>
                <b>Email</b>
              </td>
              <td>
                <b>Status</b>
              </td>
            </tr>
          </thead>
          <tbody>{usersData.map((user) => renderUser(user))}</tbody>
        </table>
      </div>
    );
  };

  const getUsersByName = async () => {
    const response = await fetch(
      "http://localhost:3000/api/main/getUsersByName/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      }
    );
    const data = await response.json();
    setUsersData(data);
  };

  const getUsersByEmail = async () => {
    const response = await fetch(
      "http://localhost:3000/api/main/getUsersByEmail/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      }
    );
    const data = await response.json();
    setUsersData(data);
  };

  const getUsersByStatus = async () => {
    const response = await fetch(
      "http://localhost:3000/api/main/getUsersByStatus/",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
      }
    );
    const data = await response.json();
    setUsersData(data);
  };

  return (
    <div>
      <RenderLoggedInUser />
      <button onClick={getAllUsers}>Get All Users</button>
      <button onClick={getUsersByName}>Get Users by Name</button>
      <button onClick={getUsersByStatus}>Get Users Status</button>
      <button onClick={getUsersByEmail}>Get Users Email</button>
      <RenderUserList />
    </div>
  );
};

export default StartingPageContent;
