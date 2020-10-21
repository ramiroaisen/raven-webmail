"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "受信トレイ",
            "sent": "送信しました",
            "drafts": "下書き",
            "trash": "ゴミ",
            "junk": "スパム"
        },
        "delete": "フォルダを削除",
        "empty": "このメールボックスは空です"
    },
    "message": {
        "labels": {
            "from": "から：",
            "to": "に：",
            "date": "送信済み："
        }
    },
    "mailboxMessage": {
        "to": "に："
    },
    "login": {
        "title": "サインイン",
        "action": "サインイン",
        "labels": {
            "username": "ユーザー名",
            "password": "パスワード"
        }
    },
    "accountButton": {
        "logout": "サインアウト",
        "myAccount": "マイアカウント",
        "filters": "フィルター"
    },
    "compose": {
        "labels": {
            "to": "に：",
            "subject": "件名：",
            "cc": "Cc：",
            "bcc": "Bcc："
        },
        "tabs": {
            "newMessageTitle": "新しいメッセージ"
        }
    },
    "editor": {
        "cmd": {
            "undo": "元に戻す",
            "redo": "やり直す",
            "fontName": "フォントタイプ",
            "fontSize": "フォントサイズ",
            "bold": "大胆な",
            "italic": "イタリック",
            "underline": "下線",
            "justifyLeft": "左揃え",
            "justifyCenter": "中央揃え",
            "justifyRight": "右揃え",
            "insertUnorderedList": "リスト",
            "insertOrderedList": "番号付きリスト",
            "removeFormat": "フォーマットを削除"
        },
        "color": {
            "tooltip": "色",
            "foreColor": "テキスト",
            "backColor": "バックグラウンド"
        },
        "upload": {
            "tooltip": "添付",
            "add": "追加",
            "remove": "削除する"
        },
        "send": "送る"
    },
    "selection": {
        "title": [
            "{n}メッセージ",
            "{n}メッセージ",
            "{n}メッセージ"
        ]
    },
    "actions": {
        "backToMailbox": "メールボックスに戻る",
        "reload": "リフレッシュ",
        "select": "選択する",
        "markAsUnread": "未読にする",
        "markAsRead": "既読にする",
        "moveTo": "へ引っ越す",
        "delete": "削除する",
        "deletePermanently": "完全に削除",
        "discardDrafts": "下書きを破棄",
        "markAsSpam": "スパムとしてマーク",
        "unMarkAsSpam": "これはスパムではありません",
        "forward": "進む",
        "reply": "応答",
        "attachments": "付属品"
    },
    "weekDays": {
        "0": "日曜日",
        "1": "月曜",
        "2": "火曜日",
        "3": "水曜日",
        "4": "木曜日",
        "5": "金曜日",
        "6": "土曜日"
    },
    "months": {
        "0": "1月",
        "1": "2月",
        "2": "行進",
        "3": "4月",
        "4": "五月",
        "5": "じゅん",
        "6": "七月",
        "7": "八月",
        "8": "九月",
        "9": "10月",
        "10": "11月",
        "11": "12月"
    },
    "notifier": {
        "messageSent": "メッセージを送信しました",
        "mailboxDeleted": "フォルダを削除しました"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "新しいフォルダ",
            "success": "作成されたフォルダ"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "新しいフォルダを作成",
            "label": "フォルダ名",
            "accept": "作成する",
            "cancel": "キャンセル"
        },
        "deleteMailbox": {
            "title": "フォルダ「{mailbox}」を削除",
            "desc": "注意。この操作により、フォルダ内のすべてのメッセージが完全に削除されます",
            "accept": "削除する",
            "cancel": "キャンセル"
        }
    },
    "myAccount": {
        "title": "マイアカウント",
        "commonActions": {
            "title": "一般的なアクション",
            "updatePassword": "パスワードを更新する",
            "currentPassword": "現在のパスワード",
            "newPassword": "新しいパスワード",
            "confirmPassword": "新しいパスワードを確認"
        },
        "limits": {
            "gbUsed": "{gb} GB",
            "gbTotal": "{gb} GB",
            "messagesUsed": [
                "{n}メッセージ",
                "{n}メッセージ",
                "{n}メッセージ"
            ],
            "messagesTotal": [
                "{n}件のメッセージ",
                "{n}メッセージ",
                "{n}件のメッセージ"
            ],
            "storage": {
                "title": "ストレージ"
            },
            "imapDownload": {
                "title": "IMAPダウンロード",
                "comment": "毎日"
            },
            "imapUpload": {
                "title": "IMAPアップロード",
                "comment": "毎日"
            },
            "pop3Download": {
                "title": "POP3ダウンロード",
                "comment": "毎日"
            },
            "received": {
                "title": "受け取りました",
                "comment": "分単位で"
            },
            "recipients": {
                "title": "送信しました",
                "comment": "毎日"
            },
            "forwards": {
                "title": "リダイレクト",
                "comment": "毎日"
            }
        }
    },
    "filters": {
        "title": "フィルター",
        "commingSoon": "近日公開"
    }
};
exports.default = locale;
