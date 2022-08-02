import styled from "@emotion/styled";

export const TopBarRightItem = styled.div`
  color: #007aff;
  font-weight: 700;
  font-size: 17px;
  font-height: 155%;
  letter-spacing: -0.478073px;

  display: flex;
  align-items: center;
`;

export const InviteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 60px;
  gap: 6px;
`;

export const Form = styled.form`
  width: 100%;
  max-width: 100vw;
  min-height: 100vh;
  height: 100vh;
  min-height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: space-between;
  padding-top: 48px;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
`;

export const RoomTextContainer = styled.div`
  width: 100%;
  height: 45px;
  padding: 4px 8px;
  background-color: #333;
  border-radius: 7px;
`;

export const RoomInputText = styled.input`
  width: 100%;
  height: 100%;
  background-color: #333;
  border: none;
  color: white;
  font-size: 26px;
`;

export const Spacer = styled.div`
  width: 100%;
  height: 2px;
`;

export const Header = styled.div`
  font: "Apple SD Gothic Neo";
  font-weight: 700;
  font-size: 26px;
  color: white;
  text-align: center;
  line-height: 43.2px;
`;

export const CreateRoomButton = styled.button`
  margin-top: 58px;
  width: 149px;
  height: 51px;
  background-color: #007aff;
  border-radius: 15px;
  color: white;
  font-weight: 700;
  font-size: 20px;
  line-height: 23.87px;
  letter-spacing: -0.45px;
  text-align: center;
  border: none;
  cursor: pointer;
`;

export const Descripion = styled.span`
  margin-top: 18px;
  font-size: 14px;
  line-height: 22.4px;
  color: #d9d9d9;
  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
`;
