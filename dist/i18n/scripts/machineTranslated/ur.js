"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "ان باکس",
            "sent": "بھیجا گیا",
            "drafts": "ڈرافٹس",
            "trash": "کوڑے دان",
            "junk": "فضول کے"
        },
        "delete": "فولڈر حذف کریں",
        "empty": "یہ میل باکس خالی ہے"
    },
    "message": {
        "labels": {
            "from": "منجانب:",
            "to": "تک:",
            "date": "بھیجا:"
        }
    },
    "mailboxMessage": {
        "to": "تک:"
    },
    "login": {
        "title": "سائن ان",
        "action": "سائن ان",
        "labels": {
            "username": "صارف نام",
            "password": "پاس ورڈ"
        }
    },
    "accountButton": {
        "logout": "باہر جائیں",
        "myAccount": "میرا اکاونٹ",
        "filters": "فلٹرز"
    },
    "compose": {
        "labels": {
            "to": "تک:",
            "subject": "مضمون:",
            "cc": "سی سی:",
            "bcc": "بی سی سی:"
        },
        "tabs": {
            "newMessageTitle": "نیا پیغام"
        }
    },
    "editor": {
        "cmd": {
            "undo": "کالعدم کریں",
            "redo": "دوبارہ کریں",
            "fontName": "فونٹ کی قسم",
            "fontSize": "حرف کا سائز",
            "bold": "بولڈ",
            "italic": "ترچھا",
            "underline": "لکیر",
            "justifyLeft": "بائیں سیدھ کریں",
            "justifyCenter": "درمیان میں سیدھ کریں",
            "justifyRight": "دائیں سیدھ میں لائیں",
            "insertUnorderedList": "فہرست",
            "insertOrderedList": "نمبر والی فہرست",
            "removeFormat": "فارمیٹ کو ہٹا دیں"
        },
        "color": {
            "tooltip": "رنگ",
            "foreColor": "متن",
            "backColor": "پس منظر"
        },
        "upload": {
            "tooltip": "منسلک کریں",
            "add": "شامل کریں",
            "remove": "دور"
        },
        "send": "بھیجیں"
    },
    "selection": {
        "title": [
            "{n} پیغامات",
            "{n} پیغام",
            "{n} پیغامات"
        ]
    },
    "actions": {
        "backToMailbox": "میل باکس پر واپس جائیں",
        "reload": "ریفریش",
        "select": "منتخب کریں",
        "markAsUnread": "نہ پڑھے ہوئے کے طور پر نشان زد کریں",
        "markAsRead": "پڑھے ہوئے کے بطور نشان زد کریں",
        "moveTo": "پر منتقل",
        "delete": "حذف کریں",
        "deletePermanently": "مستقل طور پر حذف کریں",
        "discardDrafts": "ڈرافٹس کو ضائع کریں",
        "markAsSpam": "اسپام کے بطور نشان زد کریں",
        "unMarkAsSpam": "یہ اسپام نہیں ہے",
        "forward": "آگے",
        "reply": "جواب دیں",
        "attachments": "اٹیچمنٹ"
    },
    "weekDays": {
        "0": "اتوار",
        "1": "پیر",
        "2": "منگل",
        "3": "بدھ",
        "4": "جمعرات",
        "5": "جمعہ",
        "6": "ہفتہ"
    },
    "months": {
        "0": "جنوری",
        "1": "فروری",
        "2": "مارچ",
        "3": "اپریل",
        "4": "مئی",
        "5": "جون",
        "6": "جولائی",
        "7": "اگست",
        "8": "ستمبر",
        "9": "اکتوبر",
        "10": "نومبر",
        "11": "دسمبر"
    },
    "notifier": {
        "messageSent": "پیغام چلا گیا",
        "mailboxDeleted": "فولڈر حذف ہوگیا"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "نیا فولڈر",
            "success": "فولڈر بنایا گیا"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "نیا فولڈر بنائیں",
            "label": "فولڈر کا نام",
            "accept": "بنانا",
            "cancel": "منسوخ کریں"
        },
        "deleteMailbox": {
            "title": "\"{mailbox}\" فولڈر کو حذف کریں",
            "desc": "احتیاط. اس کارروائی سے فولڈر میں موجود تمام پیغامات مستقل طور پر حذف ہوجائیں گے",
            "accept": "حذف کریں",
            "cancel": "منسوخ کریں"
        }
    },
    "myAccount": {
        "title": "میرا اکاونٹ",
        "commonActions": {
            "title": "مشترکہ اقدامات",
            "updatePassword": "پاس ورڈ کو اپ ڈیٹ کریں",
            "currentPassword": "موجودہ خفیہ لفظ",
            "newPassword": "نیا پاس ورڈ",
            "confirmPassword": "نئے پاس ورڈ کی توثیق کریں"
        },
        "limits": {
            "gbUsed": "{gb} جی بی",
            "gbTotal": "{gb} GB کا",
            "messagesUsed": [
                "{n} پیغامات",
                "{n} پیغام",
                "{n} پیغامات"
            ],
            "messagesTotal": [
                "{n} پیغامات کا",
                "{n} پیغام کا",
                "{n} پیغامات کا"
            ],
            "storage": {
                "title": "ذخیرہ"
            },
            "imapDownload": {
                "title": "IMAP ڈاؤن لوڈ کریں",
                "comment": "روزانہ"
            },
            "imapUpload": {
                "title": "IMAP اپ لوڈ",
                "comment": "روزانہ"
            },
            "pop3Download": {
                "title": "POP3 ڈاؤن لوڈ",
                "comment": "روزانہ"
            },
            "received": {
                "title": "موصول ہوا",
                "comment": "منٹ سے"
            },
            "recipients": {
                "title": "بھیجا گیا",
                "comment": "روزانہ"
            },
            "forwards": {
                "title": "ری ڈائریکٹ",
                "comment": "روزانہ"
            }
        }
    },
    "filters": {
        "title": "فلٹرز",
        "commingSoon": "جلد آرہا ہے"
    }
};
exports.default = locale;
