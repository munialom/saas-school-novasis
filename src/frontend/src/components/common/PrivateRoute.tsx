import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingState from "../../utils/ui/LoadingState";
import { useAppState } from "../../context/AppState";


interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const { loading } = useAppState();
    const navigate = useNavigate();

    useEffect(() => {
        if(!loading) {
            if (!isAuthenticated()) {
                navigate("/login");
            }
        }
    }, [isAuthenticated, navigate, loading]);



    return (
        <LoadingState loading={loading}>
            {isAuthenticated() ? children : null}
        </LoadingState>
    );
};

export default PrivateRoute;