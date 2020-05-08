import { Locale } from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "收件箱",
      "sent": "已發送",
      "drafts": "草稿",
      "trash": "垃圾",
      "junk": "垃圾郵件"
    },
    "delete": "刪除資料夾",
    "empty": "這個郵箱是空的"
  },
  "message": {
    "labels": {
      "from": "從：",
      "to": "至：",
      "date": "發送："
    }
  },
  "mailboxMessage": {
    "to": "至："
  },
  "login": {
    "title": "登入",
    "action": "登入",
    "labels": {
      "username": "用戶名",
      "password": "密碼"
    }
  },
  "accountButton": {
    "logout": "登出",
    "myAccount": "我的帳戶"
  },
  "compose": {
    "labels": {
      "to": "至：",
      "subject": "學科：",
      "cc": "抄送：",
      "bcc": "密件副本："
    },
    "tabs": {
      "newMessageTitle": "新消息"
    }
  },
  "editor": {
    "cmd": {
      "undo": "撤消",
      "redo": "重做",
      "fontName": "字體類型",
      "fontSize": "字體大小",
      "bold": "膽大",
      "italic": "斜體",
      "underline": "強調",
      "justifyLeft": "左對齊",
      "justifyCenter": "中間對齊",
      "justifyRight": "右對齊",
      "insertUnorderedList": "清單",
      "insertOrderedList": "編號清單",
      "removeFormat": "刪除格式"
    },
    "color": {
      "tooltip": "顏色",
      "foreColor": "文本",
      "backColor": "背景"
    },
    "upload": {
      "tooltip": "連接",
      "add": "加",
      "remove": "去掉"
    },
    "send": "發送"
  },
  "selection": {
    "title": [
      "{n}條消息",
      "{n}條消息",
      "{n}條消息"
    ]
  },
  "actions": {
    "backToMailbox": "返回信箱",
    "reload": "刷新",
    "select": "選擇",
    "markAsUnread": "標記為未讀",
    "markAsRead": "標記為已讀",
    "moveTo": "搬去",
    "delete": "刪除",
    "deletePermanently": "永久刪除",
    "discardDrafts": "丟棄草稿",
    "markAsSpam": "標記為垃圾郵件",
    "unMarkAsSpam": "這不是垃圾郵件",
    "forward": "向前",
    "reply": "回复",
    "attachments": "附件"
  },
  "weekDays": {
    "0": "星期日",
    "1": "星期一",
    "2": "星期二",
    "3": "星期三",
    "4": "星期四",
    "5": "星期五",
    "6": "星期六"
  },
  "months": {
    "0": "一月",
    "1": "二月",
    "2": "遊行",
    "3": "四月",
    "4": "可以",
    "5": "君",
    "6": "七月",
    "7": "八月",
    "8": "九月",
    "9": "十月",
    "10": "十一月",
    "11": "十二月"
  },
  "notifier": {
    "messageSent": "訊息已發送",
    "mailboxDeleted": "資料夾已刪除"
  },
  "drawerActions": {
    "createMailbox": {
      "label": "新建文件夾",
      "success": "資料夾已建立"
    }
  },
  "dialogs": {
    "createMailbox": {
      "title": "建立新資料夾",
      "label": "文件夾名稱",
      "accept": "創建",
      "cancel": "取消"
    },
    "deleteMailbox": {
      "title": "刪除文件夾“ {mailbox}”",
      "desc": "警告。此操作將永久刪除文件夾中的所有郵件",
      "accept": "刪除",
      "cancel": "取消"
    }
  },
  "myAccount": {
    "title": "我的帳戶",
    "limits": {
      "gbUsed": "{gb} GB",
      "gbTotal": "{gb} GB",
      "messagesUsed": [
        "{n}條消息",
        "{n}條消息",
        "{n}條消息"
      ],
      "messagesTotal": [
        "{n}條消息中",
        "的{n}條消息",
        "{n}條消息中"
      ],
      "storage": {
        "title": "存儲"
      },
      "imapDownload": {
        "title": "IMAP下載",
        "comment": "日常"
      },
      "imapUpload": {
        "title": "IMAP上傳",
        "comment": "日常"
      },
      "pop3Download": {
        "title": "POP3下載",
        "comment": "日常"
      },
      "received": {
        "title": "已收到",
        "comment": "按分鐘"
      },
      "recipients": {
        "title": "已發送",
        "comment": "日常"
      },
      "forwards": {
        "title": "重新導向",
        "comment": "日常"
      }
    }
  }
};

export default locale;