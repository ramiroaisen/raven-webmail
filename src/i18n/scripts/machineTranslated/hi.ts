import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "इनबॉक्स",
      "sent": "भेज दिया",
      "drafts": "ड्राफ्ट",
      "trash": "कचरा",
      "junk": "स्पैम"
    },
    "empty": "यह मेलबॉक्स खाली है"
  },
  "message": {
    "labels": {
      "from": "से:",
      "to": "सेवा:",
      "date": "भेज दिया:"
    }
  },
  "mailboxMessage": {
    "to": "सेवा:"
  },
  "login": {
    "title": "साइन इन करें",
    "action": "साइन इन करें",
    "labels": {
      "username": "उपयोगकर्ता नाम",
      "password": "कुंजिका"
    }
  },
  "accountButton": {
    "logout": "प्रस्थान करें",
    "myAccount": "मेरा खाता"
  },
  "compose": {
    "labels": {
      "to": "सेवा:",
      "subject": "विषय:",
      "cc": "प्रतिलिपि:",
      "bcc": "गुप्त प्रति:"
    },
    "tabs": {
      "newMessageTitle": "नया संदेश"
    }
  },
  "editor": {
    "cmd": {
      "undo": "पूर्ववत करें",
      "redo": "फिर से करें",
      "fontName": "फ़ॉन्ट प्रकार",
      "fontSize": "फ़ॉन्ट आकार",
      "bold": "साहसिक",
      "italic": "तिरछा",
      "underline": "रेखांकन",
      "justifyLeft": "बाये को करी",
      "justifyCenter": "बीच में संरेखित करें",
      "justifyRight": "सही संरेखित",
      "insertUnorderedList": "सूची",
      "insertOrderedList": "क्रमांकित सूची",
      "removeFormat": "प्रारूप निकालें"
    },
    "color": {
      "tooltip": "रंग",
      "foreColor": "टेक्स्ट",
      "backColor": "पृष्ठभूमि"
    },
    "upload": {
      "tooltip": "संलग्न करें",
      "add": "जोड़ना",
      "remove": "हटाना"
    },
    "send": "संदेश"
  },
  "selection": {
    "title": [
      "{undefined} संदेश",
      "{n} संदेश",
      "{undefined} संदेश"
    ]
  },
  "actions": {
    "backToMailbox": "वापस मेलबॉक्स में",
    "reload": "ताज़ा करना",
    "select": "चुनते हैं",
    "markAsUnread": "पढ़े हुए के रूप में नहीं",
    "markAsRead": "पढ़े हुए का चिह्न",
    "moveTo": "करने के लिए कदम",
    "delete": "हटाएं",
    "deletePermanently": "स्थायी रूप से मिटाएं",
    "discardDrafts": "ड्राफ्ट त्यागें",
    "markAsSpam": "स्पैम के रूप में मार्क करें",
    "unMarkAsSpam": "यह स्पैम नहीं है",
    "forward": "आगे",
    "reply": "जवाब दे दो",
    "attachments": "संलग्नक"
  },
  "weekDays": {
    "0": "रविवार",
    "1": "सोमवार",
    "2": "मंगलवार",
    "3": "बुधवार",
    "4": "गुरूवार",
    "5": "शुक्रवार",
    "6": "शनिवार"
  },
  "months": {
    "0": "जनवरी",
    "1": "फरवरी",
    "2": "मार्च",
    "3": "अप्रैल",
    "4": "मई",
    "5": "जून",
    "6": "जुलाई",
    "7": "अगस्त",
    "8": "सितंबर",
    "9": "अक्टूबर",
    "10": "नवंबर",
    "11": "दिसंबर"
  },
  "notifier": {
    "messageSent": "मैसेज बेजा गया"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "नया फोल्डर",
      "success": "फ़ोल्डर बनाया गया"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "नया फ़ोल्डर बनाओ",
      "label": "फोल्डर का नाम",
      "accept": "सृजन करना",
      "cancel": "रद्द करना"
    }
  },
  "myAccount": {
    "title": "मेरा खाता",
    "limits": {
      "gbUsed": "{undefined} जीबी",
      "gbTotal": "{gb} GB का",
      "messagesUsed": [
        "{undefined} संदेश",
        "{n} संदेश",
        "{undefined} संदेश"
      ],
      "messagesTotal": [
        "{n} संदेशों के",
        "{n} संदेश का",
        "{n} संदेशों के"
      ],
      "storage": {
        "title": "भंडारण"
      },
      "imapDownload": {
        "title": "IMAP डाउनलोड करें",
        "comment": "रोज"
      },
      "imapUpload": {
        "title": "IMAP अपलोड",
        "comment": "रोज"
      },
      "pop3Download": {
        "title": "POP3 डाउनलोड करें",
        "comment": "रोज"
      },
      "received": {
        "title": "प्राप्त किया",
        "comment": "मिनट के हिसाब से"
      },
      "recipients": {
        "title": "भेज दिया",
        "comment": "रोज"
      },
      "forwards": {
        "title": "रीडायरेक्ट",
        "comment": "रोज"
      }
    }
  }
};

export default locale;