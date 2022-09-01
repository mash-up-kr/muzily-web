import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import axios from "axios";
import YouTube from "react-youtube";
import { useRecoilValue } from "recoil";
import {
  BottomButton,
  Layout,
  Spacer,
  Spinner,
  Toast,
  TopBar,
  TopBarIconButton,
} from "~/components/uis";
import Modal, { useModal } from "~/components/uis/Modal";
import {
  useAddPlaylistItemRequest,
  useSendPlaylistItemRequest,
} from "~/hooks/webSocket";
import {
  isHostAtomState,
  playlistIdAtomState,
  roomIdAtomState,
} from "~/store/room";
import { convertDurationToSecond } from "~/store/room/utils";
import AddSongGuideScreen from "../AddSongGuideScreen";
import RequestAccordion from "./RequestAccordion";

const defaultEndPoint = process.env
  .NEXT_PUBLIC_SERVER_DEFAULT_END_POINT as string;

interface AddSongScreenProps {
  onClickBackButton: () => void;
}

/**
   1. 복붙한 링크가 유튜브링크가 맞는지 체크
     1-1. 유튜브 링크가 맞을경우, id값을 뽑아낸다
     1-2. 유튜브 링크가 아닐경우, 에러메세지 + 빈값
  
   2. 아이디를 유튜브 영상 컴포넌트로 전달한다
     2-1. 하단 버튼 활성화
     2-2. 유효한 아이디 아닐경우 에러 처리
  */

function AddSongScreen({ onClickBackButton }: AddSongScreenProps) {
  const { close } = useModal();
  const [youtubeLink, setYoutubeLink] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const roomId = useRecoilValue(roomIdAtomState);
  const playlistId = useRecoilValue(playlistIdAtomState);
  const isHost = useRecoilValue(isHostAtomState);

  const { publish: publishAddPlaylist } = useAddPlaylistItemRequest(roomId);
  const { publish: publishSendPlaylistRequest } =
    useSendPlaylistItemRequest(roomId);

  useEffect(() => {
    setIsValid(false);
    if (!youtubeLink) {
      return setYoutubeId("");
    }

    const id = parseYoutubeIdFromLink(youtubeLink);
    setYoutubeId(id);
  }, [youtubeLink]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${defaultEndPoint}/search/v1/youtube/video?videoId=${youtubeId}`
      );

      const thumbnailRes = await axios.get("/api/thumbnail", {
        params: {
          url: res.data.snippet.thumbnails.high.url,
        },
      });

      const playlistItem = {
        playlistId,
        videoId: res.data.id,
        title: res.data.snippet.title,
        duration: convertDurationToSecond(res.data.contentDetails.duration),
        thumbnail: res.data.snippet.thumbnails.high.url,
        dominantColor: thumbnailRes.data.colors[0],
      };

      if (isHost) {
        await publishAddPlaylist(playlistItem);
        Toast.show(<Spacer>곡이 성공적으로 추가되었습니다</Spacer>, {
          duration: 3000,
        });
      } else {
        await publishSendPlaylistRequest(playlistItem);
        Toast.show(<Spacer>곡이 성공적으로 신청되었습니다</Spacer>, {
          duration: 3000,
        });
      }

      setIsLoading(false);
      close();
    } catch (error: any) {
      alert(error.response.data.message);

      setIsLoading(false);
    }
  };

  return (
    <Layout screenColor="rgba(0, 0, 0, 0.85)">
      <Spacer type="vertical" style={{ height: "100%", overflowY: "auto" }}>
        <TopBar
          sticky
          leftIconButton={
            <TopBarIconButton
              iconName="arrow-left"
              onClick={onClickBackButton}
            />
          }
          rightIconButton={<QuestionButton />}
        />
        <Spacer
          type="vertical"
          style={{ position: "relative", flex: 1, padding: "0 16px" }}
        >
          {/* <button onClick={props.onClickBackButton}>뒤로가기</button> */}
          <S.HeadingText>
            {`추가하고 싶은 곡의\n유튜브 링크를 입력해주세요!`}
          </S.HeadingText>

          <S.Input
            type="url"
            placeholder="유튜브 링크 입력해주세요"
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />

          {youtubeId && (
            <S.YoutubeWrapper>
              <YouTube
                videoId={youtubeId}
                opts={{
                  width: "100%",
                  height: 185,
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    mute: 1,
                  },
                }}
                onError={() => {
                  setIsError(true);
                }}
                onReady={(e) => {
                  const videoId = e.target.getVideoData().video_id;
                  if (videoId) {
                    setIsValid(true);
                  }
                }}
              />
            </S.YoutubeWrapper>
          )}
          <RequestAccordion />
        </Spacer>

        <BottomButton
          label={isHost ? "곡 추가하기" : "곡 신청하기"}
          onClick={handleSubmit}
          disabled={!isValid}
        />
      </Spacer>
      {isLoading && <Spinner.FullPage />}
    </Layout>
  );
}
const QuestionButton = () => (
  <Modal
    trigger={({ open }) => (
      <TopBarIconButton iconName="circle-question" onClick={open} />
    )}
    modal={({ close }) => <AddSongGuideScreen onClickBackButton={close} />}
  />
);

const DOMAINS = ["www.youtube.com", "youtu.be", "music.youtube.com"];

function parseYoutubeIdFromLink(link: string) {
  try {
    const { hostname, pathname, search } = new URL(link);
    const isValid = DOMAINS.some((domain) => hostname === domain);

    if (!isValid) {
      throw new Error();
    }

    if (pathname === "/watch") {
      return search.split("&")[0].split("?v=")[1];
    }

    return pathname.slice(1);
  } catch (error) {
    return "";
  }
}

const S = {
  HeadingText: styled.h3`
    font-weight: 600;
    font-size: 24px;
    line-height: 145%;
    letter-spacing: -0.253163px;
    color: #ffffff;

    margin: 20px 0 0;
    white-space: pre-wrap;
  `,

  Input: styled.input`
    font-size: 14px;
    margin-top: 24px;
    width: 100%;
    height: 49px;
    border-radius: 8px;
    padding: 0 24px;
    border: none;
    z-index: 2;
    :focus {
      outline: 0;
    }
  `,

  YoutubeWrapper: styled.div`
    margin-top: 20px;
    position: relative;
    aspect-ratio: 16 / 9;
    background-color: black;
    iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      clip-path: inset(0% 0% 0% 0% round 8px);
    }
  `,
};

export default AddSongScreen;
