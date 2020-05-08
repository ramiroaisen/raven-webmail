import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Кіріс жәшігі",
      "sent": "Жіберілді",
      "drafts": "Жобалар",
      "trash": "Қоқыс",
      "junk": "Спам"
    },
    "delete": "Қалтаны жою",
    "empty": "Бұл пошта жәшігі бос"
  },
  "message": {
    "labels": {
      "from": "Кімнен:",
      "to": "Кімге:",
      "date": "Жіберілді:"
    }
  },
  "mailboxMessage": {
    "to": "Кімге:"
  },
  "login": {
    "title": "Кіру",
    "action": "Кіру",
    "labels": {
      "username": "Пайдаланушы аты",
      "password": "Пароль"
    }
  },
  "accountButton": {
    "logout": "Шығу",
    "myAccount": "Менің аккаунтым"
  },
  "compose": {
    "labels": {
      "to": "Кімге:",
      "subject": "Тақырып:",
      "cc": "Cc:",
      "bcc": "Жасырын көшірме:"
    },
    "tabs": {
      "newMessageTitle": "Жаңа хабарлама"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Болдырмау",
      "redo": "Қайта жасау",
      "fontName": "Қаріп түрі",
      "fontSize": "Шрифт мөлшері",
      "bold": "Қалың",
      "italic": "Қиғаш",
      "underline": "Астын сыз",
      "justifyLeft": "Солға туралаңыз",
      "justifyCenter": "Ортасын туралаңыз",
      "justifyRight": "Оң жаққа туралаңыз",
      "insertUnorderedList": "Тізім",
      "insertOrderedList": "Нөмірленген тізім",
      "removeFormat": "Пішімді жою"
    },
    "color": {
      "tooltip": "Түсі",
      "foreColor": "Мәтін",
      "backColor": "Фон"
    },
    "upload": {
      "tooltip": "Тіркеңіз",
      "add": "Қосу",
      "remove": "Алып тастаңыз"
    },
    "send": "Жіберіңіз"
  },
  "selection": {
    "title": [
      "{n} хабарлар",
      "{n} хабары",
      "{n} хабарлар"
    ]
  },
  "actions": {
    "backToMailbox": "Пошта жәшігіне оралу",
    "reload": "Сергіту",
    "select": "Таңдаңыз",
    "markAsUnread": "Оқылмаған деп белгілеңіз",
    "markAsRead": "оқылған деп белгілеу",
    "moveTo": "Жылжыту",
    "delete": "Жою",
    "deletePermanently": "Біржолата жою",
    "discardDrafts": "Жобаларды тастаңыз",
    "markAsSpam": "Спам ретінде белгілеу",
    "unMarkAsSpam": "Бұл спам емес",
    "forward": "Алға",
    "reply": "Жауап беру",
    "attachments": "Тіркемелер"
  },
  "weekDays": {
    "0": "Жексенбі",
    "1": "Дүйсенбі",
    "2": "Сейсенбі",
    "3": "Сәрсенбі",
    "4": "Бейсенбі",
    "5": "Жұма",
    "6": "Сенбі"
  },
  "months": {
    "0": "Қаңтар",
    "1": "Ақпан",
    "2": "Наурыз",
    "3": "Сәуір",
    "4": "Мамыр",
    "5": "Маусым",
    "6": "Шілде",
    "7": "Тамыз",
    "8": "Қыркүйек",
    "9": "Қазан",
    "10": "Қараша",
    "11": "Желтоқсан"
  },
  "notifier": {
    "messageSent": "Хабар жіберілді",
    "mailboxDeleted": "Қалта жойылды"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Жаңа папка",
      "success": "Қалта жасалды"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Жаңа қалта жасау",
      "label": "Қалта атауы",
      "accept": "Жасау",
      "cancel": "Болдырмау"
    },
    "deleteMailbox": {
      "title": "«{mailbox}» қалтасын жою",
      "desc": "Абайлаңыз. Бұл әрекет қалтадағы барлық хабарларды толығымен жояды",
      "accept": "Жою",
      "cancel": "Болдырмау"
    }
  },
  "myAccount": {
    "title": "Менің аккаунтым",
    "limits": {
      "gbUsed": "{gb} ГБ",
      "gbTotal": "{gb} ГБ құрайды",
      "messagesUsed": [
        "{n} хабарлар",
        "{n} хабары",
        "{n} хабарлар"
      ],
      "messagesTotal": [
        "хабарлар {n}",
        "{n} хабарынан",
        "хабарлар {n}"
      ],
      "storage": {
        "title": "Сақтау"
      },
      "imapDownload": {
        "title": "IMAP жүктеу",
        "comment": "күнделікті"
      },
      "imapUpload": {
        "title": "IMAP жүктеу",
        "comment": "күнделікті"
      },
      "pop3Download": {
        "title": "POP3 жүктеу",
        "comment": "күнделікті"
      },
      "received": {
        "title": "Алынған",
        "comment": "минутына"
      },
      "recipients": {
        "title": "Жіберілді",
        "comment": "күнделікті"
      },
      "forwards": {
        "title": "Қайта бағытталды",
        "comment": "күнделікті"
      }
    }
  }
};

export default locale;