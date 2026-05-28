import { useEffect, useState } from "react";
import { getMe } from "../api/authApi";

function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const me = await getMe();
                setUser(me);
            }
            catch {
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);
    return { user, loading, isLoggedIn: !!user };
}

export default useAuth;