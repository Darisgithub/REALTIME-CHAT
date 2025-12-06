export default function OnlineUsers({ users, currentUserId }) {
    return (
        <div className="card p-4 h-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-dark-200 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                    Online Users
                </h3>
                <span className="text-xs bg-dark-700 px-2 py-1 rounded-full text-dark-300">
                    {users.length}
                </span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)]">
                {users.length === 0 ? (
                    <p className="text-dark-500 text-sm text-center py-4">No users online</p>
                ) : (
                    users.map((user) => (
                        <div
                            key={user.userId}
                            className="flex items-center space-x-3 p-2.5 rounded-lg bg-dark-700/50 hover:bg-dark-700 transition-colors"
                        >
                            <div className="relative">
                                <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-dark-800 rounded-full"></span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-dark-100 truncate">
                                    {user.username}
                                    {user.userId === currentUserId && (
                                        <span className="text-xs text-primary-400 ml-1">(You)</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
