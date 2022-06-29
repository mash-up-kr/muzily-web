import { render } from "@testing-library/react";
import RoomQRPage from "~/pages/rooms/[roomId]/qr";

describe("RoomQRPage", () => {
  it("QR 코드 주변에 인식을 위해 흰 배경이 있습니다.", () => {
    const { getByTestId } = render(<RoomQRPage />);
    expect(getByTestId("QRCodeContainer")).toHaveStyle(`background: white;`);
  });

  it("QR 코드가 화면상에 나타납니다.", () => {
    const { getByTestId } = render(<RoomQRPage />);
    expect(getByTestId("QRCode")).toBeInTheDocument();
  });
});
