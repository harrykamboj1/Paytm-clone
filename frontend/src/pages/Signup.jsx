import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import axios from "axios";
export const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        {!isLoading && (
          <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <Heading label={"Sign up"} />
            <SubHeading label={"Enter your infromation to create an account"} />
            <InputBox
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
              placeholder="John"
              label={"First Name"}
            />
            <InputBox
              onChange={(e) => {
                setLastName(e.target.value);
              }}
              placeholder="Doe"
              label={"Last Name"}
            />
            <InputBox
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              placeholder="johnDoe@gmail.com"
              label={"Email"}
            />
            <InputBox
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="123456"
              label={"Password"}
            />
            <div className="pt-4">
              <Button
                onClick={async () => {
                  try {
                    if (username === "") {
                      alert("Please Enter Username");
                      return;
                    }
                    if (password === "") {
                      alert("Please Enter Password");
                      return;
                    }
                    if (firstName === "") {
                      alert("Please Enter Firstname");
                      return;
                    }
                    if (lastName === "") {
                      alert("Please Enter Lastname");
                      return;
                    }
                    setIsLoading(true);
                    if (
                      localStorage.getItem("token") != null ||
                      localStorage.getItem("token") != undefined
                    ) {
                      const verify = await axios.post(
                        "http://localhost:3000/api/v1/user/me",
                        {
                          token: localStorage.getItem("token"),
                        }
                      );
                      if (verify.data.status == "1") {
                        alert("Email Already Exists Heading Toward Dashboard");
                        setIsLoading(false);
                        navigate("/dashboard");
                      } else {
                        const response = await axios.post(
                          "http://localhost:3000/api/v1/user/signup",
                          {
                            username: username,
                            password: password,
                            firstName: firstName,
                            lastName: lastName,
                          }
                        );
                        if (response.data.token != null) {
                          localStorage.setItem("token", response.data.token);
                          setIsLoading(false);
                          navigate("/dashboard?userId=" + username);
                        } else {
                          alert(response.data.message);
                        }
                        setFirstName("");
                        setLastName("");
                        setUsername("");
                        setPassword("");
                        setIsLoading(false);
                      }
                    } else {
                      const response = await axios.post(
                        "http://localhost:3000/api/v1/user/signup",
                        {
                          username: username,
                          password: password,
                          firstName: firstName,
                          lastName: lastName,
                        }
                      );
                      if (response.data.token != null) {
                        localStorage.setItem("token", response.data.token);
                        setIsLoading(false);
                        navigate("/dashboard?userId=" + username);
                      } else {
                        alert(response.data.message);
                      }
                      setFirstName("");
                      setLastName("");
                      setUsername("");
                      setPassword("");
                      setIsLoading(false);
                    }
                  } catch (e) {
                    console.log(e.response.data.message);
                    setFirstName("");
                    setLastName("");
                    setUsername("");
                    setPassword("");
                    setIsLoading(false);
                    alert(e.response.data.message);
                  }
                }}
                label={"Sign up"}
              />
            </div>
            <BottomWarning
              label={"Already have an account?"}
              buttonText={"Sign in"}
              to={"/signin"}
            />
          </div>
        )}
        {isLoading && (
          <div>
            <ReactLoading type="bars" color="#00000" height={100} width={100} />
          </div>
        )}
      </div>
    </div>
  );
};
