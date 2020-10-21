"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "ઇનબોક્સ",
            "sent": "મોકલેલો",
            "drafts": "ડ્રાફ્ટ્સ",
            "trash": "કચરો",
            "junk": "સ્પામ"
        },
        "delete": "ફોલ્ડર કા Deleteી નાખો",
        "empty": "આ મેઇલબોક્સ ખાલી છે"
    },
    "message": {
        "labels": {
            "from": "તરફથી:",
            "to": "પ્રતિ:",
            "date": "મોકલાયેલ:"
        }
    },
    "mailboxMessage": {
        "to": "પ્રતિ:"
    },
    "login": {
        "title": "સાઇન ઇન કરો",
        "action": "સાઇન ઇન કરો",
        "labels": {
            "username": "વપરાશકર્તા નામ",
            "password": "પાસવર્ડ"
        }
    },
    "accountButton": {
        "logout": "સાઇન આઉટ",
        "myAccount": "મારું ખાતું",
        "filters": "ગાળકો"
    },
    "compose": {
        "labels": {
            "to": "પ્રતિ:",
            "subject": "વિષય:",
            "cc": "સીસી:",
            "bcc": "બીસીસી:"
        },
        "tabs": {
            "newMessageTitle": "નવો સંદેશ"
        }
    },
    "editor": {
        "cmd": {
            "undo": "પૂર્વવત્ કરો",
            "redo": "ફરી કરો",
            "fontName": "ફontન્ટ પ્રકાર",
            "fontSize": "અક્ષર ની જાડાઈ",
            "bold": "બોલ્ડ",
            "italic": "ઇટાલિક",
            "underline": "રેખાંકિત",
            "justifyLeft": "ડાબી સંરેખિત કરો",
            "justifyCenter": "મધ્યમાં સંરેખિત કરો",
            "justifyRight": "જમણે સંરેખિત કરો",
            "insertUnorderedList": "યાદી",
            "insertOrderedList": "ક્રમાંકિત સૂચિ",
            "removeFormat": "ફોર્મેટ દૂર કરો"
        },
        "color": {
            "tooltip": "રંગ",
            "foreColor": "ટેક્સ્ટ",
            "backColor": "પૃષ્ઠભૂમિ"
        },
        "upload": {
            "tooltip": "જોડો",
            "add": "ઉમેરો",
            "remove": "દૂર કરો"
        },
        "send": "મોકલો"
    },
    "selection": {
        "title": [
            "{n} સંદેશા",
            "{n} સંદેશ",
            "{n} સંદેશા"
        ]
    },
    "actions": {
        "backToMailbox": "પાછા મેઇલબોક્સ પર",
        "reload": "તાજું કરો",
        "select": "પસંદ કરો",
        "markAsUnread": "ન વાંચેલ તરીકે માર્ક કરો",
        "markAsRead": "વાંચેલા તરીકે ચિહ્નિત કરો",
        "moveTo": "ખસેડવું",
        "delete": "કા .ી નાખો",
        "deletePermanently": "કાયમીરૂપે કા Deleteી નાંખો",
        "discardDrafts": "ડ્રાફ્ટ કાardી નાખો",
        "markAsSpam": "સ્પામ તરીકે ચિહ્નિત કરો",
        "unMarkAsSpam": "આ સ્પામ નથી",
        "forward": "આગળ",
        "reply": "જવાબ",
        "attachments": "જોડાણો"
    },
    "weekDays": {
        "0": "રવિવાર",
        "1": "સોમવાર",
        "2": "મંગળવારે",
        "3": "બુધવાર",
        "4": "ગુરુવાર",
        "5": "શુક્રવાર",
        "6": "શનિવાર"
    },
    "months": {
        "0": "જાન્યુઆરી",
        "1": "ફેબ્રુઆરી",
        "2": "કુચ",
        "3": "એપ્રિલ",
        "4": "મે",
        "5": "જૂન",
        "6": "જુલાઈ",
        "7": ".ગસ્ટ",
        "8": "સપ્ટેમ્બર",
        "9": "ઓક્ટોબર",
        "10": "નવેમ્બર",
        "11": "ડિસેમ્બર"
    },
    "notifier": {
        "messageSent": "સંદેશ મોકલ્યો",
        "mailboxDeleted": "ફોલ્ડર કા deletedી નાખ્યું"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "નવું ફોલ્ડર",
            "success": "ફોલ્ડર બનાવ્યું"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "નવું ફોલ્ડર બનાવો",
            "label": "ફોલ્ડર નામ",
            "accept": "બનાવો",
            "cancel": "રદ કરો"
        },
        "deleteMailbox": {
            "title": "\"{mailbox}\" ફોલ્ડર કા Deleteી નાખો",
            "desc": "સાવધાની. આ ક્રિયા ફોલ્ડરમાંના બધા સંદેશા કાયમીરૂપે કા .ી નાખશે",
            "accept": "કા .ી નાખો",
            "cancel": "રદ કરો"
        }
    },
    "myAccount": {
        "title": "મારું ખાતું",
        "commonActions": {
            "title": "સામાન્ય ક્રિયાઓ",
            "updatePassword": "પાસવર્ડ અપડેટ કરો",
            "currentPassword": "અત્યારનો પાસવર્ડ",
            "newPassword": "નવો પાસવર્ડ",
            "confirmPassword": "નવાપાસવર્ડની પુષ્ટી કરો"
        },
        "limits": {
            "gbUsed": ". 1} જીબી",
            "gbTotal": "{gb} જીબી",
            "messagesUsed": [
                "{n} સંદેશા",
                "{n} સંદેશ",
                "{n} સંદેશા"
            ],
            "messagesTotal": [
                "{n} સંદેશાઓનો",
                "{n} સંદેશનો",
                "{n} સંદેશાઓનો"
            ],
            "storage": {
                "title": "સંગ્રહ"
            },
            "imapDownload": {
                "title": "IMAP ડાઉનલોડ કરો",
                "comment": "દૈનિક"
            },
            "imapUpload": {
                "title": "IMAP અપલોડ",
                "comment": "દૈનિક"
            },
            "pop3Download": {
                "title": "પીઓપી 3 ડાઉનલોડ કરો",
                "comment": "દૈનિક"
            },
            "received": {
                "title": "પ્રાપ્ત થયો",
                "comment": "મિનિટ દ્વારા"
            },
            "recipients": {
                "title": "મોકલેલો",
                "comment": "દૈનિક"
            },
            "forwards": {
                "title": "રીડાયરેક્ટ",
                "comment": "દૈનિક"
            }
        }
    },
    "filters": {
        "title": "ગાળકો",
        "commingSoon": "ટૂક સમયમાં આવી રહ્યું છે"
    }
};
exports.default = locale;
