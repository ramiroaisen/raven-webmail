import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "इनबक्स",
      "sent": "पठाइयो",
      "drafts": "ड्राफ्ट्स",
      "trash": "रद्दी टोकरी",
      "junk": "स्पाम"
    },
    "delete": "फोल्डर मेटाउनुहोस्",
    "empty": "यो मेलबक्स खाली छ"
  },
  "message": {
    "labels": {
      "from": "बाट:",
      "to": "लाई:",
      "date": "पठाइयो:"
    }
  },
  "mailboxMessage": {
    "to": "लाई:"
  },
  "login": {
    "title": "साईन ईन गर्नुहोस्",
    "action": "साईन ईन गर्नुहोस्",
    "labels": {
      "username": "प्रयोगकर्ता नाम",
      "password": "पासवर्ड"
    }
  },
  "accountButton": {
    "logout": "साइन आउट गर्नुहोस्",
    "myAccount": "मेरो खाता",
    "filters": "फिल्टरहरू"
  },
  "compose": {
    "labels": {
      "to": "लाई:",
      "subject": "विषय:",
      "cc": "बोधार्थ:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "नयाँ सन्देश"
    }
  },
  "editor": {
    "cmd": {
      "undo": "अन्डु गर्नुहोस्",
      "redo": "फेरि गर्नुहोस्",
      "fontName": "फन्ट प्रकार",
      "fontSize": "फन्ट आकार",
      "bold": "बोल्ड",
      "italic": "ईटालिक",
      "underline": "रेखांकित",
      "justifyLeft": "बाँया पign्क्तिबद्ध गर्नुहोस्",
      "justifyCenter": "बीचमा पign्क्तिबद्ध गर्नुहोस्",
      "justifyRight": "दाँया पign्क्तिबद्ध गर्नुहोस्",
      "insertUnorderedList": "सूची",
      "insertOrderedList": "संख्यागत सूची",
      "removeFormat": "ढाँचा हटाउनुहोस्"
    },
    "color": {
      "tooltip": "रंग",
      "foreColor": "पाठ",
      "backColor": "पृष्ठभूमि"
    },
    "upload": {
      "tooltip": "संलग्न गर्नुहोस्",
      "add": "थप्नुहोस्",
      "remove": "हटाउनुहोस्"
    },
    "send": "पठाउनुहोस्"
  },
  "selection": {
    "title": [
      "। १} सन्देशहरू",
      "{undefined} सन्देश",
      "। १} सन्देशहरू"
    ]
  },
  "actions": {
    "backToMailbox": "मेलबक्समा फिर्ता",
    "reload": "रिफ्रेस गर्नुहोस्",
    "select": "चयन गर्नुहोस्",
    "markAsUnread": "पढिएको छैन भनेर चिन्ह लगाउनुहोस्",
    "markAsRead": "पढिसकेको अंकित गर्नुहोस्",
    "moveTo": "सार्नुहोस्",
    "delete": "मेटाउन",
    "deletePermanently": "स्थायी रूपमा मेटाउनुहोस्",
    "discardDrafts": "ड्राफ्ट खारेज गर्नुहोस्",
    "markAsSpam": "स्पामको रूपमा मार्क गर्नुहोस्",
    "unMarkAsSpam": "यो स्पाम होईन",
    "forward": "अगाडि",
    "reply": "जवाफ दिनुहोस्",
    "attachments": "संलग्नकहरू"
  },
  "weekDays": {
    "0": "आइतवार",
    "1": "सोमबार",
    "2": "मंगलबार",
    "3": "बुधवार",
    "4": "बिहीबार",
    "5": "शुक्रवार",
    "6": "शनिबार"
  },
  "months": {
    "0": "जनवरी",
    "1": "फेब्रुअरी",
    "2": "मार्च",
    "3": "अप्रिल",
    "4": "सक्छ",
    "5": "जुन",
    "6": "जुलाई",
    "7": "अगस्त",
    "8": "सेप्टेम्बर",
    "9": "अक्टुबर",
    "10": "नोभेम्बर",
    "11": "डिसेम्बर"
  },
  "notifier": {
    "messageSent": "सन्देश पठाइयो",
    "mailboxDeleted": "फोल्डर मेटाईयो"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "नयाँ फोल्डर",
      "success": "फोल्डर सिर्जना गरियो"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "नयाँ फोल्डर सिर्जना गर्नुहोस्",
      "label": "फोल्डर नाम",
      "accept": "सिर्जना गर्नुहोस्",
      "cancel": "रद्द गर्नुहोस्"
    },
    "deleteMailbox": {
      "title": "\"{mailbox}\" फोल्डर मेटाउनुहोस्",
      "desc": "सावधानी। यस कार्यले फोल्डरमा स्थायी रूपमा सबै सन्देशहरू मेटाउनेछ",
      "accept": "मेटाउन",
      "cancel": "रद्द गर्नुहोस्"
    }
  },
  "myAccount": {
    "title": "मेरो खाता",
    "commonActions": {
      "title": "साझा कार्यहरू",
      "updatePassword": "पासवर्ड अपडेट गर्नुहोस्",
      "currentPassword": "वर्तमान पासवर्ड",
      "newPassword": "नया पासवर्ड",
      "confirmPassword": "नयाँ पासवर्ड निश्चित गर्नुहोस्"
    },
    "limits": {
      "gbUsed": "{undefined} जीबी",
      "gbTotal": "{undefined} जीबीको",
      "messagesUsed": [
        "। १} सन्देशहरू",
        "{undefined} सन्देश",
        "। १} सन्देशहरू"
      ],
      "messagesTotal": [
        "{n} सन्देशहरूको",
        "{n} सन्देश को",
        "{n} सन्देशहरूको"
      ],
      "storage": {
        "title": "भण्डारण"
      },
      "imapDownload": {
        "title": "IMAP डाउनलोड गर्नुहोस्",
        "comment": "दैनिक"
      },
      "imapUpload": {
        "title": "IMAP अपलोड",
        "comment": "दैनिक"
      },
      "pop3Download": {
        "title": "POP3 डाउनलोड गर्नुहोस्",
        "comment": "दैनिक"
      },
      "received": {
        "title": "प्राप्त भयो",
        "comment": "मिनेट द्वारा"
      },
      "recipients": {
        "title": "पठाइयो",
        "comment": "दैनिक"
      },
      "forwards": {
        "title": "पुनर्निर्देशित",
        "comment": "दैनिक"
      }
    }
  },
  "filters": {
    "title": "फिल्टरहरू",
    "commingSoon": "आउदैछ"
  }
};

export default locale;