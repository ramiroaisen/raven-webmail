import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "входящие",
      "sent": "Отправлено",
      "drafts": "Черновики",
      "trash": "дрянь",
      "junk": "Спам"
    },
    "delete": "Удалить папку",
    "empty": "Этот почтовый ящик пуст"
  },
  "message": {
    "labels": {
      "from": "От:",
      "to": "Для того, чтобы:",
      "date": "Отправлено:"
    }
  },
  "mailboxMessage": {
    "to": "Для того, чтобы:"
  },
  "login": {
    "title": "войти в систему",
    "action": "войти в систему",
    "labels": {
      "username": "имя пользователя",
      "password": "пароль"
    }
  },
  "accountButton": {
    "logout": "выход",
    "myAccount": "Мой счет",
    "filters": "фильтры"
  },
  "compose": {
    "labels": {
      "to": "Для того, чтобы:",
      "subject": "Тема:",
      "cc": "Cc:",
      "bcc": "Bcc:"
    },
    "tabs": {
      "newMessageTitle": "Новое сообщение"
    }
  },
  "editor": {
    "cmd": {
      "undo": "Отменить",
      "redo": "Redo",
      "fontName": "Тип шрифта",
      "fontSize": "Размер шрифта",
      "bold": "Смелый",
      "italic": "курсивный",
      "underline": "Подчеркнутый",
      "justifyLeft": "Выровнять по левому краю",
      "justifyCenter": "Выровнять середину",
      "justifyRight": "Выровнять право",
      "insertUnorderedList": "Список",
      "insertOrderedList": "Нумерованный список",
      "removeFormat": "Удалить формат"
    },
    "color": {
      "tooltip": "цвет",
      "foreColor": "Текст",
      "backColor": "Фон"
    },
    "upload": {
      "tooltip": "Прикреплять",
      "add": "Добавить",
      "remove": "Удалить"
    },
    "send": "послать"
  },
  "selection": {
    "title": [
      "{n} сообщения",
      "{n} сообщение",
      "{n} сообщения"
    ]
  },
  "actions": {
    "backToMailbox": "Вернуться к почтовому ящику",
    "reload": "обновление",
    "select": "Выбрать",
    "markAsUnread": "Пометить как не прочитанное",
    "markAsRead": "пометить, как прочитанное",
    "moveTo": "Переместить в",
    "delete": "удалять",
    "deletePermanently": "Удалить навсегда",
    "discardDrafts": "Отменить черновики",
    "markAsSpam": "Отметить как спам",
    "unMarkAsSpam": "Это не спам",
    "forward": "Вперед",
    "reply": "Ответить",
    "attachments": "Вложения"
  },
  "weekDays": {
    "0": "Воскресенье",
    "1": "понедельник",
    "2": "вторник",
    "3": "среда",
    "4": "Четверг",
    "5": "пятница",
    "6": "суббота"
  },
  "months": {
    "0": "январь",
    "1": "февраль",
    "2": "марш",
    "3": "апреля",
    "4": "май",
    "5": "июнь",
    "6": "июль",
    "7": "августейший",
    "8": "сентябрь",
    "9": "октября",
    "10": "ноябрь",
    "11": "Декабрь"
  },
  "notifier": {
    "messageSent": "Сообщение отправлено",
    "mailboxDeleted": "Папка удалена"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "Новая папка",
      "success": "Папка создана"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "Создать новую папку",
      "label": "Имя папки",
      "accept": "Создайте",
      "cancel": "Отмена"
    },
    "deleteMailbox": {
      "title": "Удалить папку \"{mailbox}\"",
      "desc": "Внимание. Это действие навсегда удалит все сообщения в папке",
      "accept": "удалять",
      "cancel": "Отмена"
    }
  },
  "myAccount": {
    "title": "Мой счет",
    "commonActions": {
      "title": "Общие действия",
      "updatePassword": "Обновить пароль",
      "currentPassword": "Текущий пароль",
      "newPassword": "Новый пароль",
      "confirmPassword": "Подтвердите новый пароль"
    },
    "limits": {
      "gbUsed": "{gb} ГБ",
      "gbTotal": "{gb} ГБ",
      "messagesUsed": [
        "{n} сообщения",
        "{n} сообщение",
        "{n} сообщения"
      ],
      "messagesTotal": [
        "из {n} сообщений",
        "из {n} сообщения",
        "из {n} сообщений"
      ],
      "storage": {
        "title": "Место хранения"
      },
      "imapDownload": {
        "title": "IMAP Скачать",
        "comment": "ежедневно"
      },
      "imapUpload": {
        "title": "IMAP Загрузить",
        "comment": "ежедневно"
      },
      "pop3Download": {
        "title": "POP3 Скачать",
        "comment": "ежедневно"
      },
      "received": {
        "title": "Получил",
        "comment": "по минутам"
      },
      "recipients": {
        "title": "Отправлено",
        "comment": "ежедневно"
      },
      "forwards": {
        "title": "Redirected",
        "comment": "ежедневно"
      }
    }
  },
  "filters": {
    "title": "фильтры",
    "commingSoon": "Скоро будет"
  }
};

export default locale;