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
          overflowY: "hidden",
          opacity: isAccordionOpen ? 1 : 0,
          height: isAccordionOpen ? undefined : 0,
        }}
      >
        <S.AccordionPanel>
          {proposedPlaylist.map((item, idx) => (
            <S.AccordionItem key={idx}>
              <Spacer gap={14}>
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
                <Spacer type="vertical">
                  <S.RequestTitle>{item.title}</S.RequestTitle>
                  <S.RequestDate>
                    {getDurationText(item.duration || 0)}
                  </S.RequestDate>
                </Spacer>
              </Spacer>
              <Spacer gap={8} align="center">
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
  ProposedMusicListCard: styled.div<{ hidden: boolean }>`
    display: ${(p) => (p.hidden ? "none" : "")};
    position: fixed;
    bottom: 64px;
    left: 0;
    width: 100%;
    margin: 20px 0%;
    background: rgba(26, 26, 26, 0.9);
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
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

  Accordion: styled.div<{ hidden: boolean }>`
    position: fixed;
    bottom: 64px;
    left: 0;
    width: 100%;
    display: ${(p) => (p.hidden ? "none" : "")};
    padding: 0 20px;
    border-top-right-radius: 20px;
    border-top-left-radius: 20px;
    background: #000;
  `,

  // Accordion: styled.div`
  //   bottom: 20px;
  //   display: block;
  //   padding: 0 20px;
  //   border-radius: 20px;
  //   background-color: #1a1a1a;
  // `,
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
    padding-bottom: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  `,
  AccordionItem: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 16px;
  `,
  RequestTitle: styled.h5`
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
  RequestButton: styled.button<{ isConfirmed: boolean }>`
    padding: 9px 16px;
    font-size: 12px;
    font-weight: 600;
    color: #fff;
    background-color: ${(props) => (props.isConfirmed ? "#007aff" : "#F54031")};
    border: none;
    border-radius: 6px;
    cursor: pointer;
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
