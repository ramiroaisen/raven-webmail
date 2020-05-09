import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Уваходныя",
      "sent": "Адпраўлена",
      "drafts": "Чарнавікі",
      "trash": "Хлам",
      "junk": "Спам"
    },
    "delete": "Выдаліць тэчку",
    "empty": "Гэты паштовы скрыню пусты"
  },
  "message": {
    "labels": {
      "from": "Ад:",
      "to": "Для:",
      "date": "Адпраўлена:"
    }
  },
  "mailboxMessage": {
    "to": "Для:"
  },
  "login": {
    "title": "Увайсці",
    "action": "Увайсці",
    "labels": {
      "username": "Імя карыстальніка",
      "password": "Пароль"
    }
  },
  "accountButton": {
    "logout": "Выйсці",
    "myAccount": "Мой рахунак",
    "filters": "Фільтры"
  },
  "compose": {
    "labels": {
      "to": "Для:",
      "subject": "Тэма:",
      "cc": "Копія:",
      "bcc": "Копія:"
    },
    "tabs": {
      "newMessageTitle": "Новае паведамленне"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Адмяніць",
      "redo": "Рэда",
      "fontName": "Тып шрыфта",
      "fontSize": "Памер шрыфта",
      "bold": "Смелы",
      "italic": "Курсіў",
      "underline": "Падкрэсліце",
      "justifyLeft": "Выраўнаваць налева",
      "justifyCenter": "Выраўняйце сярэдзіну",
      "justifyRight": "Выраўняйце правільна",
      "insertUnorderedList": "Спіс",
      "insertOrderedList": "Нумараваны спіс",
      "removeFormat": "Выдаліць фармат"
    },
    "color": {
      "tooltip": "Колер",
      "foreColor": "Тэкст",
      "backColor": "Перадумовы"
    },
    "upload": {
      "tooltip": "Прымацаваць",
      "add": "Дадаць",
      "remove": "Выдаліць"
    },
    "send": "Адправіць"
  },
  "selection": {
    "title": [
      "{n} паведамленні",
      "{n} паведамленне",
      "{n} паведамленні"
    ]
  },
  "actions": {
    "backToMailbox": "Вярнуцца да паштовай скрыні",
    "reload": "Абнавіць",
    "select": "Абярыце",
    "markAsUnread": "Адзначыць як не прачытаную",
    "markAsRead": "Адзначыць як прачытанае",
    "moveTo": "Перайсці да",
    "delete": "Выдаліць",
    "deletePermanently": "Выдаліць назаўсёды",
    "discardDrafts": "Адкіньце скразнякі",
    "markAsSpam": "Адзначыць як спам",
    "unMarkAsSpam": "Гэта не спам",
    "forward": "Наперад",
    "reply": "Адказаць",
    "attachments": "Укладанні"
  },
  "weekDays": {
    "0": "Нядзеля",
    "1": "Панядзелак",
    "2": "Аўторак",
    "3": "Серада",
    "4": "Чацвер",
    "5": "Пятніца",
    "6": "Субота"
  },
  "months": {
    "0": "Студзень",
    "1": "Люты",
    "2": "Сакавік",
    "3": "Красавік",
    "4": "Мая",
    "5": "Чэрвень",
    "6": "Ліпень",
    "7": "Жнівень",
    "8": "Верасень",
    "9": "Кастрычніцкая",
    "10": "Лістапада",
    "11": "Снежань"
  },
  "notifier": {
    "messageSent": "Паведамленне адпраўлена",
    "mailboxDeleted": "Папка выдаленая"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Новая тэчка",
      "success": "Папка створана"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Стварыце новую тэчку",
      "label": "Назва тэчкі",
      "accept": "Ствары",
      "cancel": "Адмяніць"
    },
    "deleteMailbox": {
      "title": "Выдаліць тэчку \"{mailbox}\"",
      "desc": "Асцярожна. Гэта дзеянне назаўсёды выдаліць усе паведамленні ў тэчцы",
      "accept": "Выдаліць",
      "cancel": "Адмяніць"
    }
  },
  "myAccount": {
    "title": "Мой рахунак",
    "limits": {
      "gbUsed": "{gb} ГБ",
      "gbTotal": "ад {gb} ГБ",
      "messagesUsed": [
        "{n} паведамленні",
        "{n} паведамленне",
        "{n} паведамленні"
      ],
      "messagesTotal": [
        "з {n} паведамленняў",
        "паведамлення {n}",
        "з {n} паведамленняў"
      ],
      "storage": {
        "title": "Захоўванне"
      },
      "imapDownload": {
        "title": "Загрузка IMAP",
        "comment": "штодня"
      },
      "imapUpload": {
        "title": "Загрузка IMAP",
        "comment": "штодня"
      },
      "pop3Download": {
        "title": "Спампаваць POP3",
        "comment": "штодня"
      },
      "received": {
        "title": "Паступіла",
        "comment": "за хвілінай"
      },
      "recipients": {
        "title": "Адпраўлена",
        "comment": "штодня"
      },
      "forwards": {
        "title": "Перанакіравана",
        "comment": "штодня"
      }
    }
  },
  "filters": {
    "title": "Фільтры",
    "commingSoon": "Хутка"
  }
};

export default locale;