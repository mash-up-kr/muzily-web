import { useMemo } from "react";
import { createPortal } from "react-dom";

type Props = {
  id: string;
  children: React.ReactNode;
};

const Portal = ({ id, children }: Props) => {
  const portal = useMemo<HTMLElement>(() => {
    const portalEl = document.getElementById(id);

    if (portalEl) {
      return portalEl;
    }

    const newPortalEl = document.createElement("div");
    newPortalEl.id = id;
    newPortalEl.style.left = "0";
    newPortalEl.style.right = "0";
    newPortalEl.style.top = "0";
    newPortalEl.style.bottom = "0";
    newPortalEl.style.zIndex = "9999";
    newPortalEl.style.position = "fixed";
    newPortalEl.style.display = "flex";
    newPortalEl.style.flexDirection = "column";
    newPortalEl.style.justifyContent = "center";
    newPortalEl.style.alignItems = "center";

    document.body.appendChild(newPortalEl);

    return newPortalEl;
  }, [id]);

  return createPortal(children, portal);
};

export default Portal;
