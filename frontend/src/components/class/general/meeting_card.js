'use client';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faClock, faUsers, faPhone, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function MeetingCard({ meeting }) {
    const [joined, setJoined] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    // Định dạng thời gian
    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    // Tính thời gian còn lại
    const getTimeUntilMeeting = (dateString) => {
        const now = new Date();
        const meetingTime = new Date(dateString);
        const diff = meetingTime - now;

        if (diff < 0) return 'Đã kết thúc';
        if (diff < 60000) return 'Sắp bắt đầu';
        if (diff < 3600000) return `${Math.floor(diff / 60000)} phút nữa`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ nữa`;
        return `${Math.floor(diff / 86400000)} ngày nữa`;
    };

    // Kiểm tra cuộc họp đã kết thúc
    const isMeetingEnded = () => {
        const now = new Date();
        const meetingTime = new Date(meeting.startTime);
        return now > meetingTime;
    };

    return (
        <div className="meeting-card border border-gray-300 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
            {/* Header */}
            <header className="mb-3 pb-3 border-b border-gray-200">
                <div className="flex flex-row justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faVideo} className="text-indigo-600 !w-5 !h-5" />
                        <h3 className="text-lg font-semibold text-gray-800">{meeting.title}</h3>
                    </div>
                    {!isMeetingEnded() ? (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${joined ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                            {joined ? 'Đã tham gia' : 'Sắp tới'}
                        </span>
                    ): (
                        <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600">
                            Đã kết thúc
                        </span>
                    )}
                </div>
                <p className="text-sm text-gray-600">{meeting.description}</p>
            </header>

            {/* Meeting Details */}
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FontAwesomeIcon icon={faClock} className="text-gray-500 !w-4 !h-4" />
                    <span>{formatDate(meeting.startTime)} lúc {formatTime(meeting.startTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FontAwesomeIcon icon={faUsers} className="text-gray-500 !w-4 !h-4" />
                    <span>{meeting.participants || 0} người tham gia</span>
                </div>
                <div className="text-sm text-indigo-600 font-medium">
                    {getTimeUntilMeeting(meeting.startTime)}
                </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-row gap-2">
                {!isMeetingEnded() && (
                    <button
                        onClick={() => setJoined(!joined)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded font-medium text-sm transition-colors ${joined
                                ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                    >
                        <FontAwesomeIcon icon={faPhone} className="!w-4 !h-4" />
                        {joined ? 'Rời cuộc gọi' : 'Tham gia'}
                    </button>
                )}
                {isMeetingEnded() && (
                    <div className="flex-1 py-2 px-3 rounded bg-gray-100 text-gray-600 font-medium text-sm text-center">
                        Cuộc họp đã kết thúc
                    </div>
                )}
                {/* <button 
                    onClick={() => setShowDetails(!showDetails)}
                    className="px-3 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors"
                >
                    {showDetails ? 'Ẩn' : 'Chi tiết'}
                </button> */}
            </div>

            {/* Expanded Details */}
            {/* {showDetails && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Người tổ chức:</p>
                            <p className="text-sm text-gray-600">{meeting.organizer}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Link cuộc gọi:</p>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    value={meeting.meetingLink} 
                                    readOnly 
                                    className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs bg-gray-50 text-gray-700"
                                />
                                <button className="px-2 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700">
                                    Copy
                                </button>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-1">Danh sách tham gia:</p>
                            <div className="flex flex-wrap gap-1">
                                {(meeting.participantsList || []).map((participant, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                        {participant}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
}
