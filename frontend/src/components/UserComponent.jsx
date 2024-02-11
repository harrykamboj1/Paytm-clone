/* eslint-disable react/prop-types */
import { useState } from "react";
import { Button } from "./Button";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const UserComponent = ({ username }) => {
  // Replace with backend call
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  useEffect(() => {
    try {
      axios
        .get("http://localhost:3000/api/v1/user/bulk?filter=" + filter)
        .then((response) => {
          setUsers(response.data.user);
        });
    } catch (e) {
      console.log(e);
    }
  }, [filter]);

  return (
    <>
      <div className="p-8">
        <div className="border-2 border-black p-5 rounded-3xl">
          <div className="font-bold mt-2 text-xl">Users</div>
          <div className="mt-4">
            <div>
              <input
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
                type="text"
                placeholder="Search users..."
                className="w-full px-2 py-1 border rounded-lg border-slate-200 bg-gray-100"
              ></input>
            </div>
            <div className="mt-10">
              {users.map((user) => (
                <User key={user._id} user={user} username={username} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function User({ user, username }) {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex font-semibold flex-col justify-center h-full text-xl">
            {user.firstName[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center h-ful">
          <div className="font-bold mt-1 ml-1 text-lg">
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-ful">
        <Button
          onClick={() => {
            navigate(
              "/send?id=" +
                user._id +
                "&name=" +
                user.firstName +
                "&userId=" +
                username
            );
          }}
          label={"Send Money"}
        />
      </div>
    </div>
  );
}
