import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "Инбок",
      "sent": "Послано",
      "drafts": "Скице",
      "trash": "Смеће",
      "junk": "Спам"
    },
    "empty": "Овај поштански сандучић је празан"
  },
  "message": {
    "labels": {
      "from": "Од:",
      "to": "До:",
      "date": "Послано:"
    }
  },
  "mailboxMessage": {
    "to": "До:"
  },
  "login": {
    "title": "Пријавите се",
    "action": "Пријавите се",
    "labels": {
      "username": "Корисничко име",
      "password": "Лозинка"
    }
  },
  "accountButton": {
    "logout": "Одјава",
    "myAccount": "Мој налог"
  },
  "compose": {
    "labels": {
      "to": "До:",
      "subject": "Предмет:",
      "cc": "Цц:",
      "bcc": "Скривена копија:"
    },
    "tabs": {
      "newMessageTitle": "Нова порука"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Поништи",
      "redo": "Редо",
      "fontName": "Тип фонта",
      "fontSize": "Величина слова",
      "bold": "Одважан",
      "italic": "Италиц",
      "underline": "Подвући",
      "justifyLeft": "Поравнати лево",
      "justifyCenter": "Поравнајте средину",
      "justifyRight": "Поравнајте право",
      "insertUnorderedList": "Листа",
      "insertOrderedList": "Нумерисана листа",
      "removeFormat": "Уклони формат"
    },
    "color": {
      "tooltip": "Боја",
      "foreColor": "Текст",
      "backColor": "Позадина"
    },
    "upload": {
      "tooltip": "Причврстити",
      "add": "Додати",
      "remove": "Уклони"
    },
    "send": "Пошаљи"
  },
  "selection": {
    "title": [
      "{n} поруке",
      "{n} порука",
      "{n} поруке"
    ]
  },
  "actions": {
    "backToMailbox": "Назад у поштанско сандуче",
    "reload": "Освјежи",
    "select": "Изаберите",
    "markAsUnread": "Означи као прочитано",
    "markAsRead": "Означи као прочитано",
    "moveTo": "Померити у",
    "delete": "Избриши",
    "deletePermanently": "Трајно избришите",
    "discardDrafts": "Одбаците скице",
    "markAsSpam": "Означи као нежељену пошту",
    "unMarkAsSpam": "Ово није спам",
    "forward": "Напред",
    "reply": "Одговорити",
    "attachments": "Прилози"
  },
  "weekDays": {
    "0": "Недеља",
    "1": "Понедељак",
    "2": "Уторак",
    "3": "Среда",
    "4": "Четвртак",
    "5": "Петак",
    "6": "Субота"
  },
  "months": {
    "0": "Јануара",
    "1": "Фебруара",
    "2": "Март",
    "3": "Април",
    "4": "Може",
    "5": "Јун",
    "6": "Јули",
    "7": "Август",
    "8": "септембар",
    "9": "Октобар",
    "10": "Новембар",
    "11": "Децембар"
  },
  "notifier": {
    "messageSent": "Порука послата"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Нова фасцикла",
      "success": "Фолдер је креиран"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Креирајте нову фасциклу",
      "label": "Име фасцикле",
      "accept": "Креирај",
      "cancel": "Поништити, отказати"
    }
  },
  "myAccount": {
    "title": "Мој налог",
    "limits": {
      "gbUsed": "{gb} ГБ",
      "gbTotal": "од {gb} ГБ",
      "messagesUsed": [
        "{n} поруке",
        "{n} порука",
        "{n} поруке"
      ],
      "messagesTotal": [
        "од {n} порука",
        "од {n} поруке",
        "од {n} порука"
      ],
      "storage": {
        "title": "Складиште"
      },
      "imapDownload": {
        "title": "Довнлоад ИМАП",
        "comment": "дневно"
      },
      "imapUpload": {
        "title": "ИМАП уплоад",
        "comment": "дневно"
      },
      "pop3Download": {
        "title": "ПОП3 Довнлоад",
        "comment": "дневно"
      },
      "received": {
        "title": "Примљен",
        "comment": "по минуту"
      },
      "recipients": {
        "title": "Послано",
        "comment": "дневно"
      },
      "forwards": {
        "title": "Преусмерено",
        "comment": "дневно"
      }
    }
  }
};

export default locale;