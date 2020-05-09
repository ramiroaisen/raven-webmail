"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "इनबॉक्स",
            "sent": "पाठविले",
            "drafts": "मसुदे",
            "trash": "कचरा",
            "junk": "स्पॅम"
        },
        "delete": "फोल्डर हटवा",
        "empty": "हा मेलबॉक्स रिक्त आहे"
    },
    "message": {
        "labels": {
            "from": "कडून:",
            "to": "प्रतिः",
            "date": "पाठविला:"
        }
    },
    "mailboxMessage": {
        "to": "प्रतिः"
    },
    "login": {
        "title": "साइन इन करा",
        "action": "साइन इन करा",
        "labels": {
            "username": "वापरकर्तानाव",
            "password": "संकेतशब्द"
        }
    },
    "accountButton": {
        "logout": "साइन आउट करा",
        "myAccount": "माझे खाते",
        "filters": "फिल्टर"
    },
    "compose": {
        "labels": {
            "to": "प्रतिः",
            "subject": "विषय:",
            "cc": "सीसी:",
            "bcc": "Bcc:"
        },
        "tabs": {
            "newMessageTitle": "नवीन संदेश"
        }
    },
    "editor": {
        "cmd": {
            "undo": "पूर्ववत करा",
            "redo": "पुन्हा करा",
            "fontName": "फॉन्ट प्रकार",
            "fontSize": "अक्षराचा आकार",
            "bold": "धीट",
            "italic": "तिर्यक",
            "underline": "अधोरेखित",
            "justifyLeft": "डावीकडे संरेखित करा",
            "justifyCenter": "मध्यभागी संरेखित करा",
            "justifyRight": "उजवीकडे संरेखित करा",
            "insertUnorderedList": "यादी",
            "insertOrderedList": "क्रमांकित यादी",
            "removeFormat": "स्वरूप काढा"
        },
        "color": {
            "tooltip": "रंग",
            "foreColor": "मजकूर",
            "backColor": "पार्श्वभूमी"
        },
        "upload": {
            "tooltip": "संलग्न करा",
            "add": "जोडा",
            "remove": "काढा"
        },
        "send": "पाठवा"
    },
    "selection": {
        "title": [
            "{n} संदेश",
            "{n} संदेश",
            "{n} संदेश"
        ]
    },
    "actions": {
        "backToMailbox": "मेलबॉक्सकडे परत",
        "reload": "रीफ्रेश",
        "select": "निवडा",
        "markAsUnread": "वाचले नाही म्हणून चिन्हांकित करा",
        "markAsRead": "वाचलेले म्हणून चिन्हांकित करा",
        "moveTo": "पुढे व्हा",
        "delete": "हटवा",
        "deletePermanently": "कायमचे हटवा",
        "discardDrafts": "मसुदे टाकून द्या",
        "markAsSpam": "स्पॅम म्हणून चिन्हांकित करा",
        "unMarkAsSpam": "हे स्पॅम नाही",
        "forward": "पुढे",
        "reply": "प्रत्युत्तर द्या",
        "attachments": "जोड"
    },
    "weekDays": {
        "0": "रविवारी",
        "1": "सोमवार",
        "2": "मंगळवार",
        "3": "बुधवार",
        "4": "गुरुवार",
        "5": "शुक्रवार",
        "6": "शनिवार"
    },
    "months": {
        "0": "जानेवारी",
        "1": "फेब्रुवारी",
        "2": "मार्च",
        "3": "एप्रिल",
        "4": "मे",
        "5": "जून",
        "6": "जुलै",
        "7": "ऑगस्ट",
        "8": "सप्टेंबर",
        "9": "ऑक्टोबर",
        "10": "नोव्हेंबर",
        "11": "डिसेंबर"
    },
    "notifier": {
        "messageSent": "संदेश पाठवला",
        "mailboxDeleted": "फोल्डर हटविला"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "नवीन फोल्डर",
            "success": "फोल्डर तयार केला"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "नवीन फोल्डर तयार करा",
            "label": "फोल्डर नाव",
            "accept": "तयार करा",
            "cancel": "रद्द करा"
        },
        "deleteMailbox": {
            "title": "\"{mailbox}\" फोल्डर हटवा",
            "desc": "सावधगिरी. ही क्रिया फोल्डरमधील सर्व संदेश कायमचे हटवेल",
            "accept": "हटवा",
            "cancel": "रद्द करा"
        }
    },
    "myAccount": {
        "title": "माझे खाते",
        "limits": {
            "gbUsed": ". 1} जीबी",
            "gbTotal": "{1. जीबीचे",
            "messagesUsed": [
                "{n} संदेश",
                "{n} संदेश",
                "{n} संदेश"
            ],
            "messagesTotal": [
                "{n} संदेशांचे",
                "{n} संदेशाचा",
                "{n} संदेशांचे"
            ],
            "storage": {
                "title": "साठवण"
            },
            "imapDownload": {
                "title": "IMAP डाउनलोड",
                "comment": "दररोज"
            },
            "imapUpload": {
                "title": "IMAP अपलोड",
                "comment": "दररोज"
            },
            "pop3Download": {
                "title": "पीओपी 3 डाउनलोड करा",
                "comment": "दररोज"
            },
            "received": {
                "title": "मिळाले",
                "comment": "मिनिटाने"
            },
            "recipients": {
                "title": "पाठविले",
                "comment": "दररोज"
            },
            "forwards": {
                "title": "पुनर्निर्देशित",
                "comment": "दररोज"
            }
        }
    },
    "filters": {
        "title": "फिल्टर",
        "commingSoon": "लवकरच येत आहे"
    }
};
exports.default = locale;
