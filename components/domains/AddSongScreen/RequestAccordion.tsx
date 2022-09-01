import React, { useEffect, useState } from "react";
import Image from "next/image";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import { useQueryClient } from "react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import { Image as ComponentImage, Spacer, Spinner } from "~/components/uis";
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
  const [isAccordionOpen, setIsAccordionOpen] = useState(true);
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
    <S.Accordion hidden={!isHost}>
      <S.AccordionButton onClick={() => setIsAccordionOpen(!isAccordionOpen)}>
        <S.AccordionButtonTitle>
          <Image src="/images/music-note.svg" alt="" width={6} height={10.28} />
          <strong>{proposedPlaylist.length}</strong>
          건의 신청된 노래가 있어요
        </S.AccordionButtonTitle>
        <S.AccordionButtonArrow animate={{ rotate: isAccordionOpen ? 180 : 0 }}>
          <Image
            src="/images/caret-up.svg"
            alt={isAccordionOpen ? "목록 닫기" : "목록 열기"}
            width={18}
            height={18}
          />
        </S.AccordionButtonArrow>
      </S.AccordionButton>
      <motion.div
        animate={{
          overflowY: "scroll",
          opacity: isAccordionOpen ? 1 : 0,
          height: isAccordionOpen ? "250px" : 0,
        }}
      >
        <S.AccordionPanel>
          {proposedPlaylist.map((item, idx) => (
            <S.AccordionItem key={idx}>
              <Spacer gap={14} align="center">
                <ComponentImage
                  src={item.thumbnail}
                  alt={item.title}
                  width={64}
                  height={64}
                  lazy
                  mode="cover"
                  placeholder="/images/play.svg"
                  style={{ borderRadius: 4 }}
                />
                <Spacer type="vertical" style={{ textAlign: "left" }}>
                  <S.RequestTitle>{item.title}</S.RequestTitle>
                  <S.RequestDate>
                    {getDurationText(item.duration || 0)}
                  </S.RequestDate>
                </Spacer>
              </Spacer>
              <Spacer gap={8} align="center" style={{ flexShrink: 0 }}>
                <S.Button
                  color="#007aff"
                  onClick={() => handleAcceptPlaylist(item)}
                >
                  <Image
                    src="/images/accept.svg"
                    alt="신청곡 승인"
                    width={15}
                    height={12}
                  />
                </S.Button>
                <S.Button
                  color=" #2C2C2C"
                  onClick={() => handleDeclinePlaylist(item)}
                >
                  <Image
                    src="/images/decline.svg"
                    alt="신청곡 거절"
                    width={12}
                    height={12}
                  />
                </S.Button>
              </Spacer>
            </S.AccordionItem>
          ))}
        </S.AccordionPanel>
      </motion.div>
      {isLoading && <Spinner.FullPage />}
    </S.Accordion>
  );
}

const S = {
  Accordion: styled.div<{ hidden: boolean }>`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    display: ${(p) => (p.hidden ? "none" : "")};
    padding: 0 20px;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    background: #000;
  `,
  AccordionButton: styled.button`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 20px 0;
    color: #fff;
    background-color: transparent;
    border: none;
  `,
  AccordionButtonTitle: styled.h4`
    font-size: 14px;
    font-weight: 400;
    & > strong {
      margin-left: 12px;
      font-weight: 800;
    }
  `,
  AccordionButtonArrow: styled(motion.div)`
    width: 18px;
    height: 18px;
  `,
  AccordionPanel: styled(motion.div)`
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  `,
  AccordionItem: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
  `,
  RequestTitle: styled.h5`
    line-clamp: 2;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
    font-weight: 500;
    font-size: 14px;
    line-height: 155%;
    color: #fff;
  `,
  RequestDate: styled.span`
    font-weight: 400;
    font-size: 14px;
    line-height: 155%;
    color: #8c8c8c;
  `,
  Button: styled.button<{ color: string }>`
    cursor: pointer;
    border: none;
    padding: 10px 12px 8px;
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
