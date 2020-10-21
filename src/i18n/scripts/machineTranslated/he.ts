import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "תיבת הדואר הנכנס",
      "sent": "נשלח",
      "drafts": "דַמקָה",
      "trash": "אַשׁפָּה",
      "junk": "ספאם"
    },
    "delete": "מחק תיקיה",
    "empty": "תיבת דואר זו ריקה"
  },
  "message": {
    "labels": {
      "from": "מ:",
      "to": "ל:",
      "date": "נשלח:"
    }
  },
  "mailboxMessage": {
    "to": "ל:"
  },
  "login": {
    "title": "להתחבר",
    "action": "להתחבר",
    "labels": {
      "username": "שם משתמש",
      "password": "סיסמה"
    }
  },
  "accountButton": {
    "logout": "התנתק",
    "myAccount": "החשבון שלי",
    "filters": "מסננים"
  },
  "compose": {
    "labels": {
      "to": "ל:",
      "subject": "נושא:",
      "cc": "עותק:",
      "bcc": "עותק מוסתר:"
    },
    "tabs": {
      "newMessageTitle": "הודעה חדשה"
    }
  },
  "editor": {
    "cmd": {
      "undo": "לבטל",
      "redo": "לַעֲשׂוֹת שׁוּב",
      "fontName": "סוג גופן",
      "fontSize": "גודל גופן",
      "bold": "נוֹעָז",
      "italic": "נטוי",
      "underline": "לָשִׂים דָגֵשׁ",
      "justifyLeft": "יישר שמאלה",
      "justifyCenter": "יישר אמצע",
      "justifyRight": "ליישור מימין",
      "insertUnorderedList": "רשימה",
      "insertOrderedList": "רשימה ממוספרת",
      "removeFormat": "הסר פורמט"
    },
    "color": {
      "tooltip": "צֶבַע",
      "foreColor": "טֶקסט",
      "backColor": "רקע כללי"
    },
    "upload": {
      "tooltip": "לְצַרֵף",
      "add": "לְהוֹסִיף",
      "remove": "לְהַסִיר"
    },
    "send": "לִשְׁלוֹחַ"
  },
  "selection": {
    "title": [
      "{n} הודעות",
      "הודעה {n}",
      "{n} הודעות"
    ]
  },
  "actions": {
    "backToMailbox": "חזרה לתיבת הדואר",
    "reload": "לְרַעֲנֵן",
    "select": "בחר",
    "markAsUnread": "סמן כלא נקרא",
    "markAsRead": "סמן כנקרא",
    "moveTo": "לעבור ל",
    "delete": "לִמְחוֹק",
    "deletePermanently": "מחק לצמיתות",
    "discardDrafts": "מחק טיוטות",
    "markAsSpam": "סמן כספאם",
    "unMarkAsSpam": "זה לא דואר זבל",
    "forward": "קָדִימָה",
    "reply": "תשובה",
    "attachments": "קבצים מצורפים"
  },
  "weekDays": {
    "0": "יוֹם רִאשׁוֹן",
    "1": "יוֹם שֵׁנִי",
    "2": "יוֹם שְׁלִישִׁי",
    "3": "יום רביעי",
    "4": "יוֹם חֲמִישִׁי",
    "5": "יוֹם שִׁישִׁי",
    "6": "יום שבת"
  },
  "months": {
    "0": "יָנוּאָר",
    "1": "פברואר",
    "2": "מרץ",
    "3": "אַפּרִיל",
    "4": "מאי",
    "5": "יוני",
    "6": "יולי",
    "7": "אוגוסט",
    "8": "סֶפּטֶמבֶּר",
    "9": "אוֹקְטוֹבֶּר",
    "10": "נוֹבֶמבֶּר",
    "11": "דֵצֶמבֶּר"
  },
  "notifier": {
    "messageSent": "הודעה נשלחה",
    "mailboxDeleted": "התיקיה נמחקה"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "תיקייה חדשה",
      "success": "תיקיה נוצרה"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "צור תיקיה חדשה",
      "label": "שם התיקיה",
      "accept": "לִיצוֹר",
      "cancel": "לְבַטֵל"
    },
    "deleteMailbox": {
      "title": "מחק את התיקייה \"{mailbox}\"",
      "desc": "זְהִירוּת. פעולה זו תמחק לצמיתות את כל ההודעות בתיקיה",
      "accept": "לִמְחוֹק",
      "cancel": "לְבַטֵל"
    }
  },
  "myAccount": {
    "title": "החשבון שלי",
    "commonActions": {
      "title": "פעולות נפוצות",
      "updatePassword": "עדכן סיסמה",
      "currentPassword": "סיסמה נוכחית",
      "newPassword": "סיסמה חדשה",
      "confirmPassword": "תאשר סיסמא חדשה"
    },
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "מתוך {gb} GB",
      "messagesUsed": [
        "{n} הודעות",
        "הודעה {n}",
        "{n} הודעות"
      ],
      "messagesTotal": [
        "מתוך {n} הודעות",
        "מתוך ההודעה {n}",
        "מתוך {n} הודעות"
      ],
      "storage": {
        "title": "אִחסוּן"
      },
      "imapDownload": {
        "title": "הורדת IMAP",
        "comment": "יומי"
      },
      "imapUpload": {
        "title": "העלאת IMAP",
        "comment": "יומי"
      },
      "pop3Download": {
        "title": "הורדת POP3",
        "comment": "יומי"
      },
      "received": {
        "title": "קיבלו",
        "comment": "לפי דקה"
      },
      "recipients": {
        "title": "נשלח",
        "comment": "יומי"
      },
      "forwards": {
        "title": "הופנה מחדש",
        "comment": "יומי"
      }
    }
  },
  "filters": {
    "title": "מסננים",
    "commingSoon": "בקרוב"
  }
};

export default locale;