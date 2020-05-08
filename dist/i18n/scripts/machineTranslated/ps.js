"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "Inbox",
            "sent": "لیږل شوی",
            "drafts": "مسودې",
            "trash": "کثافات",
            "junk": "سپیم"
        },
        "delete": "پوښی ړنګ کړئ",
        "empty": "دا میل بکس خالي دی"
    },
    "message": {
        "labels": {
            "from": "له:",
            "to": "ته:",
            "date": "لیږل شوی:"
        }
    },
    "mailboxMessage": {
        "to": "ته:"
    },
    "login": {
        "title": "ننوزئ",
        "action": "ننوزئ",
        "labels": {
            "username": "کارن نوم",
            "password": "رمز"
        }
    },
    "accountButton": {
        "logout": "وتون",
        "myAccount": "زما حساب"
    },
    "compose": {
        "labels": {
            "to": "ته:",
            "subject": "موضوع:",
            "cc": "سي سي:",
            "bcc": "بي سي سي:"
        },
        "tabs": {
            "newMessageTitle": "نوی پیغام"
        }
    },
    "editor": {
        "cmd": {
            "undo": "ړنګول",
            "redo": "بیا یې کړئ",
            "fontName": "د لیکب .ې ډول",
            "fontSize": "د لیکب .ې اندازه",
            "bold": "بولډ",
            "italic": "ایټالیک",
            "underline": "لاندینۍ کرښه",
            "justifyLeft": "کي left اړخ کې سمول",
            "justifyCenter": "وچ برابر",
            "justifyRight": "ښي لاس ته ځي",
            "insertUnorderedList": "لیست",
            "insertOrderedList": "لمبر لیست",
            "removeFormat": "ب Removeه لرې کړئ"
        },
        "color": {
            "tooltip": "رنګ",
            "foreColor": "متن",
            "backColor": "شالید"
        },
        "upload": {
            "tooltip": "ضمیمه کړئ",
            "add": "اضافه کول",
            "remove": "لرې کړئ"
        },
        "send": "ولېږئ"
    },
    "selection": {
        "title": [
            "{n} پېغامونه",
            "{n} پیغام",
            "{n} پېغامونه"
        ]
    },
    "actions": {
        "backToMailbox": "بیرته میل باکس ته",
        "reload": "تازه کړئ",
        "select": "وټاکئ",
        "markAsUnread": "په لوستلو سره یې نښه کړئ",
        "markAsRead": "د لوستلو په توګه نښه کړئ",
        "moveTo": "ته خوځول",
        "delete": "ړنګول",
        "deletePermanently": "د تل لپاره ړنګ کړئ",
        "discardDrafts": "مسودې رد کړئ",
        "markAsSpam": "د سپیم په توګه نښه کړئ",
        "unMarkAsSpam": "دا سپیم ندی",
        "forward": "فارورډ",
        "reply": "ځواب ورکړئ",
        "attachments": "ضمیمه"
    },
    "weekDays": {
        "0": "یک شنبه",
        "1": "دوشنبه",
        "2": "سه شنبه",
        "3": "چهارشنبه",
        "4": "پنجشنبه",
        "5": "جمعه",
        "6": "شنبه"
    },
    "months": {
        "0": "جنوري",
        "1": "فبروري",
        "2": "مارچ",
        "3": "اپریل",
        "4": "می",
        "5": "جون",
        "6": "جولای",
        "7": "اګست",
        "8": "سپتمبر",
        "9": "اکتوبر",
        "10": "نومبر",
        "11": "دسمبر"
    },
    "notifier": {
        "messageSent": "پیغام ولیږل شو",
        "mailboxDeleted": "پوښی ړنګ شو"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "نوی پوښۍ",
            "success": "پوښی جوړ شو"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "نوی فولډر جوړ کړئ",
            "label": "د پوښی نوم",
            "accept": "جوړول",
            "cancel": "لغوه کول"
        },
        "deleteMailbox": {
            "title": "پوښۍ \"{mailbox}\" ړنګ کړئ",
            "desc": "احتیاط. دا عمل به په فولډر کې د تل لپاره ټول پیغامونه حذف کړي",
            "accept": "ړنګول",
            "cancel": "لغوه کول"
        }
    },
    "myAccount": {
        "title": "زما حساب",
        "limits": {
            "gbUsed": "{gb} GB",
            "gbTotal": "د {gb} جی بی",
            "messagesUsed": [
                "{n} پېغامونه",
                "{n} پیغام",
                "{n} پېغامونه"
            ],
            "messagesTotal": [
                "د {n} پیغامونو",
                "د {n} پيغام",
                "د {n} پیغامونو"
            ],
            "storage": {
                "title": "زېرمه"
            },
            "imapDownload": {
                "title": "IMAP ډاونلوډ",
                "comment": "هره ورځ"
            },
            "imapUpload": {
                "title": "د IMAP اپلوډ",
                "comment": "هره ورځ"
            },
            "pop3Download": {
                "title": "POP3 ډاونلوډ",
                "comment": "هره ورځ"
            },
            "received": {
                "title": "ترلاسه شوی",
                "comment": "دقیقې لخوا"
            },
            "recipients": {
                "title": "لیږل شوی",
                "comment": "هره ورځ"
            },
            "forwards": {
                "title": "ورانول",
                "comment": "هره ورځ"
            }
        }
    }
};
exports.default = locale;
