"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const locale = {
    "mailbox": {
        "title": {
            "inbox": "받은 편지함",
            "sent": "보냄",
            "drafts": "체커",
            "trash": "폐물",
            "junk": "스팸"
        },
        "delete": "폴더 삭제",
        "empty": "이 편지함이 비어 있습니다"
    },
    "message": {
        "labels": {
            "from": "에서:",
            "to": "에:",
            "date": "보냄 :"
        }
    },
    "mailboxMessage": {
        "to": "에:"
    },
    "login": {
        "title": "로그인",
        "action": "로그인",
        "labels": {
            "username": "사용자 이름",
            "password": "암호"
        }
    },
    "accountButton": {
        "logout": "로그 아웃",
        "myAccount": "내 계정",
        "filters": "필터"
    },
    "compose": {
        "labels": {
            "to": "에:",
            "subject": "제목:",
            "cc": "참조 :",
            "bcc": "숨은 참조 :"
        },
        "tabs": {
            "newMessageTitle": "새로운 메시지"
        }
    },
    "editor": {
        "cmd": {
            "undo": "실행 취소",
            "redo": "다시 하다",
            "fontName": "폰트 타입",
            "fontSize": "폰트 사이즈",
            "bold": "굵게",
            "italic": "이탤릭체",
            "underline": "밑줄",
            "justifyLeft": "왼쪽 정렬",
            "justifyCenter": "가운데 정렬",
            "justifyRight": "오른쪽 정렬",
            "insertUnorderedList": "명부",
            "insertOrderedList": "번호 매기기 목록",
            "removeFormat": "형식 제거"
        },
        "color": {
            "tooltip": "색깔",
            "foreColor": "본문",
            "backColor": "배경"
        },
        "upload": {
            "tooltip": "붙이다",
            "add": "더하다",
            "remove": "없애다"
        },
        "send": "보내다"
    },
    "selection": {
        "title": [
            "{n} 메시지",
            "{n} 메시지",
            "{n} 메시지"
        ]
    },
    "actions": {
        "backToMailbox": "사서함으로 돌아 가기",
        "reload": "새롭게 하다",
        "select": "고르다",
        "markAsUnread": "읽지 않은 것으로 표시",
        "markAsRead": "읽은 상태로 표시",
        "moveTo": "로 이동",
        "delete": "지우다",
        "deletePermanently": "영구적으로 삭제",
        "discardDrafts": "초안 삭제",
        "markAsSpam": "스팸으로 표시",
        "unMarkAsSpam": "스팸이 아닙니다",
        "forward": "앞으로",
        "reply": "댓글",
        "attachments": "첨부"
    },
    "weekDays": {
        "0": "일요일",
        "1": "월요일",
        "2": "화요일",
        "3": "수요일",
        "4": "목요일",
        "5": "금요일",
        "6": "토요일"
    },
    "months": {
        "0": "일월",
        "1": "이월",
        "2": "행진",
        "3": "4 월",
        "4": "할 수있다",
        "5": "준",
        "6": "칠월",
        "7": "팔월",
        "8": "구월",
        "9": "십월",
        "10": "십일월",
        "11": "12 월"
    },
    "notifier": {
        "messageSent": "메시지 전송 됨",
        "mailboxDeleted": "폴더가 삭제되었습니다"
    },
    "drawerActions": {
        "createMailbox": {
            "label": "새 폴더",
            "success": "폴더 생성"
        }
    },
    "dialogs": {
        "createMailbox": {
            "title": "새 폴더 만들기",
            "label": "폴더 이름",
            "accept": "창조하다",
            "cancel": "취소"
        },
        "deleteMailbox": {
            "title": "\"{mailbox}\"폴더 삭제",
            "desc": "주의. 이 작업은 폴더의 모든 메시지를 영구적으로 삭제합니다.",
            "accept": "지우다",
            "cancel": "취소"
        }
    },
    "myAccount": {
        "title": "내 계정",
        "commonActions": {
            "title": "일반적인 행동",
            "updatePassword": "비밀번호 업데이트",
            "currentPassword": "현재 비밀번호",
            "newPassword": "새 비밀번호",
            "confirmPassword": "새 암호를 확인합니다"
        },
        "limits": {
            "gbUsed": "{gb} GB",
            "gbTotal": "{gb} GB",
            "messagesUsed": [
                "{n} 메시지",
                "{n} 메시지",
                "{n} 메시지"
            ],
            "messagesTotal": [
                "{n} 메시지 중",
                "{n} 메시지 중",
                "{n} 메시지 중"
            ],
            "storage": {
                "title": "저장"
            },
            "imapDownload": {
                "title": "IMAP 다운로드",
                "comment": "매일"
            },
            "imapUpload": {
                "title": "IMAP 업로드",
                "comment": "매일"
            },
            "pop3Download": {
                "title": "POP3 다운로드",
                "comment": "매일"
            },
            "received": {
                "title": "받았습니다",
                "comment": "분 단위"
            },
            "recipients": {
                "title": "보냄",
                "comment": "매일"
            },
            "forwards": {
                "title": "리디렉션",
                "comment": "매일"
            }
        }
    },
    "filters": {
        "title": "필터",
        "commingSoon": "출시 예정"
    }
};
exports.default = locale;
