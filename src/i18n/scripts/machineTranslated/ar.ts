import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "صندوق الوارد",
      "sent": "أرسلت",
      "drafts": "المسودات",
      "trash": "قمامة، يدمر، يهدم",
      "junk": "بريد مؤذي"
    },
    "empty": "صندوق البريد هذا فارغ"
  },
  "message": {
    "labels": {
      "from": "من عند:",
      "to": "إلى:",
      "date": "أرسلت:"
    }
  },
  "mailboxMessage": {
    "to": "إلى:"
  },
  "login": {
    "title": "تسجيل الدخول",
    "action": "تسجيل الدخول",
    "labels": {
      "username": "اسم المستخدم",
      "password": "كلمه السر"
    }
  },
  "accountButton": {
    "logout": "خروج",
    "myAccount": "حسابي"
  },
  "compose": {
    "labels": {
      "to": "إلى:",
      "subject": "موضوع:",
      "cc": "نسخة إلى:",
      "bcc": "نسخة مخفية الوجهة:"
    },
    "tabs": {
      "newMessageTitle": "رسالة جديدة"
    }
  },
  "editor": {
    "cmd": {
      "undo": "الغاء التحميل",
      "redo": "إعادة",
      "fontName": "نوع الخط",
      "fontSize": "حجم الخط",
      "bold": "بالخط العريض",
      "italic": "مائل",
      "underline": "تسطير",
      "justifyLeft": "محاذاة إلى اليسار",
      "justifyCenter": "محاذاة الوسط",
      "justifyRight": "محاذاة اليمين",
      "insertUnorderedList": "قائمة",
      "insertOrderedList": "قائمة مرقمة",
      "removeFormat": "إزالة التنسيق"
    },
    "color": {
      "tooltip": "اللون",
      "foreColor": "نص",
      "backColor": "خلفية"
    },
    "upload": {
      "tooltip": "يربط",
      "add": "أضف",
      "remove": "إزالة"
    },
    "send": "إرسال"
  },
  "selection": {
    "title": [
      "{1 رسائل",
      "رسالة {n}",
      "{1 رسائل"
    ]
  },
  "actions": {
    "backToMailbox": "العودة إلى صندوق البريد",
    "reload": "تحديث",
    "select": "تحديد",
    "markAsUnread": "وضع علامة كغير مقروءة",
    "markAsRead": "ضع إشارة مقروء",
    "moveTo": "الانتقال إلى",
    "delete": "حذف",
    "deletePermanently": "حذف بشكل دائم",
    "discardDrafts": "إلغاء المسودات",
    "markAsSpam": "علامة كدعاية",
    "unMarkAsSpam": "هذه ليست بريد مزعج",
    "forward": "إلى الأمام",
    "reply": "الرد",
    "attachments": "المرفقات"
  },
  "weekDays": {
    "0": "الأحد",
    "1": "الإثنين",
    "2": "الثلاثاء",
    "3": "الأربعاء",
    "4": "الخميس",
    "5": "يوم الجمعة",
    "6": "يوم السبت"
  },
  "months": {
    "0": "كانون الثاني",
    "1": "شهر فبراير",
    "2": "مارس",
    "3": "أبريل",
    "4": "مايو",
    "5": "يونيو",
    "6": "يوليو",
    "7": "أغسطس",
    "8": "سبتمبر",
    "9": "اكتوبر",
    "10": "شهر نوفمبر",
    "11": "ديسمبر"
  },
  "notifier": {
    "messageSent": "تم الارسال"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "ملف جديد",
      "success": "تم إنشاء المجلد"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "إنشاء مجلد جديد",
      "label": "إسم الملف",
      "accept": "خلق",
      "cancel": "إلغاء"
    }
  },
  "myAccount": {
    "title": "حسابي",
    "limits": {
      "gbUsed": "{gb} جيجابايت",
      "gbTotal": "من {gb} جيجابايت",
      "storage": {
        "title": "تخزين"
      },
      "imapDownload": {
        "title": "تنزيل IMAP"
      },
      "imapUpload": {
        "title": "تحميل IMAP"
      },
      "pop3Download": {
        "title": "تنزيل POP3"
      }
    }
  }
};

export default locale;