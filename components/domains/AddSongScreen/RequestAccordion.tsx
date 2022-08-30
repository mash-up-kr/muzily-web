import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useQueryClient } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import { Spacer, Spinner } from "~/components/uis";
import { queryKeys } from "~/consts/react-query";
import { useGetPlaylistPendingItems } from "~/hooks/api";
import {
  useAcceptPlaylistItemRequest,
  useDeclinePlaylistItemRequest,
} from "~/hooks/webSocket";
import { proposedPlaylistAtomState } from "~/store/playlist";
import {
  isHostAtomState,
  playlistIdAtomState,
  roomIdAtomState,
} from "~/store/room";
import { getDurationText } from "~/store/room/utils";
import type { PlaylistItem } from "~/types";

function RequestAccordion() {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  const [proposedPlaylist, setProposedPlaylist] = useRecoilState(
    proposedPlaylistAtomState
  );
  const roomId = useRecoilValue(roomIdAtomState);
  const playlistId = useRecoilValue(playlistIdAtomState);
  const isHost = useRecoilValue(isHostAtomState);

  const { data } = useGetPlaylistPendingItems(playlistId, isHost);
  const { publish: publishAcceptPlaylistItemRequest } =
    useAcceptPlaylistItemRequest(roomId);
  const { publish: publishDecinePlaylistItemRequest } =
    useDeclinePlaylistItemRequest(roomId);

  useEffect(() => {
    if (data !== undefined) {
      setProposedPlaylist(data);
    }
  }, [data, setProposedPlaylist]);

  const handleAcceptPlaylist = async (item: PlaylistItem) => {
    setIsLoading(true);
    await publishAcceptPlaylistItemRequest({
      playlistId: item.playlistId,
      playlistItemId: item.playlistItemId,
    });
    await setProposedPlaylist(
      proposedPlaylist.filter(
        (listItem) => listItem.playlistItemId !== item.playlistItemId
      )
    );
    await queryClient.invalidateQueries(queryKeys.pendingPlaylist(playlistId));
    setIsLoading(false);
  };

  const handleDeclinePlaylist = async (item: PlaylistItem) => {
    setIsLoading(true);
    await publishDecinePlaylistItemRequest({
      playlistId: item.playlistId,
      playlistItemId: item.playlistItemId,
    });
    await queryClient.invalidateQueries(queryKeys.pendingPlaylist(playlistId));
    setIsLoading(false);
  };

  if (proposedPlaylist.length === 0) {
    return <></>;
  }

  return (
    <S.ProposedMusicListCard hidden={!isHost}>
      <S.CardHeader>
        <strong>{proposedPlaylist.length}건</strong>의 신청된 노래가 있어요
      </S.CardHeader>
      <S.CardContent>
        {proposedPlaylist.map((item, idx) => (
          <S.CardItem key={`${idx}-${item.videoId}`}>
            <Spacer type="vertical" style={{ marginRight: 12 }}>
              <S.MusicTitle>{item.title}</S.MusicTitle>
              <S.MusicArtist>
                {getDurationText(item.duration || 0)}
              </S.MusicArtist>
            </Spacer>
            <Spacer gap={8} align="center">
              <S.Button
                color="#007aff"
                onClick={() => handleAcceptPlaylist(item)}
              >
                추가
              </S.Button>
              <S.Button
                color=" #F54031"
                onClick={() => handleDeclinePlaylist(item)}
              >
                거절
              </S.Button>
            </Spacer>
          </S.CardItem>
        ))}
      </S.CardContent>
      {isLoading && <Spinner.FullPage />}
    </S.ProposedMusicListCard>
  );
}

const S = {
  ProposedMusicListCard: styled.div<{ hidden: boolean }>`
    display: ${(p) => (p.hidden ? "none" : "")};
    margin: 20px 0%;
    background: rgba(26, 26, 26, 0.9);
    border-radius: 20px;
    padding: 20px;
  `,

  CardHeader: styled.div`
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 20px;

    font-size: 14px;
    line-height: 17px;
    /* identical to box height */

    letter-spacing: -0.452636px;

    & > strong {
      font-weight: 800;
    }
  `,

  CardContent: styled.ul`
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  `,
  CardItem: styled.li`
    display: flex;
    justify-content: space-between;
  `,

  MusicTitle: styled.div`
    color: white;
    font-weight: 600;
    font-size: 12px;
    line-height: 155%;
    line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  `,
  MusicArtist: styled.div`
    font-weight: 300;
    font-size: 12px;
    line-height: 155%;
    letter-spacing: -0.405328px;

    color: #959595;
  `,

  Button: styled.button<{ color: string }>`
    cursor: pointer;
    border: none;
    padding: 9px 16px;
    background: ${(p) => p.color};
    border-radius: 6px;
    font-weight: 600;
    font-size: 12px;
    line-height: 14px;
    letter-spacing: -0.306564px;
    color: #fff;
    white-space: nowrap;
  `,
};

export default RequestAccordion;
