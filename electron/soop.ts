import type { IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import type { SoopChat } from 'soop-extension';
import { SoopChatEvent, SoopClient } from 'soop-extension';

const soopChatMap = new Map<string, SoopChat>();

export const handlePlaySoopChat = async (
  event: IpcMainInvokeEvent,
  key: string,
  streamerId: string,
) => {
  console.log('call playSoopChat', key, streamerId);
  try {
    const client = new SoopClient();
    const soopChat = client.chat({ streamerId });
    soopChatMap.set(key, soopChat);

    // 별풍선 데이터
    soopChat.on(SoopChatEvent.TEXT_DONATION, (response) => {
      console.log(
        `[${response.receivedTime}] ${response.fromUsername}(${response.from}) donated ${response.amount} to ${response.to}`,
      );
      event.sender.send('donationResponse', key, response);
    });

    // 애드벌룬 데이터
    soopChat.on(SoopChatEvent.AD_BALLOON_DONATION, (response) => {
      console.log(
        `[${response.receivedTime}] ${response.fromUsername}(${response.from}) donated ${response.amount} to ${response.to}`,
      );
      event.sender.send('donationResponse', key, response);
    });

    // 채팅 데이터
    soopChat.on(SoopChatEvent.CHAT, (response) => {
      console.log(
        `[${response.receivedTime}] ${response.username}(${response.userId}): ${response.comment}`,
      );
      event.sender.send('chatResponse', key, response);
    });

    // 연결 종료
    soopChat.on(SoopChatEvent.DISCONNECT, (response) => {
      // 연결이 끊기면 재연결
      console.log(
        `[${response.receivedTime}] ${response.streamerId}'s stream has ended`,
      );
      soopChatMap.get(key)?.connect();
    });

    // Connect to chat
    await soopChat.connect();
    return true;
  } catch {
    console.log('error soopChat');
    soopChatMap.delete(key);
    return false;
  }
};

export const handleStopSoopChat = (_event: IpcMainEvent, key: string) => {
  console.log('call stopSoopChat', key);
  const soopChat = soopChatMap.get(key);
  soopChatMap.delete(key);
  soopChat?.disconnect();
};
