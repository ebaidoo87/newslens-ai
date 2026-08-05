import {

  useState,

  type FormEvent,

} from "react";



import {

  Link,

  useLocation,

  useNavigate,

} from "react-router-dom";



import { useAuth } from "../../../shared/context/AuthContext";





interface RedirectState {

  from?: {

    pathname?: string;

  };

}





interface LoginLocationState
  extends RedirectState {
  registrationSuccess?: boolean;
  passwordChanged?: boolean;
}





export default function LoginPage() {

  const navigate = useNavigate();

  const location = useLocation();



  const { login } = useAuth();



  const locationState =

    location.state as LoginLocationState | null;



  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");



  const [isSubmitting, setIsSubmitting] =

    useState(false);



  const [error, setError] = useState("");





  async function handleSubmit(

    event: FormEvent<HTMLFormElement>,

  ) {

    event.preventDefault();



    setError("");

    setIsSubmitting(true);



    try {

      await login({

        email,

        password,

      });



      const destination =

        locationState?.from?.pathname ?? "/";



      navigate(destination, {

        replace: true,

      });

    } catch {

      setError(

        "Invalid email or password. Please try again.",

      );

    } finally {

      setIsSubmitting(false);

    }

  }





  return (

    <div className="mx-auto flex min-h-[70vh] max-w-md items-center">

      <div className="w-full rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">



        <div className="mb-8">

          <h1 className="text-3xl font-bold">

            Welcome back

          </h1>



          <p className="mt-2 text-gray-400">

            Sign in to your NewsLens account.

          </p>

        </div>





        {locationState?.registrationSuccess && (

          <div className="mb-6 rounded-lg border border-green-800 bg-green-950 p-4 text-green-200">

            Your account was created successfully. You can now sign in.

          </div>

        )}



        {locationState?.passwordChanged && (
          <div className="mb-6 rounded-lg border border-green-800 bg-green-950 p-4 text-green-200">
            Your password was changed successfully.
            Sign in using your new password.
          </div>
        )}





        {error && (

          <div className="mb-6 rounded-lg border border-red-800 bg-red-950 p-4 text-red-200">

            {error}

          </div>

        )}





        <form

          onSubmit={handleSubmit}

          className="space-y-5"

        >

          <div>

            <label

              htmlFor="email"

              className="mb-2 block text-sm font-medium text-gray-300"

            >

              Email

            </label>



            <input

              id="email"

              type="email"

              value={email}

              onChange={(event) =>

                setEmail(event.target.value)

              }

              required

              autoComplete="email"

              placeholder="emmanuel@example.com"

              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"

            />

          </div>





          <div>

            <label

              htmlFor="password"

              className="mb-2 block text-sm font-medium text-gray-300"

            >

              Password

            </label>



            <input

              id="password"

              type="password"

              value={password}

              onChange={(event) =>

                setPassword(event.target.value)

              }

              required

              autoComplete="current-password"

              placeholder="Enter your password"

              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white outline-none transition focus:border-blue-500"

            />

          </div>





          <button

            type="submit"

            disabled={isSubmitting}

            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"

          >

            {isSubmitting

              ? "Signing in..."

              : "Sign in"}

          </button>

        </form>





        <p className="mt-6 text-center text-sm text-gray-400">

          Don&apos;t have an account?{" "}

          <Link

            to="/register"

            className="font-medium text-blue-400 hover:text-blue-300"

          >

            Create one

          </Link>

        </p>



      </div>

    </div>

  );

}