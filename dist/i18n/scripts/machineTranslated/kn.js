"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "ಇನ್‌ಬಾಕ್ಸ್",
            "sent": "ಕಳುಹಿಸಲಾಗಿದೆ",
            "drafts": "ಕರಡುಗಳು",
            "trash": "ಅನುಪಯುಕ್ತ",
            "junk": "ಸ್ಪ್ಯಾಮ್"
        },
        "delete": "ಫೋಲ್ಡರ್ ಅಳಿಸಿ",
        "empty": "ಈ ಮೇಲ್ಬಾಕ್ಸ್ ಖಾಲಿಯಾಗಿದೆ"
    },
    "message": {
        "labels": {
            "from": "ಇವರಿಂದ:",
            "to": "ಗೆ:",
            "date": "ಕಳುಹಿಸಲಾಗಿದೆ:"
        }
    },
    "mailboxMessage": {
        "to": "ಗೆ:"
    },
    "login": {
        "title": "ಸೈನ್ ಇನ್ ಮಾಡಿ",
        "action": "ಸೈನ್ ಇನ್ ಮಾಡಿ",
        "labels": {
            "username": "ಬಳಕೆದಾರ ಹೆಸರು",
            "password": "ಗುಪ್ತಪದ"
        }
    },
    "accountButton": {
        "logout": "ಸೈನ್ .ಟ್ ಮಾಡಿ",
        "myAccount": "ನನ್ನ ಖಾತೆ",
        "filters": "ಫಿಲ್ಟರ್‌ಗಳು"
    },
    "compose": {
        "labels": {
            "to": "ಗೆ:",
            "subject": "ವಿಷಯ:",
            "cc": "ಸಿಸಿ:",
            "bcc": "ಬಿಸಿಸಿ:"
        },
        "tabs": {
            "newMessageTitle": "ಹೊಸ ಸಂದೇಶ"
        }
    },
    "editor": {
        "cmd": {
            "undo": "ರದ್ದುಗೊಳಿಸಿ",
            "redo": "ಮತ್ತೆಮಾಡು",
            "fontName": "ಫಾಂಟ್ ಪ್ರಕಾರ",
            "fontSize": "ಅಕ್ಷರ ಗಾತ್ರ",
            "bold": "ದಪ್ಪ",
            "italic": "ಇಟಾಲಿಕ್",
            "underline": "ಅಂಡರ್ಲೈನ್ ಮಾಡಿ",
            "justifyLeft": "ಎಡಕ್ಕೆ ಜೋಡಿಸಿ",
            "justifyCenter": "ಮಧ್ಯದಲ್ಲಿ ಜೋಡಿಸಿ",
            "justifyRight": "ಬಲಕ್ಕೆ ಜೋಡಿಸಿ",
            "insertUnorderedList": "ಪಟ್ಟಿ",
            "insertOrderedList": "ಸಂಖ್ಯೆಯ ಪಟ್ಟಿ",
            "removeFormat": "ಸ್ವರೂಪವನ್ನು ತೆಗೆದುಹಾಕಿ"
        },
        "color": {
            "tooltip": "ಬಣ್ಣ",
            "foreColor": "ಪಠ್ಯ",
            "backColor": "ಹಿನ್ನೆಲೆ"
        },
        "upload": {
            "tooltip": "ಲಗತ್ತಿಸಿ",
            "add": "ಸೇರಿಸಿ",
            "remove": "ತೆಗೆದುಹಾಕಿ"
        },
        "send": "ಕಳುಹಿಸು"
    },
    "selection": {
        "title": [
            "{n} ಸಂದೇಶಗಳು",
            "{n} ಸಂದೇಶ",
            "{n} ಸಂದೇಶಗಳು"
        ]
    },
    "actions": {
        "backToMailbox": "ಅಂಚೆಪೆಟ್ಟಿಗೆಗೆ ಹಿಂತಿರುಗಿ",
        "reload": "ರಿಫ್ರೆಶ್ ಮಾಡಿ",
        "select": "ಆಯ್ಕೆ ಮಾಡಿ",
        "markAsUnread": "ಓದಿಲ್ಲ ಎಂದು ಗುರುತಿಸಿ",
        "markAsRead": "ಓದಿರುವುದಾಗಿ ಗುರುತಿಸು",
        "moveTo": "ಗೆ ಸರಿಸಿ",
        "delete": "ಅಳಿಸಿ",
        "deletePermanently": "ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಿ",
        "discardDrafts": "ಡ್ರಾಫ್ಟ್‌ಗಳನ್ನು ತ್ಯಜಿಸಿ",
        "markAsSpam": "ಸ್ಪ್ಯಾಮ್ ಎಂದು ಗುರುತಿಸಿ",
        "unMarkAsSpam": "ಇದು ಸ್ಪ್ಯಾಮ್ ಅಲ್ಲ",
        "forward": "ಮುಂದೆ",
        "reply": "ಪ್ರತ್ಯುತ್ತರ",
        "attachments": "ಲಗತ್ತುಗಳು"
    },
    "weekDays": {
        "0": "ಭಾನುವಾರ",
        "1": "ಸೋಮವಾರ",
        "2": "ಮಂಗಳವಾರ",
        "3": "ಬುಧವಾರ",
        "4": "ಗುರುವಾರ",
        "5": "ಶುಕ್ರವಾರ",
        "6": "ಶನಿವಾರ"
    },
    "months": {
        "0": "ಜನವರಿ",
        "1": "ಫೆಬ್ರವರಿ",
        "2": "ಮಾರ್ಚ್",
        "3": "ಏಪ್ರಿಲ್",
        "4": "ಮೇ",
        "5": "ಜೂನ್",
        "6": "ಜುಲೈ",
        "7": "ಆಗಸ್ಟ್",
        "8": "ಸೆಪ್ಟೆಂಬರ್",
        "9": "ಅಕ್ಟೋಬರ್",
        "10": "ನವೆಂಬರ್",
        "11": "ಡಿಸೆಂಬರ್"
    },
    "notifier": {
        "messageSent": "ಸಂದೇಶ ಕಳುಹಿಸಲಾಗಿದೆ",
        "mailboxDeleted": "ಫೋಲ್ಡರ್ ಅಳಿಸಲಾಗಿದೆ"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "ಹೊಸ ಫೋಲ್ಡರ್",
            "success": "ಫೋಲ್ಡರ್ ರಚಿಸಲಾಗಿದೆ"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "ಹೊಸ ಫೋಲ್ಡರ್ ರಚಿಸಿ",
            "label": "ಫೋಲ್ಡರ್ ಹೆಸರು",
            "accept": "ರಚಿಸಿ",
            "cancel": "ರದ್ದುಮಾಡಿ"
        },
        "deleteMailbox": {
            "title": "\"{mailbox}\" ಫೋಲ್ಡರ್ ಅಳಿಸಿ",
            "desc": "ಎಚ್ಚರಿಕೆ. ಈ ಕ್ರಿಯೆಯು ಫೋಲ್ಡರ್‌ನಲ್ಲಿರುವ ಎಲ್ಲಾ ಸಂದೇಶಗಳನ್ನು ಶಾಶ್ವತವಾಗಿ ಅಳಿಸುತ್ತದೆ",
            "accept": "ಅಳಿಸಿ",
            "cancel": "ರದ್ದುಮಾಡಿ"
        }
    },
    "myAccount": {
        "title": "ನನ್ನ ಖಾತೆ",
        "commonActions": {
            "title": "ಸಾಮಾನ್ಯ ಕ್ರಿಯೆಗಳು",
            "updatePassword": "ಪಾಸ್ವರ್ಡ್ ನವೀಕರಿಸಿ",
            "currentPassword": "ಪ್ರಸ್ತುತ ಗುಪ್ತಪದ",
            "newPassword": "ಹೊಸ ಪಾಸ್‌ವರ್ಡ್",
            "confirmPassword": "ಹೊಸ ಗುಪ್ತಪದವನ್ನು ಖಚಿತಪಡಿಸಿ"
        },
        "limits": {
            "gbUsed": "{gb} ಜಿಬಿ",
            "gbTotal": "{gb} ಜಿಬಿ",
            "messagesUsed": [
                "{n} ಸಂದೇಶಗಳು",
                "{n} ಸಂದೇಶ",
                "{n} ಸಂದೇಶಗಳು"
            ],
            "messagesTotal": [
                "{n} ಸಂದೇಶಗಳಲ್ಲಿ",
                "{n} ಸಂದೇಶದ",
                "{n} ಸಂದೇಶಗಳಲ್ಲಿ"
            ],
            "storage": {
                "title": "ಸಂಗ್ರಹಣೆ"
            },
            "imapDownload": {
                "title": "IMAP ಡೌನ್‌ಲೋಡ್",
                "comment": "ದೈನಂದಿನ"
            },
            "imapUpload": {
                "title": "IMAP ಅಪ್‌ಲೋಡ್",
                "comment": "ದೈನಂದಿನ"
            },
            "pop3Download": {
                "title": "POP3 ಡೌನ್‌ಲೋಡ್",
                "comment": "ದೈನಂದಿನ"
            },
            "received": {
                "title": "ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
                "comment": "ನಿಮಿಷದಿಂದ"
            },
            "recipients": {
                "title": "ಕಳುಹಿಸಲಾಗಿದೆ",
                "comment": "ದೈನಂದಿನ"
            },
            "forwards": {
                "title": "ಮರುನಿರ್ದೇಶಿಸಲಾಗಿದೆ",
                "comment": "ದೈನಂದಿನ"
            }
        }
    },
    "filters": {
        "title": "ಫಿಲ್ಟರ್‌ಗಳು",
        "commingSoon": "ಶೀಘ್ರದಲ್ಲೇ ಬರಲಿದೆ"
    }
};
exports.default = locale;
