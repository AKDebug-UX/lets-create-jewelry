import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import Footer from "../shared/Footer/index";
import AuthNavbar from "../shared/Navbar/authNav";
import { signUp } from "../../Controller";
import { toast } from "react-toastify";
import { AuthStatus } from "../../Context/Usecontext";

const SignupForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState(false);
  const { setUser } = useContext(AuthStatus);

  //DESTRUCTURE SETUSER OUT OF THE CONTEXT

  // Hnadle SIGN UP
  const createUserAccount = async () => {
    setLoading(true);
    try {
      const data = await signUp(email, password, setLoading, name);

      //SAVE USER DATA IN USE CONTeXT TO MAKE IT PRESENT THROUGH OUT THE WEB APP
      setUser(data);

      // Redirect to the login page after successful sign-in
      navigate("/sign-in");
      toast.success("Account created, check your mail for verification link");

    } catch (error) {
      // Handle sign-up error
      console.error("Error signing up:");
      setError(
        "Failed to sign up. Please check your credentials and try again."
      );
      toast.error("Failed to sign up. " + error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthNavbar />
      <div className="flex flex-col gap-5 my-12 mx-3 md:mx-[10rem] lg:mx-[18em] text-center justify-center items-center">
        <h2 className="text-[30px] text-black font-bold pt-5 sm:pt-12">
          Create a new account
        </h2>
        <p className="text-primary_A2 small-medium md:base-regular mt-2">
          To use Lets-Create-Jewelry, Please enter your details
        </p>

        <div className="flex flex-col text-left gap-5 w-full mt-4">
          <div>
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Akorede Salaudeen"
              className="border rounded p-2 w-full"
              required
            />
          </div>

          <div>
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="akorede123"
              className="border rounded p-2 w-full"
              required
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="......54@gmail.com"
              className="border rounded p-2 w-full"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="border rounded p-2 w-full"
              required
            />
          </div>

          <button
            type="submit"
            onClick={createUserAccount}
            className="bg-primary text-white p-3 rounded-md"
          >
            {isLoading ? (
              <div className="flex gap-3 justify-center items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-4 border-white"></div>
                Loading...
              </div>
            ) : (
              "Sign Up"
            )}
          </button>

          <p className="text-small-regular text-light-2 text-left mt-2">
            Already have an account?
            <Link
              to="/sign-in"
              className="text-primary text-small-semibold ml-1"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SignupForm;
