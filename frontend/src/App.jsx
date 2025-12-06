import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';

function AppContent() {
    const [view, setView] = useState('login'); // 'login', 'register', 'rooms', 'chat'
    const [selectedRoom, setSelectedRoom] = useState(null);
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="text-dark-400 mt-4">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        if (view === 'register') {
            return <Register onSwitchToLogin={() => setView('login')} />;
        }
        return <Login onSwitchToRegister={() => setView('register')} />;
    }

    if (selectedRoom) {
        return (
            <ChatRoom
                room={selectedRoom}
                onLeaveRoom={() => setSelectedRoom(null)}
            />
        );
    }

    return (
        <RoomList
            onSelectRoom={(room) => setSelectedRoom(room)}
        />
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
