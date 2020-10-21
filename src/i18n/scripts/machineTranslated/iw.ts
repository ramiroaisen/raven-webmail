import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "תיבת הדואר הנכנס",
      "sent": "נשלח",
      "drafts": "טיוטות",
      "trash": "זבל",
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
      "redo": "בצע שוב",
      "fontName": "סוג גופן",
      "fontSize": "גודל גופן",
      "bold": "נועז",
      "italic": "נטוי",
      "underline": "קו תחתון",
      "justifyLeft": "יישר שמאלה",
      "justifyCenter": "יישר את האמצע",
      "justifyRight": "ליישור מימין",
      "insertUnorderedList": "רשימה",
      "insertOrderedList": "רשימה ממוספרת",
      "removeFormat": "הסר את הפורמט"
    },
    "color": {
      "tooltip": "צבע",
      "foreColor": "טקסט",
      "backColor": "רקע כללי"
    },
    "upload": {
      "tooltip": "צרף",
      "add": "הוסף",
      "remove": "הסר"
    },
    "send": "שלח"
  },
  "selection": {
    "title": [
      "{n} הודעות",
      "{n} הודעה",
      "{n} הודעות"
    ]
  },
  "actions": {
    "backToMailbox": "חזרה לתיבת הדואר",
    "reload": "רענן",
    "select": "בחר",
    "markAsUnread": "סמן שלא נקרא",
    "markAsRead": "סמן כנקרא",
    "moveTo": "לעבור ל",
    "delete": "מחק",
    "deletePermanently": "מחק לצמיתות",
    "discardDrafts": "מחק טיוטות",
    "markAsSpam": "סמן כספאם",
    "unMarkAsSpam": "זה לא ספאם",
    "forward": "קדימה",
    "reply": "תשובה",
    "attachments": "קבצים מצורפים"
  },
  "weekDays": {
    "0": "יום ראשון",
    "1": "יום שני",
    "2": "יום שלישי",
    "3": "יום רביעי",
    "4": "יום חמישי",
    "5": "יום שישי",
    "6": "יום שבת"
  },
  "months": {
    "0": "ינואר",
    "1": "פברואר",
    "2": "מרץ",
    "3": "אפריל",
    "4": "מאי",
    "5": "יוני",
    "6": "יולי",
    "7": "אוגוסט",
    "8": "ספטמבר",
    "9": "אוקטובר",
    "10": "נובמבר",
    "11": "דצמבר"
  },
  "notifier": {
    "messageSent": "הודעה נשלחה",
    "mailboxDeleted": "התיקיה נמחקה"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "תיקייה חדשה",
      "success": "נוצרה תיקיה"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "צור תיקיה חדשה",
      "label": "שם התיקיה",
      "accept": "צור",
      "cancel": "בטל"
    },
    "deleteMailbox": {
      "title": "מחק את התיקיה \"{mailbox}\"",
      "desc": "זהירות. פעולה זו תמחק לצמיתות את כל ההודעות בתיקיה",
      "accept": "מחק",
      "cancel": "בטל"
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
        "{n} הודעה",
        "{n} הודעות"
      ],
      "messagesTotal": [
        "מתוך {n} הודעות",
        "של ההודעה {n}",
        "מתוך {n} הודעות"
      ],
      "storage": {
        "title": "אחסון"
      },
      "imapDownload": {
        "title": "הורדת IMAP",
        "comment": "יום יומי"
      },
      "imapUpload": {
        "title": "העלאת IMAP",
        "comment": "יום יומי"
      },
      "pop3Download": {
        "title": "הורדת POP3",
        "comment": "יום יומי"
      },
      "received": {
        "title": "קיבלו",
        "comment": "לפי דקה"
      },
      "recipients": {
        "title": "נשלח",
        "comment": "יום יומי"
      },
      "forwards": {
        "title": "מופנה מחדש",
        "comment": "יום יומי"
      }
    }
  },
  "filters": {
    "title": "מסננים",
    "commingSoon": "בקרוב"
  }
};

export default locale;