import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect
} from "react";
import { login as performLogin, logout as performLogout } from "../services/client";
import { jwtDecode } from "jwt-decode";
import { useAppState } from "./AppState";


interface AuthContextType {
    token: string | null;
    tenantId: string | null;
    roles: string[] | null;
    login: (usernameAndPassword: any) => Promise<any>;
    logout: () => Promise<void>;
    isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
    token: null,
    tenantId: null,
    roles: null,
    login: async () => { },
    logout: async () => { },
    isAuthenticated: () => false,
});

interface AuthProviderProps {
    children: React.ReactNode;
}


const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem("access_token"));
    const [tenantId, setTenantId] = useState<string | null>(null);
    const [roles, setRoles] = useState<string[] | null>(null);
    const { setLoading } = useAppState();


    const login = useCallback(async (usernameAndPassword: any) => {
        setLoading(true) // Set loading to true before login starts
        return new Promise((resolve, reject) => {
            performLogin(usernameAndPassword)
                .then(res => {
                    const jwtToken = res.data.token;
                    localStorage.setItem("access_token", jwtToken);
                    setToken(jwtToken);

                    try {
                        const decodedToken: any = jwtDecode(jwtToken);
                        const tenantIdFromToken = decodedToken?.aud[0] ?? null;
                        setTenantId(tenantIdFromToken);
                        const rolesFromToken = decodedToken?.scopes ?? null;
                        setRoles(rolesFromToken);
                    } catch (err) {
                        console.error("Failed to decode token or extract tenantId/scopes", err);
                    }

                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                })
                .finally(() => setLoading(false)); // Set loading to false no matter the response
        });
    }, [setLoading]);


    const logout = useCallback(async () => {
        setLoading(true)
        await performLogout();
        localStorage.removeItem("access_token");
        setToken(null);
        setTenantId(null);
        setRoles(null);
        setLoading(false) // Set loading to false
    }, [setLoading, performLogout]);


    const isAuthenticated = useCallback(() => {
        if (!token) {
            return false;
        }

        try {
            const { exp } = jwtDecode(token) as { exp: number };
            if (Date.now() > exp * 1000) {
                logout();
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error decoding or validating token:", error);
            return false;
        }
    }, [token, logout]);

    // Check for token on mount, and set loading to false
    useEffect(() => {
        if(token){
            isAuthenticated();
        }
        setLoading(false) // Set loading to false after auth check
    }, [token, isAuthenticated, setLoading]);


    return (
        <AuthContext.Provider value={{ token, tenantId, roles, login, logout, isAuthenticated}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;