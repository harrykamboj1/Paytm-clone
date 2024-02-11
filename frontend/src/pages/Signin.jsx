import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import axios from "axios";
export const Signin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        {!isLoading && (
          <div>
            <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
              <div>
                <Heading label={"Sign in"} />
                <SubHeading
                  label={"Enter your credentials to access your account"}
                />
                <InputBox
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  placeholder="johndoe@gmail.com"
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
                        setIsLoading(true);
                        const response = await axios.post(
                          "http://localhost:3000/api/v1/user/signin",
                          {
                            username: username,
                            password: password,
                          }
                        );
                        if (response.data.token != null) {
                          localStorage.setItem("token", response.data.token);
                          setIsLoading(false);
                          navigate("/dashboard?userId=" + username);
                        } else {
                          alert(response.data.message);
                        }
                        setUsername("");
                        setPassword("");
                        setIsLoading(false);
                      } catch (e) {
                        console.log(e.response.data.message);
                        setUsername("");
                        setPassword("");
                        setIsLoading(false);
                        alert(e.response.data.message);
                      }
                    }}
                    label={"Sign in"}
                  />
                </div>
                <BottomWarning
                  label={"Don't have an account?"}
                  buttonText={"Sign up"}
                  to={"/signup"}
                />
              </div>
            </div>
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
