import React from 'react';
import MainLayout from './components/common/MainLayout';
import { AppStateProvider } from './context/AppState';

const App: React.FC = () => {
    return (
        <AppStateProvider>
            <MainLayout>
                {/*PlaceHolder for any content outside the routes*/}
                <div />
            </MainLayout>
        </AppStateProvider>
    );
};

export default App;