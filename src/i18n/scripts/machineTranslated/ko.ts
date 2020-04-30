import {Locale} from "../../types";
 
const locale: Locale = {
  "mailbox": {
    "title": {
      "inbox": "받은 편지함",
      "sent": "보냄",
      "drafts": "체커",
      "trash": "폐물",
      "junk": "스팸"
    },
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
    "logout": "로그 아웃"
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
    "reload": "새로 고침",
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
  }
};

export default locale;