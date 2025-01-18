
import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect
} from "react";
import { login as performLogin, logout as performLogout } from "../services/client";
import { jwtDecode } from "jwt-decode";

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



    const decodeTokenAndSetState = useCallback((jwtToken: string | null) => {
        if (jwtToken) {
            try {
                const decodedToken: any = jwtDecode(jwtToken);
                const tenantIdFromToken = decodedToken?.aud?.[0] ?? null;
                const rolesFromToken = decodedToken?.scopes ?? null;
                setTenantId(tenantIdFromToken);
                setRoles(rolesFromToken);
            } catch (err) {
                console.error("Failed to decode token or extract tenantId/scopes", err);
                setTenantId(null);
                setRoles(null);
            }
        } else {
            setTenantId(null);
            setRoles(null)
        }
    }, []);



    const login = useCallback(async (usernameAndPassword: any) => {
        return new Promise((resolve, reject) => {
            performLogin(usernameAndPassword)
                .then(res => {
                    const jwtToken = res.data.token;
                    localStorage.setItem("access_token", jwtToken);
                    setToken(jwtToken);
                    decodeTokenAndSetState(jwtToken);
                    resolve(res);
                })
                .catch(err => {
                    reject(err);
                })
        });
    }, [decodeTokenAndSetState]);


    const logout = useCallback(async () => {
        await performLogout();
        localStorage.removeItem("access_token");
        setToken(null);
        decodeTokenAndSetState(null)
    }, [performLogout, decodeTokenAndSetState]);


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

    useEffect(() => {
        decodeTokenAndSetState(token);
    }, [token, decodeTokenAndSetState]);


    // Check for token on mount,
    useEffect(() => {
        if (token) {
            isAuthenticated();
        }
    }, [token, isAuthenticated]);


    return (
        <AuthContext.Provider value={{ token, tenantId, roles, login, logout, isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;