"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "Inbox",
            "sent": "געשיקט",
            "drafts": "דראַפץ",
            "trash": "אָפּפאַל",
            "junk": "ספּאַם"
        },
        "delete": "ויסמעקן טעקע",
        "empty": "דעם בריווקאַסטן איז ליידיק"
    },
    "message": {
        "labels": {
            "from": "פֿון:",
            "to": "צו:",
            "date": "געשיקט:"
        }
    },
    "mailboxMessage": {
        "to": "צו:"
    },
    "login": {
        "title": "סיין אריין",
        "action": "סיין אריין",
        "labels": {
            "username": "נאמען",
            "password": "שפּריכוואָרט"
        }
    },
    "accountButton": {
        "logout": "צייכן אויס",
        "myAccount": "מיין אקאונט",
        "filters": "פילטערס"
    },
    "compose": {
        "labels": {
            "to": "צו:",
            "subject": "טעמע:",
            "cc": "Cc:",
            "bcc": "Bcc:"
        },
        "tabs": {
            "newMessageTitle": "נייַע אָנזאָג"
        }
    },
    "editor": {
        "cmd": {
            "undo": "ופמאַכן",
            "redo": "רעדאָ",
            "fontName": "שריפֿט טיפּ",
            "fontSize": "שריפֿט גרייס",
            "bold": "דרייסט",
            "italic": "ייטאַל",
            "underline": "אַנדערליין",
            "justifyLeft": "ייַנרייען לינקס",
            "justifyCenter": "ייַנרייען מיטן",
            "justifyRight": "ייַנרייען רעכט",
            "insertUnorderedList": "רשימה",
            "insertOrderedList": "געציילט רשימה",
            "removeFormat": "אַראָפּנעמען פֿאָרמאַט"
        },
        "color": {
            "tooltip": "פאַרב",
            "foreColor": "טעקסט",
            "backColor": "הינטערגרונט"
        },
        "upload": {
            "tooltip": "צוטשעפּען",
            "add": "לייג צו",
            "remove": "אַראָפּנעמען"
        },
        "send": "שיקן"
    },
    "selection": {
        "title": [
            "{n} אַרטיקלען",
            "{n} אָנזאָג",
            "{n} אַרטיקלען"
        ]
    },
    "actions": {
        "backToMailbox": "צוריק צו בריווקאַסטן",
        "reload": "דערפרישן",
        "select": "סעלעקטירן",
        "markAsUnread": "מארק ווי ניט לייענען",
        "markAsRead": "מארק ווי לייענען",
        "moveTo": "גיי אריבער צו",
        "delete": "ויסמעקן",
        "deletePermanently": "ויסמעקן פּערמאַנאַנטלי",
        "discardDrafts": "אַוועקוואַרפן דראַפץ",
        "markAsSpam": "מארק ווי ספּאַם",
        "unMarkAsSpam": "דאָס איז נישט ספּאַם",
        "forward": "פֿאָרווערטס",
        "reply": "ענטפער",
        "attachments": "אַטאַטשמאַנץ"
    },
    "weekDays": {
        "0": "זונטיק",
        "1": "מאנטאג",
        "2": "דינסטאג",
        "3": "מיטוואך",
        "4": "דאָנערשטיק",
        "5": "פרייטיק",
        "6": "שבת"
    },
    "months": {
        "0": "יאנואר",
        "1": "פעברואר",
        "2": "מאַרץ",
        "3": "אפריל",
        "4": "מאי",
        "5": "יוני",
        "6": "יולי",
        "7": "אויגוסט",
        "8": "סעפטעמבער",
        "9": "אקטאבער",
        "10": "נאוועמבער",
        "11": "דעצעמבער"
    },
    "notifier": {
        "messageSent": "אָנזאָג געשיקט",
        "mailboxDeleted": "טעקע אויסגעמעקט"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "ניו טעקע",
            "success": "טעקע באשאפן"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "שאַפֿן נייַע טעקע",
            "label": "טעקע נאָמען",
            "accept": "שאַפֿן",
            "cancel": "באָטל מאַכן"
        },
        "deleteMailbox": {
            "title": "ויסמעקן טעקע \"{mailbox}\"",
            "desc": "וואָרענען. די אַקציע וועט פּערמאַנאַנטלי ויסמעקן אַלע אַרטיקלען אין דער טעקע",
            "accept": "ויסמעקן",
            "cancel": "באָטל מאַכן"
        }
    },
    "myAccount": {
        "title": "מיין אקאונט",
        "commonActions": {
            "title": "פּראָסט אַקשאַנז",
            "updatePassword": "דערהייַנטיקן פּאַראָל",
            "currentPassword": "קראַנט פּאַראָל",
            "newPassword": "ניו פּאַראָל",
            "confirmPassword": "באַשטעטיקן נייַ פּאַראָל"
        },
        "limits": {
            "gbUsed": "{gb} גיגאבייט",
            "gbTotal": "פון {gb} גיגאבייט",
            "messagesUsed": [
                "{n} אַרטיקלען",
                "{n} אָנזאָג",
                "{n} אַרטיקלען"
            ],
            "messagesTotal": [
                "פון {n} אַרטיקלען",
                "פון {n} אָנזאָג",
                "פון {n} אַרטיקלען"
            ],
            "storage": {
                "title": "סטאָרידזש"
            },
            "imapDownload": {
                "title": "IMAP אראפקאפיע",
                "comment": "טעגלעך"
            },
            "imapUpload": {
                "title": "IMAP צופֿעליקער",
                "comment": "טעגלעך"
            },
            "pop3Download": {
                "title": "POP3 אראפקאפיע",
                "comment": "טעגלעך"
            },
            "received": {
                "title": "באקומען",
                "comment": "דורך מינוט"
            },
            "recipients": {
                "title": "געשיקט",
                "comment": "טעגלעך"
            },
            "forwards": {
                "title": "רידערעקטיד",
                "comment": "טעגלעך"
            }
        }
    },
    "filters": {
        "title": "פילטערס",
        "commingSoon": "קומענדיק באַלד"
    }
};
exports.default = locale;
