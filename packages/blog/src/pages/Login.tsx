import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      console.log(data);
      const res = await fetch("http://localhost:3000/auth/login", {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          ...data,
        }),
      });
      const resJson = await res.json();
      localStorage.setItem("jwt", resJson.access_token);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  console.log(watch("email"), watch("password")); // watch input value by passing the name of it

  return (
    <div className="flex flex-col">
      <div className="text-left">
        <Link to={"/"}>
          <p className="inline-block font-light bg-teal-500 text-white rounded-md p-1 shadow-md drop-shadow-md">
            👈🏼 Volver
          </p>
        </Link>
      </div>
      <div className="justify-center">
        <h1 className="text-3xl">Identificarse</h1>
        <br />
        <ul>
          <li>
            Password is always{" "}
            <code className="bg-black text-white p-1 rounded-sm">
              superSecret
            </code>
          </li>
          <li>You should find the email on the db</li>
          <li>
            DB:{" "}
            <code className="bg-black text-white p-1 rounded-sm">backend</code>,
            USER:{" "}
            <code className="bg-black text-white p-1 rounded-sm">user</code>,
            PASSWORD:{" "}
            <code className="bg-black text-white p-1 rounded-sm">
              rootpassword
            </code>
          </li>
          <br />
        </ul>
        <div className="flex justify-center">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="block w-1/3 bg-green-300 shadow-lg p-5 rounded-md"
          >
            <label htmlFor="email">
              <p>Email</p>
              <input
                id="email"
                type="email"
                {...register("email", { required: true })}
              />
            </label>
            {errors.email && <span>This field is required</span>}
            <label htmlFor="password">
              <p>Password</p>
              <input
                type="password"
                id="password"
                {...register("password", { required: true })}
              />
            </label>
            {errors.password && <span>This field is required</span>}
            <br />
            <button
              role="button"
              type="submit"
              className="rounded-md bg-blue-500 p-4 mt-5 text-white shadow-md"
            >
              Ingresar <i></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
