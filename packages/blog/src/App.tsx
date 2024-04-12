import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./App.scss";

function App() {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("jwt"));
  const logout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.removeItem("jwt");
    setIsLogged(false);
  };

  return (
    <>
      <div className="flex justify-between">
        <div className="w-1/3"></div>
        <h1 className="text-3xl font-bold uppercase">
          <Link to={"/"}>Blog Encora test</Link>
        </h1>
        <div className="flex justify-end w-1/3">
          {isLogged ? (
            <a className="mr-4" onClick={logout} role="button">
              Logout
            </a>
          ) : (
            <>
              <Link className="mr-4" to={"login"}>
                Login
              </Link>
              <div>|</div>
              <Link className="ml-4" to={"register"}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col justify-center pt-28">
        <Outlet />
      </div>
    </>
  );
}

export default App;
