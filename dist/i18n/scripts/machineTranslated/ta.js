"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "உட்பெட்டி",
            "sent": "அனுப்பப்பட்டது",
            "drafts": "வரைவுகள்",
            "trash": "குப்பை",
            "junk": "ஸ்பேம்"
        },
        "delete": "கோப்புறையை நீக்கு",
        "empty": "இந்த அஞ்சல் பெட்டி காலியாக உள்ளது"
    },
    "message": {
        "labels": {
            "from": "இருந்து:",
            "to": "க்கு:",
            "date": "அனுப்பப்பட்டது:"
        }
    },
    "mailboxMessage": {
        "to": "க்கு:"
    },
    "login": {
        "title": "உள்நுழைக",
        "action": "உள்நுழைக",
        "labels": {
            "username": "பயனர்பெயர்",
            "password": "கடவுச்சொல்"
        }
    },
    "accountButton": {
        "logout": "வெளியேறு",
        "myAccount": "என் கணக்கு",
        "filters": "வடிப்பான்கள்"
    },
    "compose": {
        "labels": {
            "to": "க்கு:",
            "subject": "பொருள்:",
            "cc": "சி.சி:",
            "bcc": "பி.சி.சி:"
        },
        "tabs": {
            "newMessageTitle": "புதிய தகவல்"
        }
    },
    "editor": {
        "cmd": {
            "undo": "செயல்தவிர்",
            "redo": "மீண்டும் செய்",
            "fontName": "எழுத்துரு வகை",
            "fontSize": "எழுத்துரு அளவு",
            "bold": "தைரியமான",
            "italic": "சாய்வு",
            "underline": "அடிக்கோடிட்டு",
            "justifyLeft": "இடதுபுறமாக சீரமைக்கவும்",
            "justifyCenter": "நடுத்தர சீரமைக்க",
            "justifyRight": "வலதுபுறம் சீரமைக்கவும்",
            "insertUnorderedList": "பட்டியல்",
            "insertOrderedList": "எண் பட்டியல்",
            "removeFormat": "வடிவமைப்பை அகற்று"
        },
        "color": {
            "tooltip": "நிறம்",
            "foreColor": "உரை",
            "backColor": "பின்னணி"
        },
        "upload": {
            "tooltip": "இணைக்கவும்",
            "add": "கூட்டு",
            "remove": "அகற்று"
        },
        "send": "அனுப்பு"
    },
    "selection": {
        "title": [
            "{n} செய்திகள்",
            "{n} செய்தி",
            "{n} செய்திகள்"
        ]
    },
    "actions": {
        "backToMailbox": "அஞ்சல் பெட்டிக்குத் திரும்பு",
        "reload": "புதுப்பிப்பு",
        "select": "தேர்ந்தெடு",
        "markAsUnread": "படிக்கவில்லை எனக் குறிக்கவும்",
        "markAsRead": "படித்ததாக",
        "moveTo": "க்கு நகர்த்தவும்",
        "delete": "அழி",
        "deletePermanently": "நிரந்தரமாக நீக்கு",
        "discardDrafts": "வரைவுகளை நிராகரி",
        "markAsSpam": "ஸ்பேம் எனக் குறிக்கவும்",
        "unMarkAsSpam": "இது ஸ்பேம் அல்ல",
        "forward": "முன்னோக்கி",
        "reply": "பதில்",
        "attachments": "இணைப்புகள்"
    },
    "weekDays": {
        "0": "ஞாயிற்றுக்கிழமை",
        "1": "திங்கட்கிழமை",
        "2": "செவ்வாய்",
        "3": "புதன்கிழமை",
        "4": "வியாழக்கிழமை",
        "5": "வெள்ளி",
        "6": "சனிக்கிழமை"
    },
    "months": {
        "0": "ஜனவரி",
        "1": "பிப்ரவரி",
        "2": "மார்ச்",
        "3": "ஏப்ரல்",
        "4": "மே",
        "5": "ஜூன்",
        "6": "ஜூலை",
        "7": "ஆகஸ்ட்",
        "8": "செப்டம்பர்",
        "9": "அக்டோபர்",
        "10": "நவம்பர்",
        "11": "டிசம்பர்"
    },
    "notifier": {
        "messageSent": "செய்தி அனுப்பப்பட்டது",
        "mailboxDeleted": "கோப்புறை நீக்கப்பட்டது"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "புதிய அடைவை",
            "success": "கோப்புறை உருவாக்கப்பட்டது"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "புதிய கோப்புறையை உருவாக்கவும்",
            "label": "கோப்புறை பெயர்",
            "accept": "உருவாக்கு",
            "cancel": "ரத்துசெய்"
        },
        "deleteMailbox": {
            "title": "\"{mailbox}\" கோப்புறையை நீக்கு",
            "desc": "எச்சரிக்கை. இந்த செயல் கோப்புறையில் உள்ள எல்லா செய்திகளையும் நிரந்தரமாக நீக்கும்",
            "accept": "அழி",
            "cancel": "ரத்துசெய்"
        }
    },
    "myAccount": {
        "title": "என் கணக்கு",
        "commonActions": {
            "title": "பொதுவான செயல்கள்",
            "updatePassword": "கடவுச்சொல்லைப் புதுப்பிக்கவும்",
            "currentPassword": "தற்போதைய கடவுச்சொல்",
            "newPassword": "புதிய கடவுச்சொல்",
            "confirmPassword": "புதிய கடவு சொல்லை உறுதி செய்"
        },
        "limits": {
            "gbUsed": "{gb} ஜிபி",
            "gbTotal": "{gb} ஜிபி",
            "messagesUsed": [
                "{n} செய்திகள்",
                "{n} செய்தி",
                "{n} செய்திகள்"
            ],
            "messagesTotal": [
                "{n} செய்திகளில்",
                "{n} செய்தியின்",
                "{n} செய்திகளில்"
            ],
            "storage": {
                "title": "சேமிப்பு"
            },
            "imapDownload": {
                "title": "IMAP பதிவிறக்கம்",
                "comment": "தினசரி"
            },
            "imapUpload": {
                "title": "IMAP பதிவேற்றம்",
                "comment": "தினசரி"
            },
            "pop3Download": {
                "title": "POP3 பதிவிறக்கம்",
                "comment": "தினசரி"
            },
            "received": {
                "title": "பெறப்பட்டது",
                "comment": "நிமிடத்தில்"
            },
            "recipients": {
                "title": "அனுப்பப்பட்டது",
                "comment": "தினசரி"
            },
            "forwards": {
                "title": "திருப்பி விடப்பட்டது",
                "comment": "தினசரி"
            }
        }
    },
    "filters": {
        "title": "வடிப்பான்கள்",
        "commingSoon": "விரைவில்"
    }
};
exports.default = locale;
