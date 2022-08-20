import { useQuery } from "react-query";
import { getPlaylist } from "~/api/playlist";
import { getRoomDetail } from "~/api/room";

export const useRoomDetail = (roomId: number) => {
  return useQuery(
    ["rooms"],
    async () => {
      const roomData = await getRoomDetail(roomId);
      const playlist = await getPlaylist(roomData.playlistId);

      return { ...roomData, playlist };
    },
    {
      onSuccess: () => {
        console.log("success");
      },
    }
  );
};
