"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "Hộp thư đến",
            "sent": "Gởi",
            "drafts": "Dự thảo",
            "trash": "Rác",
            "junk": "Thư rác"
        },
        "delete": "Xóa thư mục",
        "empty": "Hộp thư này trống"
    },
    "message": {
        "labels": {
            "from": "Từ:",
            "to": "Đến:",
            "date": "Gởi:"
        }
    },
    "mailboxMessage": {
        "to": "Đến:"
    },
    "login": {
        "title": "Đăng nhập",
        "action": "Đăng nhập",
        "labels": {
            "username": "tên tài khoản",
            "password": "Mật khẩu"
        }
    },
    "accountButton": {
        "logout": "Đăng xuất",
        "myAccount": "Tài khoản của tôi",
        "filters": "Bộ lọc"
    },
    "compose": {
        "labels": {
            "to": "Đến:",
            "subject": "Môn học:",
            "cc": "Cc:",
            "bcc": "Bcc:"
        },
        "tabs": {
            "newMessageTitle": "Tin nhắn mới"
        }
    },
    "editor": {
        "cmd": {
            "undo": "Hoàn tác",
            "redo": "Làm lại",
            "fontName": "Kiểu chữ",
            "fontSize": "Cỡ chữ",
            "bold": "Dũng cảm",
            "italic": "In nghiêng",
            "underline": "Gạch chân",
            "justifyLeft": "Căn trái",
            "justifyCenter": "Căn giữa",
            "justifyRight": "Sắp xếp đúng",
            "insertUnorderedList": "Danh sách",
            "insertOrderedList": "Danh sách đánh số",
            "removeFormat": "Xóa định dạng"
        },
        "color": {
            "tooltip": "Màu sắc",
            "foreColor": "Bản văn",
            "backColor": "Lý lịch"
        },
        "upload": {
            "tooltip": "Đính kèm",
            "add": "Thêm vào",
            "remove": "Tẩy"
        },
        "send": "Gửi"
    },
    "selection": {
        "title": [
            "{n} tin nhắn",
            "Tin nhắn {n}",
            "{n} tin nhắn"
        ]
    },
    "actions": {
        "backToMailbox": "Quay lại hộp thư",
        "reload": "Làm tươi",
        "select": "Lựa chọn",
        "markAsUnread": "Đánh dấu là không đọc",
        "markAsRead": "đánh dấu là đã đọc",
        "moveTo": "Chuyển tới",
        "delete": "Xóa bỏ",
        "deletePermanently": "Xóa vĩnh viễn",
        "discardDrafts": "Loại bỏ bản nháp",
        "markAsSpam": "đánh dấu spam",
        "unMarkAsSpam": "Đây không phải là thư rác",
        "forward": "Ở đằng trước",
        "reply": "Đáp lại",
        "attachments": "Tài liệu đính kèm"
    },
    "weekDays": {
        "0": "chủ nhật",
        "1": "Thứ hai",
        "2": "Thứ ba",
        "3": "Thứ tư",
        "4": "Thứ năm",
        "5": "Thứ sáu",
        "6": "ngày thứ bảy"
    },
    "months": {
        "0": "tháng Giêng",
        "1": "Tháng hai",
        "2": "tháng Ba",
        "3": "Tháng 4",
        "4": "có thể",
        "5": "Tháng sáu",
        "6": "Tháng 7",
        "7": "tháng Tám",
        "8": "Tháng Chín",
        "9": "Tháng Mười",
        "10": "Tháng 11",
        "11": "Tháng 12"
    },
    "notifier": {
        "messageSent": "Tin nhắn đã gửi",
        "mailboxDeleted": "Thư mục đã bị xóa"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "Thư mục mới",
            "success": "Thư mục đã được tạo"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "Tạo thư mục mới",
            "label": "Tên thư mục",
            "accept": "Tạo nên",
            "cancel": "Hủy bỏ"
        },
        "deleteMailbox": {
            "title": "Xóa thư mục \"{mailbox}\"",
            "desc": "Chú ý. Hành động này sẽ xóa vĩnh viễn tất cả các tin nhắn trong thư mục",
            "accept": "Xóa bỏ",
            "cancel": "Hủy bỏ"
        }
    },
    "myAccount": {
        "title": "Tài khoản của tôi",
        "commonActions": {
            "title": "Các hành động phổ biến",
            "updatePassword": "Cập nhật mật khẩu",
            "currentPassword": "Mật khẩu hiện tại",
            "newPassword": "Mật khẩu mới",
            "confirmPassword": "Xác nhận mật khẩu mới"
        },
        "limits": {
            "gbUsed": "{gb} GB",
            "gbTotal": "của {gb} GB",
            "messagesUsed": [
                "{n} tin nhắn",
                "Tin nhắn {n}",
                "{n} tin nhắn"
            ],
            "messagesTotal": [
                "trong số {n} tin nhắn",
                "của {n} tin nhắn",
                "trong số {n} tin nhắn"
            ],
            "storage": {
                "title": "Lưu trữ"
            },
            "imapDownload": {
                "title": "Tải xuống IMAP",
                "comment": "hằng ngày"
            },
            "imapUpload": {
                "title": "Tải lên IMAP",
                "comment": "hằng ngày"
            },
            "pop3Download": {
                "title": "Tải xuống POP3",
                "comment": "hằng ngày"
            },
            "received": {
                "title": "Nhận",
                "comment": "theo phút"
            },
            "recipients": {
                "title": "Gởi",
                "comment": "hằng ngày"
            },
            "forwards": {
                "title": "Chuyển hướng",
                "comment": "hằng ngày"
            }
        }
    },
    "filters": {
        "title": "Bộ lọc",
        "commingSoon": "Sắp có"
    }
};
exports.default = locale;
