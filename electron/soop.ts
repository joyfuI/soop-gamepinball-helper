import type { IpcMainInvokeEvent } from 'electron';
import type { SoopChat } from 'soop-extension';
import { SoopChatEvent, SoopClient } from 'soop-extension';

let soopChat: SoopChat | null;

export const handlePlaySoopChat = async (
  event: IpcMainInvokeEvent,
  streamerId: string,
) => {
  console.log('call playSoopChat', streamerId);
  try {
    const client = new SoopClient();
    soopChat = client.chat({ streamerId });

    // 별풍선 데이터
    soopChat.on(SoopChatEvent.TEXT_DONATION, (response) => {
      console.log(
        `[${response.receivedTime}] ${response.fromUsername}(${response.from}) donated ${response.amount} to ${response.to}`,
      );
      event.sender.send('donationResponse', response);
    });

    // 애드벌룬 데이터
    soopChat.on(SoopChatEvent.AD_BALLOON_DONATION, (response) => {
      console.log(
        `[${response.receivedTime}] ${response.fromUsername}(${response.from}) donated ${response.amount} to ${response.to}`,
      );
      event.sender.send('donationResponse', response);
    });

    // 채팅 데이터
    soopChat.on(SoopChatEvent.CHAT, (response) => {
      console.log(
        `[${response.receivedTime}] ${response.username}(${response.userId}): ${response.comment}`,
      );
      event.sender.send('chatResponse', response);
    });

    // 연결 종료
    soopChat.on(SoopChatEvent.DISCONNECT, (response) => {
      // 연결이 끊기면 재연결
      console.log(
        `[${response.receivedTime}] ${response.streamerId}'s stream has ended`,
      );
      soopChat?.connect();
    });

    // Connect to chat
    await soopChat.connect();
    return true;
  } catch {
    console.log('error soopChat');
    soopChat = null;
    return false;
  }
};

export const handleStopSoopChat = () => {
  console.log('call stopSoopChat');
  const tmpSoopChat = soopChat;
  soopChat = null;
  tmpSoopChat?.disconnect();
};
