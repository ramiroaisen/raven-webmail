import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "صندوق ورودی",
      "sent": "ارسال شد",
      "drafts": "پیش نویس",
      "trash": "زباله ها",
      "junk": "هرزنامه ها"
    },
    "delete": "پوشه را حذف کنید",
    "empty": "این صندوق پستی خالی است"
  },
  "message": {
    "labels": {
      "from": "از جانب:",
      "to": "به:",
      "date": "ارسال شد:"
    }
  },
  "mailboxMessage": {
    "to": "به:"
  },
  "login": {
    "title": "ورود",
    "action": "ورود",
    "labels": {
      "username": "نام کاربری",
      "password": "کلمه عبور"
    }
  },
  "accountButton": {
    "logout": "خروج از سیستم",
    "myAccount": "حساب من",
    "filters": "فیلترها"
  },
  "compose": {
    "labels": {
      "to": "به:",
      "subject": "موضوع:",
      "cc": "سی سی:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "پیام جدید"
    }
  },
  "editor": {
    "cmd": {
      "undo": "واگرد",
      "redo": "مجدداً",
      "fontName": "نوع قلم",
      "fontSize": "اندازه فونت",
      "bold": "جسورانه",
      "italic": "ایتالیایی",
      "underline": "تأکید",
      "justifyLeft": "تراز چپ",
      "justifyCenter": "وسط را تراز کنید",
      "justifyRight": "راست بکشید",
      "insertUnorderedList": "لیست",
      "insertOrderedList": "لیست شماره گذاری شده",
      "removeFormat": "قالب را حذف کنید"
    },
    "color": {
      "tooltip": "رنگ",
      "foreColor": "متن",
      "backColor": "زمینه"
    },
    "upload": {
      "tooltip": "ضمیمه کنید",
      "add": "اضافه کردن",
      "remove": "برداشتن"
    },
    "send": "ارسال"
  },
  "selection": {
    "title": [
      "{n} پیام",
      "{n} پیام",
      "{n} پیام"
    ]
  },
  "actions": {
    "backToMailbox": "بازگشت به صندوق پستی",
    "reload": "تازه کردن",
    "select": "انتخاب کنید",
    "markAsUnread": "علامت گذاری به عنوان خوانده نشده است",
    "markAsRead": "به عنوان خوانده شده علامت بزن",
    "moveTo": "انتقال به",
    "delete": "حذف",
    "deletePermanently": "برای همیشه حذف کنید",
    "discardDrafts": "پیش نویس ها را کنار بگذارید",
    "markAsSpam": "علامت گذاری به عنوان هرزنامه",
    "unMarkAsSpam": "این اسپم نیست",
    "forward": "رو به جلو",
    "reply": "پاسخ",
    "attachments": "پیوست ها"
  },
  "weekDays": {
    "0": "یکشنبه",
    "1": "دوشنبه",
    "2": "سهشنبه",
    "3": "چهار شنبه",
    "4": "پنج شنبه",
    "5": "جمعه",
    "6": "شنبه"
  },
  "months": {
    "0": "ژانویه",
    "1": "فوریه",
    "2": "مارس",
    "3": "آوریل",
    "4": "ممکن است",
    "5": "جون",
    "6": "جولای",
    "7": "اوت",
    "8": "سپتامبر",
    "9": "اکتبر",
    "10": "نوامبر",
    "11": "دسامبر"
  },
  "notifier": {
    "messageSent": "پیغام فرستاده شد",
    "mailboxDeleted": "پوشه حذف شد"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "پوشه جدید",
      "success": "پوشه ایجاد شده است"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "پوشه جدید ایجاد کنید",
      "label": "نام پوشه",
      "accept": "ایجاد کردن",
      "cancel": "لغو"
    },
    "deleteMailbox": {
      "title": "حذف پوشه \"{mailbox}\"",
      "desc": "احتیاط با این اقدام دائماً تمام پیام های پوشه حذف می شود",
      "accept": "حذف",
      "cancel": "لغو"
    }
  },
  "myAccount": {
    "title": "حساب من",
    "limits": {
      "gbUsed": "{gb} گیگابایت",
      "gbTotal": "از {gb} گیگابایت",
      "messagesUsed": [
        "{n} پیام",
        "{n} پیام",
        "{n} پیام"
      ],
      "messagesTotal": [
        "از پیام {1",
        "پیام 1 {",
        "از پیام {1"
      ],
      "storage": {
        "title": "ذخیره سازی"
      },
      "imapDownload": {
        "title": "بارگیری IMAP",
        "comment": "روزانه"
      },
      "imapUpload": {
        "title": "آپلود IMAP",
        "comment": "روزانه"
      },
      "pop3Download": {
        "title": "بارگیری POP3",
        "comment": "روزانه"
      },
      "received": {
        "title": "اخذ شده",
        "comment": "دقیقه"
      },
      "recipients": {
        "title": "ارسال شد",
        "comment": "روزانه"
      },
      "forwards": {
        "title": "تغییر مسیر داد",
        "comment": "روزانه"
      }
    }
  },
  "filters": {
    "title": "فیلترها",
    "commingSoon": "به زودی"
  }
};

export default locale;