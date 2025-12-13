'use client';
import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faCircleExclamation, faDownload, faPlus, faEllipsis, faTrashCan, faXmark, faFaceSmile, faPaperclip, faImage, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import AAssignmentCard from "@/components/class/assignment/assignment_card";
import GAssignmentCard from "@/components/class/general/assignment_card";
import GPostCard from "@/components/class/general/post_card";
import GMeetingCard from "@/components/class/general/meeting_card";

export default function Class() {
    const classInfo = {
        name: "Lớp học mẫu",
        description: "Đây là mô tả của lớp học mẫu.",
    };

    const [activeSection, setActiveSection] = useState('general');
    const [assignmentTags, setAssignmentTags] = useState('all');
    const [documents, setDocuments] = useState([
        { id: 1, name: "Tài liệu 1", description: "Mô tả tài liệu 1", createdDate: "01-06-2024", size: "1.2 MB" },
        { id: 2, name: "Tài liệu 2", description: "Mô tả tài liệu 2", createdDate: "15-05-2024", size: "800 KB" }
    ]);
    const [selectedDocuments, setSelectedDocuments] = useState(new Set()); // Theo dõi checkbox đã chọn
    const [menuOpen, setMenuOpen] = useState(false); // Quản lý trạng thái menu
    const [postWindowOpen, setPostWindowOpen] = useState(false); // Quản lý trạng thái cửa sổ tạo bài đăng
    const [meetingWindowOpen, setMeetingWindowOpen] = useState(false); // Quản lý trạng thái cửa sổ tạo cuộc họp
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false); // Quản lý trạng thái emoji picker
    const [postContent, setPostContent] = useState(''); // Nội dung bài đăng
    const [attachedFiles, setAttachedFiles] = useState([]); // Danh sách file được attach
    const [attachedImages, setAttachedImages] = useState([]); // Danh sách ảnh được attach
    const [meetings, setMeetings] = useState([]); // Danh sách cuộc họp
    const [meetingForm, setMeetingForm] = useState({
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        organizer: '',
        meetingLink: ''
    }); // Form tạo cuộc họp
    const [viewAssignment, setViewAssignment] = useState(null); // Bài tập đang xem chi tiết
    const fileInputRef = useRef(null);
    const postFileInputRef = useRef(null);
    const postImageInputRef = useRef(null);
    const textareaRef = useRef(null);

    // Danh sách emoji
    const emojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂',
        '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
        '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪',
        '😌', '😒', '😔', '😓', '😪', '🤤', '😴', '😷',
        '🤒', '🤕', '🤢', '🤮', '🤧', '🤬', '😵', '🤯',
        '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁',
        '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧',
        '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣',
        '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠',
        '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹'
    ];

    // Hàm xử lý nhấn vào emoji
    const handleEmojiClick = (emoji) => {
        if (textareaRef.current) {
            const start = textareaRef.current.selectionStart;
            const end = textareaRef.current.selectionEnd;
            const newContent = postContent.substring(0, start) + emoji + postContent.substring(end);
            setPostContent(newContent);

            // Focus lại vào textarea và đặt cursor sau emoji vừa thêm
            setTimeout(() => {
                textareaRef.current?.focus();
                textareaRef.current?.setSelectionRange(start + emoji.length, start + emoji.length);
            }, 0);
        }
    };

    // Hàm xử lý attach file cho bài đăng (chỉ file, không ảnh)
    const handleAttachFile = (e) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            // Bỏ qua file ảnh
            if (file.type.startsWith('image/')) {
                alert('Vui lòng sử dụng nút "Thêm hình ảnh" để đính kèm ảnh');
                return;
            }

            const newFile = {
                id: Date.now() + Math.random(), // ID duy nhất
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type
            };

            setAttachedFiles([...attachedFiles, newFile]);
        });

        // Reset input
        e.target.value = null;
    };

    // Hàm xử lý attach ảnh cho bài đăng
    const handleAttachImage = (e) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            // Chỉ chấp nhận file ảnh
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn tệp ảnh');
                return;
            }

            const newImage = {
                id: Date.now() + Math.random(), // ID duy nhất
                name: file.name,
                size: formatFileSize(file.size),
                type: file.type,
                preview: URL.createObjectURL(file) // Tạo URL để preview
            };

            setAttachedImages([...attachedImages, newImage]);
        });

        // Reset input
        e.target.value = null;
    };

    // Hàm xóa file attach
    const handleRemoveAttachedFile = (fileId) => {
        setAttachedFiles(attachedFiles.filter(f => f.id !== fileId));
    };

    // Hàm xóa ảnh attach
    const handleRemoveAttachedImage = (imageId) => {
        const image = attachedImages.find(img => img.id === imageId);
        if (image) {
            URL.revokeObjectURL(image.preview); // Giải phóng memory
        }
        setAttachedImages(attachedImages.filter(img => img.id !== imageId));
    };

    // Hàm kích hoạt file input cho bài đăng (chỉ file)
    const handleAttachFileClick = () => {
        postFileInputRef.current?.click();
    };

    // Hàm kích hoạt file input cho ảnh
    const handleAttachImageClick = () => {
        postImageInputRef.current?.click();
    };

    // Hàm xử lý thay đổi form tạo cuộc họp
    const handleMeetingFormChange = (e) => {
        const { name, value } = e.target;
        setMeetingForm({
            ...meetingForm,
            [name]: value
        });
    };

    // Sinh link cuộc họp tự động
    const generateMeetingLink = () => {
        const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
        return `https://meet.example.com/${id}`;
    };

    // Hàm tạo cuộc họp mới
    const handleCreateMeeting = () => {
        if (!meetingForm.title || !meetingForm.startTime) {
            alert('Vui lòng điền tiêu đề và thời gian bắt đầu');
            return;
        }

        const newMeeting = {
            id: Date.now(),
            ...meetingForm,
            participants: 0,
            participantsList: []
        };

        setMeetings([...meetings, newMeeting]);

        // Reset form
        setMeetingForm({
            title: '',
            description: '',
            startTime: '',
            endTime: '',
            organizer: '',
            meetingLink: ''
        });
        setMeetingWindowOpen(false);
    };

    // CSS animation styles
    const animationStyles = `
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideOutDown {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(20px);
            }
        }

        .menu-item {
            animation: slideInUp 0.3s ease-out forwards;
        }

        .menu-item.hidden {
            animation: slideOutDown 0.3s ease-out forwards;
        }

        .menu-item:nth-child(1) { animation-delay: 0s; }
        .menu-item:nth-child(1).hidden { animation-delay: 0.2s; }

        .menu-item:nth-child(2) { animation-delay: 0.1s; }
        .menu-item:nth-child(2).hidden { animation-delay: 0.1s; }

        .menu-item:nth-child(3) { animation-delay: 0.2s; }
        .menu-item:nth-child(3).hidden { animation-delay: 0s; }
    `;

    // Function xử lý tải tài liệu lên
    const handleUploadDocument = (e) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            // Tạo object tài liệu mới
            const newDocument = {
                id: documents.length + 1,
                name: file.name,
                description: "", // người dùng có thể bổ sung mô tả sau
                createdDate: new Date().toLocaleDateString('vi-VN'), // định dạng dd-mm-yyyy
                size: formatFileSize(file.size)
            };

            // Thêm vào danh sách tài liệu
            setDocuments([...documents, newDocument]);

            // Gọi API để upload file lên server (tùy chọn)
            uploadToServer(file, newDocument.id);
        });

        // Reset input để có thể chọn file cùng tên lần khác
        e.target.value = null;
    };

    // Hàm chuyển đổi kích thước file thành định dạng dễ đọc
    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
    };

    // Hàm upload file lên server (gọi API backend)
    const uploadToServer = async (file, documentId) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentId', documentId);

        try {
            const response = await fetch('/api/documents/upload', {
                method: 'POST',
                body: formData,
                // không set Content-Type, browser sẽ tự set multipart/form-data
            });

            if (!response.ok) {
                console.error('Upload failed:', await response.text());
            }
        } catch (error) {
            console.error('Upload error:', error);
        }
    };

    // Hàm kích hoạt file input khi nhấn nút "Tài liệu mới"
    const handleAddDocumentClick = () => {
        fileInputRef.current?.click();
    };

    // Hàm xóa tài liệu
    const handleDeleteDocument = (documentId) => {
        // Xác nhận trước khi xóa
        if (confirm('Bạn có chắc chắn muốn xóa tài liệu này?')) {
            // Lọc bỏ tài liệu có id tương ứng
            setDocuments(documents.filter(doc => doc.id !== documentId));

            // Gọi API backend để xóa file từ server (tùy chọn)
            deleteFromServer(documentId);
        }
    };

    // Hàm gọi API backend để xóa file
    const deleteFromServer = async (documentId) => {
        try {
            const response = await fetch(`/api/documents/${documentId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                console.error('Delete failed:', await response.text());
            }
        } catch (error) {
            console.error('Delete error:', error);
        }
    };

    // Hàm xử lý checkbox chọn tài liệu
    const handleCheckboxChange = (documentId, isChecked) => {
        const newSelected = new Set(selectedDocuments);
        if (isChecked) {
            newSelected.add(documentId);
        } else {
            newSelected.delete(documentId);
        }
        setSelectedDocuments(newSelected);
    };

    // Hàm xử lý checkbox "Chọn tất cả"
    const handleSelectAll = (isChecked) => {
        if (isChecked) {
            // Chọn tất cả
            const allIds = new Set(documents.map(doc => doc.id));
            setSelectedDocuments(allIds);
        } else {
            // Bỏ chọn tất cả
            setSelectedDocuments(new Set());
        }
    };

    // Hàm xóa nhiều tài liệu đã chọn
    const handleDeleteSelectedDocuments = () => {
        if (selectedDocuments.size === 0) {
            alert('Vui lòng chọn ít nhất một tài liệu để xóa!');
            return;
        }

        if (confirm(`Bạn có chắc chắn muốn xóa ${selectedDocuments.size} tài liệu đã chọn?`)) {
            // Lọc bỏ các tài liệu đã chọn
            const updatedDocuments = documents.filter(doc => !selectedDocuments.has(doc.id));
            setDocuments(updatedDocuments);

            // Xóa từ server
            selectedDocuments.forEach(docId => {
                deleteFromServer(docId);
            });

            // Bỏ chọn tất cả
            setSelectedDocuments(new Set());
        }
    };

    return (
        <>
            <aside className="bg-indigo-800 w-[250px] h-screen z-3 fixed border-r-2 border-indigo-300 px-2 shadow-md p-4">
                <div className="flex flex-row">
                    <button><FontAwesomeIcon icon={faAngleLeft} className="!w-[20px] !h-[20px] text-white hover:cursor-pointer" onClick={() => window.history.back()}/></button>
                    <h2 className="text-white text-xl text-justify font-bold px-4 py-2">{classInfo.name}</h2>
                </div>
                <hr className="border-indigo-300 my-2"></hr>
                <nav className="text-white text-sm text-justify font-normal flex flex-col gap-4 px-8 py-4 list-none">
                    <li
                        className={`hover:underline hover:decoration-solid hover:cursor-pointer ${activeSection === 'general' ? 'font-bold' : 'font-normal'}`}
                        onClick={() => setActiveSection('general')}
                    >
                        <a>Chung</a>
                    </li>
                    <li
                        className={`hover:underline hover:decoration-solid hover:cursor-pointer ${activeSection === 'assignments' ? 'font-bold' : 'font-normal'}`}
                        onClick={() => setActiveSection('assignments')}
                    >
                        <a>Bài tập</a>
                    </li>
                    <li
                        className={`hover:underline hover:decoration-solid hover:cursor-pointer ${activeSection === 'sources' ? 'font-bold' : 'font-normal'}`}
                        onClick={() => setActiveSection('sources')}
                    >
                        <a>Tài liệu</a>
                    </li>
                </nav>
            </aside>

            <main className="ml-[250px] p-6">
                {activeSection === 'general' && (
                    <section id="general-section" className="mb-8">
                        <header className="flex flex-row justify-between">
                            <h3 className="text-2xl font-bold text-indigo-950 mb-4">Chung</h3>
                            <div>
                                <button className="p-2 text-indigo-700 text-center text-sm hover:cursor-pointer"><FontAwesomeIcon icon={faVideo} className="!w-[20px] !h-[20px] " /></button>
                                <button className="p-2 text-indigo-700 text-center text-sm hover:cursor-pointer"><FontAwesomeIcon icon={faCircleExclamation} className="!w-[20px] !h-[20px] " /></button>
                            </div>
                        </header>
                        <hr className="border-indigo-950"></hr>
                        <div className="mt-4 text-indigo-900">
                            <GAssignmentCard assignment={{ title: "Bài tập 1", description: "Mô tả bài tập 1", dueDate: "2024-07-01" }} />
                            <GAssignmentCard assignment={{ title: "Bài tập 2", description: "Mô tả bài tập 2", dueDate: "2024-07-05" }} />
                            <GPostCard post={{ userId: 1, title: "Bài đăng 1", content: "Nội dung bài đăng 1." }} />
                            <GMeetingCard meeting={{ title: "Cuộc họp nhóm 1", description: "Mô tả cuộc họp nhóm 1", startTime: "2024-06-10T14:00:00Z", participants: 5 }} />
                        </div>
                        <button onClick={() => setMenuOpen(!menuOpen)} className="fixed bottom-5 right-5 bg-indigo-800 text-white p-3 rounded-full flex justify-center items-center shadow-lg hover:bg-indigo-900 hover:cursor-pointer z-40">
                            <FontAwesomeIcon icon={faPlus} className={`!w-[14px] !h-[14px] transition-transform duration-300 ${menuOpen ? 'rotate-45' : 'rotate-0'}`} />
                            <style>{animationStyles}</style>
                            <div className={`flex flex-col absolute text-indigo-900 rounded-md py-2 bottom-10 right-0 ${!menuOpen ? 'hidden' : ''}`}>
                                <span className={`bg-indigo-800 shadow-lg py-2 px-3 rounded-full ml-2 text-sm font-medium text-nowrap text-right text-white mb-2 hover:bg-indigo-900 menu-item ${!menuOpen ? 'hidden' : ''}`} onClick={() => setPostWindowOpen(true)}>Thêm bài đăng</span>
                                <span className={`bg-indigo-800 shadow-lg py-2 px-3 rounded-full ml-2 text-sm font-medium text-nowrap text-right text-white mb-2 hover:bg-indigo-900 menu-item ${!menuOpen ? 'hidden' : ''}`}>Thêm bài tập</span>
                                <span onClick={() => { setMeetingForm(prev => ({ ...prev, meetingLink: generateMeetingLink() })); setMeetingWindowOpen(true); setMenuOpen(false); }} className={`bg-indigo-800 shadow-lg py-2 px-3 rounded-full ml-2 text-sm font-medium text-nowrap text-right text-white mb-2 hover:bg-indigo-900 cursor-pointer menu-item ${!menuOpen ? 'hidden' : ''}`}>Thêm cuộc hẹn gọi nhóm</span>
                            </div>
                        </button>
                        <div className={`post-window w-[600px] bg-white border border-gray-300 rounded-lg shadow-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 ${postWindowOpen ? 'block' : 'hidden'}`}>
                            {/* Post creation UI here */}
                            <header className="flex flex-row  border-b border-gray-300 justify-between items-center px-3">
                                <h3 className="text-lg font-semibold p-4">Tạo bài đăng mới</h3>
                                <button className="p-4" onClick={() => setPostWindowOpen(false)}><FontAwesomeIcon icon={faXmark} className="!w-[14px] !h-[14px] hover:cursor-pointer" /></button>
                            </header>
                            <textarea ref={textareaRef} value={postContent} onChange={(e) => setPostContent(e.target.value)} className="w-full h-[250px] p-4 outline-none" placeholder="Viết nội dung bài đăng..."></textarea>

                            {/* Danh sách file đã attach (không ảnh) */}
                            {attachedFiles.length > 0 && (
                                <div className="px-4 py-2 border-b border-gray-300">
                                    <p className="text-sm font-medium text-gray-700 mb-2">File đã đính kèm:</p>
                                    <div className="space-y-1">
                                        {attachedFiles.map((file) => (
                                            <div key={file.id} className="flex flex-row justify-between items-center bg-gray-100 p-2 rounded text-sm">
                                                <span className="text-gray-700">{file.name} ({file.size})</span>
                                                <button onClick={() => handleRemoveAttachedFile(file.id)} className="text-red-600 hover:text-red-800 font-bold">×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Danh sách ảnh đã attach */}
                            {attachedImages.length > 0 && (
                                <div className="px-4 py-2 border-b border-gray-300">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Hình ảnh đã đính kèm:</p>
                                    <div className="grid grid-cols-4 gap-2">
                                        {attachedImages.map((image) => (
                                            <div key={image.id} className="relative">
                                                <img src={image.preview} alt={image.name} className="w-full h-20 object-cover rounded" />
                                                <button onClick={() => handleRemoveAttachedImage(image.id)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold hover:bg-red-800">×</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="relative w-full px-4 py-2 flex flex-row justify-between items-center border-t border-gray-300">
                                <div className="flex flex-row gap-4">
                                    <button onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}><FontAwesomeIcon icon={faFaceSmile} className="!w-[14px] !h-[14px] hover:cursor-pointer" /></button>
                                    <button onClick={handleAttachFileClick}><FontAwesomeIcon icon={faPaperclip} className="!w-[14px] !h-[14px] hover:cursor-pointer" /></button>
                                    <button onClick={handleAttachImageClick}><FontAwesomeIcon icon={faImage} className="!w-[14px] !h-[14px] hover:cursor-pointer" /></button>
                                    {/* Hidden file input (chỉ file, không ảnh) */}
                                    <input ref={postFileInputRef} type="file" multiple onChange={handleAttachFile} style={{ display: 'none' }} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar" />
                                    {/* Hidden file input cho ảnh */}
                                    <input ref={postImageInputRef} type="file" multiple onChange={handleAttachImage} style={{ display: 'none' }} accept="image/*" />
                                </div>
                                <button className="bg-indigo-600 text-white text-md rounded-sm py-1 px-2 shadow-sm hover:cursor-pointer hover:bg-indigo-700">Đăng bài</button>

                                {/* Emoji Picker */}
                                {emojiPickerOpen && (
                                    <div className="absolute bottom-12 left-0 bg-white border border-gray-300 rounded-lg shadow-lg p-3 w-[300px] grid grid-cols-8 gap-1 z-50">
                                        {emojis.map((emoji, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleEmojiClick(emoji)}
                                                className="text-xl hover:bg-gray-100 rounded p-1 transition-colors"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Meeting Creation Window */}
                        <div className={`meeting-window w-[600px] bg-white border border-gray-300 rounded-lg shadow-lg fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-50 ${meetingWindowOpen ? 'block' : 'hidden'}`}>
                            <header className="flex flex-row border-b border-gray-300 justify-between items-center px-3">
                                <h3 className="text-lg font-semibold p-4">Tạo cuộc họp nhóm mới</h3>
                                <button className="p-4" onClick={() => setMeetingWindowOpen(false)}><FontAwesomeIcon icon={faXmark} className="!w-[14px] !h-[14px] hover:cursor-pointer" /></button>
                            </header>
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề cuộc họp *</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={meetingForm.title}
                                        onChange={handleMeetingFormChange}
                                        placeholder="Ví dụ: Họp nhóm Toán chương 1"
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-400"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                    <textarea
                                        name="description"
                                        value={meetingForm.description}
                                        onChange={handleMeetingFormChange}
                                        placeholder="Nội dung cuộc họp..."
                                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-400 h-20 resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian bắt đầu *</label>
                                        <input
                                            type="datetime-local"
                                            name="startTime"
                                            value={meetingForm.startTime}
                                            onChange={handleMeetingFormChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian kết thúc</label>
                                        <input
                                            type="datetime-local"
                                            name="endTime"
                                            value={meetingForm.endTime}
                                            onChange={handleMeetingFormChange}
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Người tổ chức</label>
                                        <input
                                            type="text"
                                            name="organizer"
                                            value={meetingForm.organizer}
                                            onChange={handleMeetingFormChange}
                                            placeholder="Tên người tổ chức"
                                            className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-indigo-400"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Link cuộc gọi</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                name="meetingLink"
                                                value={meetingForm.meetingLink}
                                                readOnly
                                                placeholder="Link tự sinh"
                                                className="flex-1 w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none bg-gray-50"
                                            />
                                            <button onClick={() => setMeetingForm(prev => ({ ...prev, meetingLink: generateMeetingLink() }))} className="px-3 py-2 bg-gray-100 text-sm rounded hover:bg-gray-200">Tạo lại</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row gap-2 justify-end">
                                    <button
                                        onClick={() => setMeetingWindowOpen(false)}
                                        className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium text-sm"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleCreateMeeting}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-medium text-sm"
                                    >
                                        Tạo cuộc họp
                                    </button>
                                </div>
                            </div>
                        </div>

                    </section>
                )}

                {activeSection === 'assignments' && (
                    <section id="assignments-section" className="mb-8">
                        <header className="flex flex-row justify-between">
                            <h3 className="text-2xl font-bold text-indigo-950 mb-4">Bài tập</h3>
                        </header>
                        <hr className="border-indigo-950"></hr>

                        {!viewAssignment ? (
                            <>
                                <div className="flex flex-row gap-2 my-3">
                                    <a className={`text-sm hover:font-medium hover:text-black hover:cursor-pointer ${assignmentTags === 'all' ? 'font-medium' : 'font-normal'} ${assignmentTags === 'all' ? 'text-black' : 'text-gray-500'}`} onClick={() => { setAssignmentTags('all') }}>Tất cả</a>
                                    <a className={`text-sm hover:font-medium hover:text-black hover:cursor-pointer ${assignmentTags === 'incomplete' ? 'font-medium' : 'font-normal'} ${assignmentTags === 'incomplete' ? 'text-black' : 'text-gray-500'}`} onClick={() => { setAssignmentTags('incomplete') }}>Chưa hoàn thành</a>
                                    <a className={`text-sm hover:font-medium hover:text-black hover:cursor-pointer ${assignmentTags === 'complete' ? 'font-medium' : 'font-normal'} ${assignmentTags === 'complete' ? 'text-black' : 'text-gray-500'}`} onClick={() => { setAssignmentTags('complete') }}>Đã hoàn thành</a>
                                    <a className={`text-sm hover:font-medium hover:text-black hover:cursor-pointer ${assignmentTags === 'overdue' ? 'font-medium' : 'font-normal'} ${assignmentTags === 'overdue' ? 'text-black' : 'text-gray-500'}`} onClick={() => { setAssignmentTags('overdue') }}>Quá hạn</a>
                                </div>
                                <div className="mt-4 text-indigo-900">
                                    <AAssignmentCard assignment={{ title: "Bài tập 1", description: "Mô tả bài tập 1", dueDate: "2027-07-01", isSubmitted: false }} onClick={(a) => { setViewAssignment(a); }} />
                                    <AAssignmentCard assignment={{ title: "Bài tập 2", description: "Mô tả bài tập 2", dueDate: "2024-07-05", isSubmitted: true }} onClick={(a) => { setViewAssignment(a); }} />
                                </div>
                            </>

                        ) : (
                            <div className="bg-white b p-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold text-indigo-900">{viewAssignment.title}</h4>
                                        <p className="text-gray-700 mt-2">{viewAssignment.description}</p>
                                        <p className="text-sm text-gray-500 mt-3">Hạn nộp: {viewAssignment.dueDate}</p>
                                        <p className="mt-3"><strong>Trạng thái:</strong> {viewAssignment.isSubmitted ? 'Đã nộp' : 'Chưa nộp'}</p>
                                    </div>
                                    <div className="ml-4 flex flex-col gap-2">
                                        <button onClick={() => setViewAssignment(null)} className="px-3 py-1 border rounded text-sm">Quay lại</button>
                                    </div>
                                </div>
                            </div>
                        )}

                    </section>
                )}

                {activeSection === 'sources' && (
                    <section id="sources-section" className="mb-8">
                        <header className="flex flex-row justify-between">
                            <h3 className="text-2xl font-bold text-indigo-950 mb-4">Tài liệu</h3>
                        </header>
                        <hr className="border-indigo-950"></hr>
                        <div className="flex flex-row gap-2 my-3">
                            <button onClick={handleAddDocumentClick} className="text-sm text-white bg-indigo-600 hover:bg-indigo-700 hover:cursor-pointer py-1 px-3 rounded-md">
                                <FontAwesomeIcon icon={faPlus} className="!w-[14px] !h-[14px] mr-2" />Tài liệu mới
                            </button>
                            <button className="text-sm text-gray-600 hover:text-indigo-700 hover:cursor-pointer py-1 px-3 rounded-md">
                                <FontAwesomeIcon icon={faDownload} className="!w-[14px] !h-[14px] mr-2" />Tải tài liệu đã chọn
                            </button>
                            <button className="text-sm text-gray-600 hover:text-red-700 hover:cursor-pointer py-1 px-3 rounded-md" onClick={handleDeleteSelectedDocuments}>
                                <FontAwesomeIcon icon={faTrashCan} className="!w-[14px] !h-[14px] mr-2" />Xóa tài liệu đã chọn
                            </button>
                            {/* Hidden file input */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                onChange={handleUploadDocument}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className="mt-4 text-indigo-900">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-300 hover:bg-gray-100">
                                        <td className="py-2 px-4 text-sm font-medium text-gray-800"><input type="checkbox" checked={selectedDocuments.size === documents.length && documents.length > 0} onChange={(e) => handleSelectAll(e.target.checked)} /></td>
                                        <td className="py-2 px-4 text-sm font-medium text-gray-800">Tên tài liệu</td>
                                        <td className="py-2 px-4 text-sm font-medium text-gray-800">Mô tả tài liệu</td>
                                        <td className="py-2 px-4 text-sm font-medium text-gray-800">Ngày tạo</td>
                                        <td className="py-2 px-4 text-sm font-medium text-gray-800">Kích thước</td>
                                        <td className="py-2 px-4 text-sm font-medium text-gray-800">

                                        </td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((doc) => (
                                        <tr key={doc.id} className="border-b border-gray-300 hover:bg-gray-100">
                                            <td className="py-2 px-4 text-sm text-gray-600"><input type="checkbox" checked={selectedDocuments.has(doc.id)} onChange={(e) => handleCheckboxChange(doc.id, e.target.checked)} /></td>
                                            <td className="py-2 px-4 text-sm text-gray-600">{doc.name}</td>
                                            <td className="py-2 px-4 text-sm text-gray-600">{doc.description}</td>
                                            <td className="py-2 px-4 text-sm text-gray-600">{doc.createdDate}</td>
                                            <td className="py-2 px-4 text-sm text-gray-600">{doc.size}</td>
                                            <td className="py-2 px-4 text-sm text-gray-600 relative group">
                                                <FontAwesomeIcon icon={faEllipsis} className="!w-[14px] !h-[14px]" />
                                                <div className="gap-1 bg-white shadow p-2 absolute top-6 right-0 border border-gray-300 rounded-md hidden group-hover:flex group-hover:flex-col z-10">
                                                    <span className="text-indigo-700 text-sm font-normal text-nowrap hover:cursor-pointer hover:underline">Tải xuống</span>
                                                    <span onClick={() => handleDeleteDocument(doc.id)} className="text-red-700 text-sm font-normal text-nowrap hover:cursor-pointer hover:underline">Xóa tài liệu</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main >
        </>
    );
}