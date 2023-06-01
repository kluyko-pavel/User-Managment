import { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { IUserInfo } from "../../types";
import { getCurrentUser, logOut } from "../../utils";
import { FETCH_URL } from "../../constants";

export const MainPage = () => {
  const [users, setUsers] = useState([] as IUserInfo[]);
  const [selectedUsers, setSelectedUsers] = useState(new Set() as any);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      const token = localStorage.getItem("accessToken");
      const resp: Response = await fetch(`${FETCH_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const res: IUserInfo[] = await resp.json();
      setUsers(res);
    }
    fetchUsers();
  }, []);

  const handleSelectAll = (e: any) => {
    const isChecked: boolean = e.target.checked;
    const userIds: string[] = users.map((user: IUserInfo) => user._id);
    if (isChecked) {
      const selectedSet = new Set(userIds);
      setSelectedUsers(selectedSet);
    } else {
      const selectedUsers = new Set();
      setSelectedUsers(selectedUsers);
    }
    setSelectAll(isChecked);
  };

  const handleSelectUser = (e: any) => {
    const isChecked: boolean = e.target.checked;
    const userId: string = e.target.name;

    if (isChecked) {
      setSelectedUsers(new Set(selectedUsers.add(userId)));
    } else {
      const newSelectedUsers = new Set(selectedUsers);
      newSelectedUsers.delete(userId);
      setSelectedUsers(newSelectedUsers);
      setSelectAll(false);
    }
  };

  const handleBlockUsers = async () => {
    const token: string = localStorage.getItem("accessToken") || "";
    const resp: Response = await fetch(`${FETCH_URL}/users/block`, {
      method: "PUT",
      body: JSON.stringify({
        userIds: [...selectedUsers],
        currentUser: getCurrentUser(),
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (resp.ok) {
      alert("Users blocked successfully");
      if (selectedUsers.has(getCurrentUser()._id)) {
        logOut();
      } else {
        window.location.reload();
      }
    } else {
      resp.status === 403
        ? alert("Your account has been deleted or blocked")
        : alert("Failed to block users");
      logOut();
    }
  };

  const handleUnblockUsers = async () => {
    const token: string = localStorage.getItem("accessToken") || "";
    const resp = await fetch(`${FETCH_URL}/users/unblock`, {
      method: "PUT",
      body: JSON.stringify({
        userIds: [...selectedUsers],
        currentUser: getCurrentUser(),
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (resp.ok) {
      alert("Users unblocked successfully");
      window.location.reload();
    } else {
      resp.status === 403
        ? alert("Your account has been deleted or blocked")
        : alert("Failed to unblock users");
      logOut();
    }
  };

  const handleDeleteUsers = async () => {
    const token: string = localStorage.getItem("accessToken") || "";
    const resp: Response = await fetch(`${FETCH_URL}/users/delete`, {
      method: "DELETE",
      body: JSON.stringify({
        userIds: [...selectedUsers],
        currentUser: getCurrentUser(),
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (resp.ok) {
      alert("Users deleted successfully");
      selectedUsers.has(getCurrentUser()._id)
        ? logOut()
        : window.location.reload();
    } else {
      resp.status === 403
        ? alert("Your account has been deleted or blocked")
        : alert("Failed to delete users");
      logOut();
    }
  };

  const getSelectedStatus = (): string => {
    if (selectAll) {
      return "all";
    } else if (selectedUsers.size === 0) {
      return "none";
    } else {
      return "some";
    }
  };

  const renderToolbar = () => {
    const selectedStatus: string = getSelectedStatus();
    switch (selectedStatus) {
      case "all":
        return (
          <div>
            <Button
              onClick={handleBlockUsers}
              disabled={selectedUsers.size === 0}
            >
              Block All
            </Button>
            <Button
              onClick={handleUnblockUsers}
              disabled={selectedUsers.size === 0}
            >
              Unblock All
            </Button>
            <Button variant="danger" onClick={handleDeleteUsers}>
              Delete all
            </Button>
          </div>
        );
      case "none":
        return null;
      case "some":
        return (
          <div>
            <Button
              onClick={handleBlockUsers}
              disabled={selectedUsers.size === 0}
            >
              Block
            </Button>
            <Button
              onClick={handleUnblockUsers}
              disabled={selectedUsers.size === 0}
            >
              Unblock
            </Button>
            <Button variant="danger" onClick={handleDeleteUsers}>
              Delete
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Users</h1>
      <div>
        <Form.Check
          type="checkbox"
          label="Select all / deselect"
          checked={selectAll}
          onChange={handleSelectAll}
        />
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Registration date</th>
            <th>Last entry</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: IUserInfo) => (
            <tr key={user._id}>
              <td>
                <Form.Check
                  type="checkbox"
                  name={user._id}
                  checked={selectedUsers.has(user._id)}
                  onChange={handleSelectUser}
                />
              </td>
              <td>{user._id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.registrationDate}</td>
              <td>{user.lastLogin}</td>
              <td>{user.status}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      {renderToolbar()}
    </div>
  );
};
