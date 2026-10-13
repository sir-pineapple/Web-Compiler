import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar"
import { login, getMe } from "../api/authApi"

function Login() {
    const location = useLocation();
    const redirectTo = location.state?.from || "/";
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    useEffect(() => {
        const check = async () => {
            const user = await getMe();
            if (user) {
                navigate(redirectTo);
            }
        };
        check();
    }, [navigate]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const response = await login(email, password);
        if (response.ok) {
            navigate(redirectTo);
        }
        else {
            const data = await response.json();
            setError(data.message);
        }
    };
    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
                <form onSubmit={handleSubmit} className="bg-zinc-900 p-8 rounded-xl border border-zinc-800 w-full max-w-md space-y-4">
                    <h1 className="text-3xl font-bold">
                        Login
                    </h1>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-zinc-800 outline-none" />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-zinc-800 outline-none" />
                    {error && (
                        <p className="text-red-400">
                            [error]
                        </p>
                    )}
                    <button type="submit" className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 cursor-pointer">
                        Login
                    </button>
                </form>
            </div>
        </>
    );
}

export default Login;