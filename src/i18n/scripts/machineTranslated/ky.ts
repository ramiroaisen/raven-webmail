import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Кирүү кутусу",
      "sent": "жөнөтүлдү",
      "drafts": "Мыйзам долбоорлору",
      "trash": "таштанды",
      "junk": "Спам"
    },
    "empty": "Бул почта ящиги бош"
  },
  "message": {
    "labels": {
      "from": "From:",
      "to": "үчүн:",
      "date": "жөнөтүлдү:"
    }
  },
  "mailboxMessage": {
    "to": "үчүн:"
  },
  "login": {
    "title": "Кирүү",
    "action": "Кирүү",
    "labels": {
      "username": "Кирүү",
      "password": "Купуя сөз"
    }
  },
  "accountButton": {
    "logout": "Чыгуу",
    "myAccount": "Менин эсебим"
  },
  "compose": {
    "labels": {
      "to": "үчүн:",
      "subject": "Subject:",
      "cc": "көчүрмө:",
      "bcc": "биринчи нусканы жиберүү:"
    },
    "tabs": {
      "newMessageTitle": "Жаңы кат"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Undo",
      "redo": "кайталоо",
      "fontName": "Шрифт түрү",
      "fontSize": "Шрифт өлчөмү",
      "bold": "Bold",
      "italic": "Italic",
      "underline": "Underline",
      "justifyLeft": "Солго тегиздөө",
      "justifyCenter": "Ортосунда тегиздөө",
      "justifyRight": "Оңго тегиздөө",
      "insertUnorderedList": "тизме",
      "insertOrderedList": "Номерленген тизме",
      "removeFormat": "Форматту алып салуу"
    },
    "color": {
      "tooltip": "Түс",
      "foreColor": "текст",
      "backColor": "Негизги"
    },
    "upload": {
      "tooltip": "бириктирүү",
      "add": "кошуу",
      "remove": "Remove"
    },
    "send": "Send"
  },
  "selection": {
    "title": [
      "{n} билдирүүлөр",
      "{n} билдирүү",
      "{n} билдирүүлөр"
    ]
  },
  "actions": {
    "backToMailbox": "Почта ящикке кайтуу",
    "reload": "сергитүү",
    "select": "тандоо",
    "markAsUnread": "Окулган эмес деп белгилөө",
    "markAsRead": "окулган деп белгилөө",
    "moveTo": "Жылдыруу",
    "delete": "Delete",
    "deletePermanently": "Түбөлүккө өчүрүү Түбөлүккө өчүрүү",
    "discardDrafts": "Чиймелерди жокко чыгаруу",
    "markAsSpam": "Спам катары белгилөө",
    "unMarkAsSpam": "Бул спам эмес",
    "forward": "алдыга",
    "reply": "жооп",
    "attachments": "Тиркемелер"
  },
  "weekDays": {
    "0": "Жекшемби",
    "1": "Дүйшөмбү",
    "2": "Шейшемби",
    "3": "Шаршемби",
    "4": "Бейшемби",
    "5": "Жума",
    "6": "Ишемби"
  },
  "months": {
    "0": "Январь",
    "1": "Февраль",
    "2": "Март",
    "3": "Апрель",
    "4": "Май",
    "5": "Jun",
    "6": "Июль",
    "7": "Август",
    "8": "Сентябрь",
    "9": "Октябрь",
    "10": "Ноябрь",
    "11": "Декабрь"
  },
  "notifier": {
    "messageSent": "Билдирүү жөнөтүлдү"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Жаңы Папка",
      "success": "Папка түзүлдү"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Жаңы Папканы түзүү",
      "label": "Куржундун аты",
      "accept": "түзүү",
      "cancel": "жокко чыгаруу"
    }
  },
  "myAccount": {
    "title": "Менин эсебим",
    "limits": {
      "gbUsed": "{gb} ГБ",
      "gbTotal": "of {gb} ГБ",
      "messagesUsed": [
        "{n} билдирүүлөр",
        "{n} билдирүү",
        "{n} билдирүүлөр"
      ],
      "messagesTotal": [
        "билдирүүлөрүнүн {n}",
        "билдирүүсү {n}",
        "билдирүүлөрүнүн {n}"
      ],
      "storage": {
        "title": "сактоочу жай"
      },
      "imapDownload": {
        "title": "IMAP жүктөө",
        "comment": "күндө"
      },
      "imapUpload": {
        "title": "IMAP жүктөө",
        "comment": "күндө"
      },
      "pop3Download": {
        "title": "POP3 Жүктөө",
        "comment": "күндө"
      },
      "received": {
        "title": "кабыл алынган",
        "comment": "мүнөт менен"
      },
      "recipients": {
        "title": "жөнөтүлдү",
        "comment": "күндө"
      }
    }
  }
};

export default locale;