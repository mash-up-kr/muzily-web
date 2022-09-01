import { useRouter } from "next/router";
import styled from "@emotion/styled";
import { AxiosError } from "axios";
import {
  BottomButton,
  Image,
  Layout,
  Spacer,
  Spinner,
  Toast,
  TopBar,
  TopBarIconButton,
} from "~/components/uis";
import { useModal } from "~/components/uis/Modal";
import { MemberInfo } from "~/contexts";
import { useDeleteRoomMutation, usePostLogoutMutation } from "~/hooks/api";
import type { Room } from "~/types";

const defaultEndPoint = process.env
  .NEXT_PUBLIC_SERVER_DEFAULT_END_POINT as string;

interface RoomSettingScreenProps {
  onClickBackButton: () => void;
  room: Room;
}

function RoomSettingScreen({
  onClickBackButton,
  room,
}: RoomSettingScreenProps) {
  const { close } = useModal();

  const router = useRouter();

  const deleteRoomMutation = useDeleteRoomMutation(room.roomId);
  const postLogout = usePostLogoutMutation();

  const onClickEditComplete = () => {
    close();
  };

  const onClickDeleteRoom = () => {
    const isConfirmed = window.confirm("정말 삭제하시곘습니까?");

    if (!isConfirmed) {
      return;
    }

    deleteRoomMutation.mutate(room.roomId, {
      onSuccess: () => {
        window.alert("방이 삭제되었습니다.");
        Toast.show(<Spacer>방이 삭제되었습니다.</Spacer>, {
          duration: 3000,
        });
        router.replace("/");
      },
      onError: (error: AxiosError) => {
        if (error instanceof AxiosError) {
          Toast.show(<Spacer>error.response?.data.message</Spacer>, {
            duration: 3000,
            status: "error",
          });
        }
        console.error(error);
      },
    });
  };

  const onClickAuthLogout = () => {
    postLogout.mutate(null, {
      onSuccess: () => {
        Toast.show(<Spacer>로그아웃에 성공하였습니다.</Spacer>, {
          duration: 3000,
        });

        localStorage.clear();
        router.push("/");
      },
      onError: (error: AxiosError) => {
        if (error instanceof AxiosError) {
          Toast.show(<Spacer>error.response?.data.message</Spacer>, {
            duration: 3000,
            status: "error",
          });
        }
        console.error(error);
      },
    });
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
        >
          설정
        </TopBar>
        <S.Container>
          <S.Title>
            {room.name}
            <S.IconWrapper>
              <Image
                src={`/images/edit.svg`}
                placeholder={`/images/edit.svg`}
                alt={"icon"}
                width={18}
                height={18}
              />
            </S.IconWrapper>
          </S.Title>
          <S.MoodContainer>
            내 방의 무드
            <S.MoodButtonGroup>
              <span>{room.mood.moodDescription}</span>
              <S.ChangeMoodButton>변경</S.ChangeMoodButton>
            </S.MoodButtonGroup>
          </S.MoodContainer>
          <S.HorizontalLine></S.HorizontalLine>

          <MemberInfo.Only>
            {({ memberInfo, removeMemberInfo }) => {
              return memberInfo.accountConnectType === "CONNECTED" ? (
                <S.TextButton
                  onClick={() => {
                    onClickDeleteRoom();
                    removeMemberInfo();
                    setTimeout(() => {
                      close();
                    }, 100);
                  }}
                >
                  방 삭제
                </S.TextButton>
              ) : (
                <></>
              );
            }}
          </MemberInfo.Only>
          <MemberInfo.Only>
            {({ memberInfo, removeMemberInfo }) => {
              return memberInfo.accountConnectType === "CONNECTED" ? (
                <S.TextButton
                  onClick={() => {
                    onClickAuthLogout();
                    removeMemberInfo();
                    setTimeout(() => {
                      close();
                    }, 100);
                  }}
                >
                  로그아웃
                </S.TextButton>
              ) : (
                <></>
              );
            }}
          </MemberInfo.Only>
        </S.Container>
        <BottomButton label="수정 완료" onClick={onClickEditComplete} />
      </Spacer>
    </Layout>
  );
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    justify-content: leading;
    align-items: leading;
    position: relative;
    height: calc(100% - 104px);
    padding: 45px 0px 20px 20px;
  `,

  Title: styled.div`
    font-size: 27px;
    font-weight: 700;
    line-height: 32px;
  `,

  IconWrapper: styled.button`
    cursor: pointer;
    width: 36px;
    height: 36px;
    background-color: transparent;
    border: none;
    margin-left: 8px;
  `,

  MoodContainer: styled.div`
    margin-top: 40px;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: -0.45px;
    color: rgba(255, 255, 255, 0.75);
  `,

  MoodButtonGroup: styled.button`
    height: 58px;
    width: calc(100% - 20px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 22px;
    border: none;
    background: rgba(64, 73, 83, 0.85);
    color: white;
    font-weight: 700;
    font-size: 16px;
    border-radius: 20px;
    margin-top: 10px;
  `,

  ChangeMoodButton: styled.a`
    border: none;
    background-color: transparent;
    font-weight: 300;
    font-size: 12px;
    line-height: 155%;
    color: white;
    cursor: pointer;
  `,

  HorizontalLine: styled.hr`
    width: 100%;
    margin-top: 22px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  `,

  TextButton: styled.div`
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: -0.45px;
    text-decoration-line: underline;
    color: rgba(255, 255, 255, 0.75);
    margin-top: 20px;
    cursor: pointer;
  `,
};

export default RoomSettingScreen;
