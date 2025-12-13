'use client';
import { useState } from 'react';

export default function PostCard({ post }) {
    const [reactions, setReactions] = useState({
        heart: 12,
        like: 5,
        laugh: 3
    });
    const [userReaction, setUserReaction] = useState(null); // Loại react của user
    const [showReactionMenu, setShowReactionMenu] = useState(false);

    const reactionEmojis = [
        { type: 'like', emoji: '👍', label: 'Thích' },
        { type: 'heart', emoji: '❤️', label: 'Yêu thích' },
        { type: 'laugh', emoji: '😂', label: 'Haha' },
        { type: 'wow', emoji: '😮', label: 'Wow' },
        { type: 'sad', emoji: '😢', label: 'Buồn' },
        { type: 'angry', emoji: '😠', label: 'Phẫn nộ' }
    ];

    // Hàm xử lý react
    const handleReact = (type) => {
        // Nếu user đã react kiểu này rồi, bỏ react
        if (userReaction === type) {
            setReactions({
                ...reactions,
                [type]: reactions[type] - 1
            });
            setUserReaction(null);
        } else {
            // Nếu user đã react kiểu khác, thay đổi react
            if (userReaction) {
                setReactions({
                    ...reactions,
                    [userReaction]: reactions[userReaction] - 1,
                    [type]: (reactions[type] || 0) + 1
                });
            } else {
                // Nếu user chưa react, thêm mới
                setReactions({
                    ...reactions,
                    [type]: (reactions[type] || 0) + 1
                });
            }
            setUserReaction(type);
        }
        setShowReactionMenu(false);
    };

    // Tính tổng số react
    const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);

    // Hàm lấy emoji của user reaction hiện tại
    const getUserReactionEmoji = () => {
        const reaction = reactionEmojis.find(r => r.type === userReaction);
        return reaction ? reaction.emoji : '👍';
    };

    return (
        <div className="post-card border border-gray-300 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <header className="creator relative mb-2 pb-2 border-b border-gray-200">
                <div className="creator">
                    <img src={`/no_avatar.jpg`} alt="Creator Avatar" className="w-[20px] h-[20px] rounded-full inline-block mr-2" />
                    <span className="font-medium text-xs text-gray-800">User {post.userId}</span>
                </div>
                
                {/* React section - góc trên bên phải */}
                <div className="absolute top-0 right-0 flex flex-row gap-2 items-center">
                    <button 
                        onMouseEnter={() => setShowReactionMenu(true)}
                        onMouseLeave={() => setShowReactionMenu(false)}
                        className="flex items-center gap-1 text-gray-600 hover:text-blue-500 text-sm px-2 py-1 rounded hover:bg-gray-100 relative"
                    >
                        <span>{userReaction ? getUserReactionEmoji() : '👍'}</span>
                        <span className="text-xs">{totalReactions}</span>
                    </button>

                    {/* Reaction Menu - hiện khi hover */}
                    {showReactionMenu && (
                        <div 
                            className="absolute top-7 right-0 bg-white border border-gray-300 rounded-lg shadow-lg p-2 flex flex-row gap-1 z-10"
                            onMouseEnter={() => setShowReactionMenu(true)}
                            onMouseLeave={() => setShowReactionMenu(false)}
                        >
                            {reactionEmojis.map((reaction) => (
                                <button
                                    key={reaction.type}
                                    onClick={() => handleReact(reaction.type)}
                                    title={reaction.label}
                                    className={`text-xl p-2 rounded hover:bg-gray-100 transition-colors ${
                                        userReaction === reaction.type ? 'bg-gray-100 scale-125' : ''
                                    }`}
                                >
                                    {reaction.emoji}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </header>
            
            <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-700 text-sm mb-4">{post.content}</p>
            
            {/* Comment section - bên dưới */}
            <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">2 bình luận</p>
                    
                    {/* Danh sách comment */}
                    <div className="space-y-2 mb-3">
                        <div className="bg-gray-50 p-2 rounded text-sm">
                            <span className="font-medium text-gray-800">Học sinh 1: </span>
                            <span className="text-gray-700">Cảm ơn bạn đã chia sẻ!</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded text-sm">
                            <span className="font-medium text-gray-800">Học sinh 2: </span>
                            <span className="text-gray-700">Rất hữu ích. 👍</span>
                        </div>
                    </div>
                </div>
                
                {/* Input comment */}
                <div className="flex flex-row gap-2">
                    <input type="text" placeholder="Viết bình luận..." className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-indigo-400" />
                    <button className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700">Gửi</button>
                </div>
            </div>
        </div>
    );
}