
// src/frontend/src/components/common/PrivateRoute.tsx
import React, { useEffect } from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingState from "../../utils/ui/LoadingState";
//import ErrorBoundary from "./ErrorBoundary"; // Removed unused ErrorBoundary import

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const navigation = useNavigation()
    const navigate = useNavigate();
    const isLoading = navigation.state === "loading";
    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return (
        <LoadingState loading={isLoading}>
            {isAuthenticated() ? children : null}
        </LoadingState>
    );
};

export default PrivateRoute;