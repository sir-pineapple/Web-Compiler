import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { logout } from "../api/authApi";

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();
    const handleProjects = () => {
        if (isLoggedIn) {
            navigate("/projects");
        }
        else {
            navigate("/login", {
                state: { from: "/projects" }
            });
        }
    };
    const handleLogout = async () => {
        await logout();
        navigate("/");
        window.location.reload();
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950 text-white">
            <button onClick={() => navigate("/")} className="text-xl font-bold cursor-pointer">Web Compiler</button>
            <div className="flex items-center gap-4">
                <button onClick={handleProjects} className="hover:text-zinc-300 cursor-pointer">Projects</button>
                {!isLoggedIn ? (
                    <>
                        <button onClick={() => navigate("/login")} className="hover:text-zinc-300 cursor-pointer">Login</button>
                        <button onClick={() => navigate("/register")} className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition cursor-pointer">Register</button>
                    </>
                ) : (
                    <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition cursor-pointer">Logout</button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;