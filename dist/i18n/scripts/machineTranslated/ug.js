"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "خەت ساندۇقى",
            "sent": "ئەۋەتىلدى",
            "drafts": "Drafts",
            "trash": "ئەخلەت ساندۇقى",
            "junk": "ئەخلەت خەت"
        },
        "delete": "ھۆججەت قىسقۇچنى ئۆچۈرۈڭ",
        "empty": "بۇ خەت ساندۇقى قۇرۇق"
    },
    "message": {
        "labels": {
            "from": "يوللىغۇچى:",
            "to": "To:",
            "date": "ئەۋەتىلگەن:"
        }
    },
    "mailboxMessage": {
        "to": "To:"
    },
    "login": {
        "title": "تىزىملىتىڭ",
        "action": "تىزىملىتىڭ",
        "labels": {
            "username": "ئىشلەتكۈچى ئىسمى",
            "password": "پارول"
        }
    },
    "accountButton": {
        "logout": "چېكىنىش",
        "myAccount": "ھېساباتىم",
        "filters": "سۈزگۈچ"
    },
    "compose": {
        "labels": {
            "to": "To:",
            "subject": "تېما:",
            "cc": "Cc:",
            "bcc": "Bcc:"
        },
        "tabs": {
            "newMessageTitle": "يېڭى ئۇچۇر"
        }
    },
    "editor": {
        "cmd": {
            "undo": "ئەمەلدىن قالدۇرۇش",
            "redo": "Redo",
            "fontName": "خەت شەكلى",
            "fontSize": "خەت چوڭلۇقى",
            "bold": "Bold",
            "italic": "ئىتالىيان",
            "underline": "ئاستى سىزىق",
            "justifyLeft": "سولغا توغرىلاڭ",
            "justifyCenter": "ئوتتۇرىنى توغرىلاڭ",
            "justifyRight": "توغرىلاڭ",
            "insertUnorderedList": "تىزىملىك",
            "insertOrderedList": "نومۇر تىزىملىكى",
            "removeFormat": "فورماتنى ئۆچۈرۈڭ"
        },
        "color": {
            "tooltip": "رەڭ",
            "foreColor": "تېكىست",
            "backColor": "تەگلىك"
        },
        "upload": {
            "tooltip": "Attach",
            "add": "قوش",
            "remove": "ئۆچۈرۈڭ"
        },
        "send": "ئەۋەتىڭ"
    },
    "selection": {
        "title": [
            "{n} ئۇچۇر",
            "{n} ئۇچۇر",
            "{n} ئۇچۇر"
        ]
    },
    "actions": {
        "backToMailbox": "خەت ساندۇقىغا قايتىش",
        "reload": "يېڭىلاش",
        "select": "تاللاڭ",
        "markAsUnread": "ئوقۇمىغاندەك بەلگە قويۇڭ",
        "markAsRead": "ئوقۇغاندەك بەلگە قويۇڭ",
        "moveTo": "يۆتكەڭ",
        "delete": "ئۆچۈرۈش",
        "deletePermanently": "مەڭگۈلۈك ئۆچۈرۈڭ",
        "discardDrafts": "لايىھەنى تاشلاڭ",
        "markAsSpam": "ئەخلەت خەت دەپ بەلگە قويۇڭ",
        "unMarkAsSpam": "بۇ ئەخلەت خەت ئەمەس",
        "forward": "ئالدىغا",
        "reply": "جاۋاب",
        "attachments": "قوشۇمچە ھۆججەتلەر"
    },
    "weekDays": {
        "0": "يەكشەنبە",
        "1": "دۈشەنبە",
        "2": "سەيشەنبە",
        "3": "چارشەنبە",
        "4": "پەيشەنبە",
        "5": "جۈمە",
        "6": "شەنبە"
    },
    "months": {
        "0": "يانۋار",
        "1": "2-ئاي",
        "2": "مارت",
        "3": "ئاپرېل",
        "4": "ماي",
        "5": "Jun",
        "6": "7-ئاي",
        "7": "ئاۋغۇست",
        "8": "سېنتەبىر",
        "9": "ئۆكتەبىر",
        "10": "نويابىر",
        "11": "دېكابىر"
    },
    "notifier": {
        "messageSent": "ئۇچۇر ئەۋەتىلدى",
        "mailboxDeleted": "ھۆججەت قىسقۇچ ئۆچۈرۈلدى"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "يېڭى ھۆججەت قىسقۇچ",
            "success": "ھۆججەت قىسقۇچ قۇرۇلدى"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "يېڭى ھۆججەت قىسقۇچ قۇر",
            "label": "ھۆججەت قىسقۇچنىڭ ئىسمى",
            "accept": "قۇرۇش",
            "cancel": "بىكار قىلىش"
        },
        "deleteMailbox": {
            "title": "ھۆججەت قىسقۇچنى ئۆچۈرۈڭ \"{mailbox}\"",
            "desc": "ئېھتىيات. بۇ ھەرىكەت ھۆججەت قىسقۇچتىكى بارلىق ئۇچۇرلارنى مەڭگۈلۈك ئۆچۈرۈۋېتىدۇ",
            "accept": "ئۆچۈرۈش",
            "cancel": "بىكار قىلىش"
        }
    },
    "myAccount": {
        "title": "ھېساباتىم",
        "commonActions": {
            "title": "ئورتاق ھەرىكەت",
            "updatePassword": "پارولنى يېڭىلاش",
            "currentPassword": "نۆۋەتتىكى پارول",
            "newPassword": "يېڭى پارول",
            "confirmPassword": "يېڭى پارولنى جەزملەشتۈرۈڭ"
        },
        "limits": {
            "gbUsed": "{gb} GB",
            "gbTotal": "of 1} GB",
            "messagesUsed": [
                "{n} ئۇچۇر",
                "{n} ئۇچۇر",
                "{n} ئۇچۇر"
            ],
            "messagesTotal": [
                "of {n} ئۇچۇرلىرى",
                "of {n} ئۇچۇر",
                "of {n} ئۇچۇرلىرى"
            ],
            "storage": {
                "title": "ساقلاش"
            },
            "imapDownload": {
                "title": "IMAP چۈشۈرۈش",
                "comment": "ھەر كۈنى"
            },
            "imapUpload": {
                "title": "IMAP يۈكلەش",
                "comment": "ھەر كۈنى"
            },
            "pop3Download": {
                "title": "POP3 چۈشۈرۈش",
                "comment": "ھەر كۈنى"
            },
            "received": {
                "title": "قوبۇل قىلىندى",
                "comment": "by minute"
            },
            "recipients": {
                "title": "ئەۋەتىلدى",
                "comment": "ھەر كۈنى"
            },
            "forwards": {
                "title": "قايتا نىشانلاندى",
                "comment": "ھەر كۈنى"
            }
        }
    },
    "filters": {
        "title": "سۈزگۈچ",
        "commingSoon": "پات يېقىندا كېلىدۇ"
    }
};
exports.default = locale;
