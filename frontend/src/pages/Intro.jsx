import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { useState } from "react";
import ReactLoading from "react-loading";

export const Intro = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  function moveTosignUpPage() {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/signup");
      setIsLoading(false);
    }, 1000);
  }
  function moveTosignInPage() {
    setIsLoading(true);
    setTimeout(() => {
      navigate("/signin");
      setIsLoading(false);
    }, 1000);
  }
  return (
    <div className="bg-slate-300 h-screen justify-center items-center flex flex-col relative">
      {!isLoading && (
        <div className="justify-center items-center flex flex-col">
          <div className="mb-20">
            <h1 className="font-bold text-4xl">Welcome to PayTM</h1>
          </div>
          <div className="w-max">
            <Button onClick={moveTosignUpPage} label={"Signup"}></Button>
            <Button onClick={moveTosignInPage} label={"Signin"}></Button>
          </div>
        </div>
      )}
      {isLoading && (
        <div>
          <ReactLoading type="bars" color="#00000" height={100} width={100} />
        </div>
      )}
    </div>
  );
};
