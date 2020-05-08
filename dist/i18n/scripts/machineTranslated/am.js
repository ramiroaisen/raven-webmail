"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "የገቢ መልእክት ሳጥን",
            "sent": "ተልኳል",
            "drafts": "ረቂቆች",
            "trash": "መጣያ",
            "junk": "አይፈለጌ መልእክት"
        },
        "delete": "አቃፊ ሰርዝ",
        "empty": "ይህ የመልእክት ሳጥን ባዶ ነው"
    },
    "message": {
        "labels": {
            "from": "ከ:",
            "to": "ለ",
            "date": "ተልኳል"
        }
    },
    "mailboxMessage": {
        "to": "ለ"
    },
    "login": {
        "title": "ስግን እን",
        "action": "ስግን እን",
        "labels": {
            "username": "የተጠቃሚ ስም",
            "password": "ፕስወርድ"
        }
    },
    "accountButton": {
        "logout": "ዛግተ ውጣ",
        "myAccount": "አካውንቴ"
    },
    "compose": {
        "labels": {
            "to": "ለ",
            "subject": "ርዕሰ ጉዳይ:",
            "cc": "ካርቦን ቅጂ",
            "bcc": "ስውር ካርቦን ቅጂ"
        },
        "tabs": {
            "newMessageTitle": "አዲስ መልእክት"
        }
    },
    "editor": {
        "cmd": {
            "undo": "ቀልብስ",
            "redo": "ድገም",
            "fontName": "የቅርጸ-ቁምፊ ዓይነት",
            "fontSize": "የቅርጸ-ቁምፊ መጠን",
            "bold": "ደማቅ",
            "italic": "ሰያፍ",
            "underline": "ከስር ማስመር",
            "justifyLeft": "ወደ ግራ አሰልፍ",
            "justifyCenter": "መሃል አሰልፍ",
            "justifyRight": "በቀኝ አሰልፍ",
            "insertUnorderedList": "ዝርዝር",
            "insertOrderedList": "ቁጥራዊ ዝርዝር",
            "removeFormat": "ቅርጸት አስወግድ"
        },
        "color": {
            "tooltip": "ቀለም",
            "foreColor": "ጽሑፍ",
            "backColor": "ዳራ"
        },
        "upload": {
            "tooltip": "አያይዝ",
            "add": "ያክሉ",
            "remove": "ያስወግዱ"
        },
        "send": "ይላኩ"
    },
    "selection": {
        "title": [
            "{n} መልእክቶች",
            "{n} መልእክት",
            "{n} መልእክቶች"
        ]
    },
    "actions": {
        "backToMailbox": "ወደ የመልዕክት ሳጥን ተመለስ",
        "reload": "አድስ",
        "select": "ይምረጡ",
        "markAsUnread": "እንዳልተነበበ ምልክት ያድርጉበት",
        "markAsRead": "እንደተነበበ ምልክት ያድርጉበት",
        "moveTo": "ውሰድ ወደ",
        "delete": "ሰርዝ",
        "deletePermanently": "እስከመጨረሻው ሰርዝ",
        "discardDrafts": "ረቂቆችን ጣል",
        "markAsSpam": "እንደ አይፈለጌ መልእክት ምልክት አድርግበት",
        "unMarkAsSpam": "ይህ አይፈለጌ መልእክት አይደለም",
        "forward": "አስተላልፍ",
        "reply": "መልስ ስጥ",
        "attachments": "ዓባሪዎች"
    },
    "weekDays": {
        "0": "እሁድ",
        "1": "ሰኞ",
        "2": "ማክሰኞ",
        "3": "እሮብ",
        "4": "ሐሙስ",
        "5": "አርብ",
        "6": "ቅዳሜ"
    },
    "months": {
        "0": "ጥር",
        "1": "የካቲት",
        "2": "መጋቢት",
        "3": "ሚያዚያ",
        "4": "ግንቦት",
        "5": "ጁን",
        "6": "ሀምሌ",
        "7": "ነሐሴ",
        "8": "መስከረም",
        "9": "ጥቅምት",
        "10": "ህዳር",
        "11": "ታህሳስ"
    },
    "notifier": {
        "messageSent": "መልእክት ተልኳል",
        "mailboxDeleted": "አቃፊ ተሰር .ል"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "አዲስ ማህደር",
            "success": "አቃፊ ተፈጥሯል"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "አዲስ አቃፊ ፍጠር",
            "label": "የአቃፊ ስም",
            "accept": "ፍጠር",
            "cancel": "ይቅር"
        },
        "deleteMailbox": {
            "title": "አቃፊ ሰርዝ \"{mailbox}\"",
            "desc": "ጥንቃቄ. ይህ እርምጃ በፋይሉ ውስጥ ያሉትን ሁሉንም መልእክቶች በቋሚነት ይሰርዛል",
            "accept": "ሰርዝ",
            "cancel": "ይቅር"
        }
    },
    "myAccount": {
        "title": "አካውንቴ",
        "limits": {
            "gbUsed": "{gb} ጊባ",
            "gbTotal": "ከ {gb} ጊባ",
            "messagesUsed": [
                "{n} መልእክቶች",
                "{n} መልእክት",
                "{n} መልእክቶች"
            ],
            "messagesTotal": [
                "ከ {n} መልእክቶች",
                "ከ {n} መልእክት",
                "ከ {n} መልእክቶች"
            ],
            "storage": {
                "title": "ማከማቻ"
            },
            "imapDownload": {
                "title": "IMAP ማውረድ",
                "comment": "በየቀኑ"
            },
            "imapUpload": {
                "title": "IMAP ጭነት",
                "comment": "በየቀኑ"
            },
            "pop3Download": {
                "title": "POP3 ማውረድ",
                "comment": "በየቀኑ"
            },
            "received": {
                "title": "ተቀብሏል",
                "comment": "በደቂቃ"
            },
            "recipients": {
                "title": "ተልኳል",
                "comment": "በየቀኑ"
            },
            "forwards": {
                "title": "አቅጣጫው ተመላልሷል",
                "comment": "በየቀኑ"
            }
        }
    }
};
exports.default = locale;
