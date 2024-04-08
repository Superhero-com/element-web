import { Room, RoomEvent } from "matrix-js-sdk/src/matrix";
import { _t } from "matrix-react-sdk/src/languageHandler";
import { IOOBData } from "matrix-react-sdk/src/stores/ThreepidInviteStore";
import { useEffect, useState } from "react";
import { useTypedEventEmitter } from "matrix-react-sdk/src/hooks/useEventEmitter";

export const getRoomName = (room?: Room, oobName = ""): string => getSafeRoomName(room?.name || oobName);

export function getSafeRoomName(roomName?: string): string {
    return roomName?.replace(/^(\s|\[TG\])*/, "").replace(/^(\s|\$)*/, "") || "";
}
/**
 * Determines the room name from a combination of the room model and potential
 * out-of-band information
 * @param room - The room model
 * @param oobData - out-of-band information about the room
 * @returns {string} the room name
 */
export function useRoomName(room?: Room, oobData?: IOOBData): string {
    let oobName = _t("common|unnamed_room");
    if (oobData && oobData.name) {
        oobName = oobData.name;
    }

    const [name, setName] = useState<string>(getRoomName(room, oobName));

    useTypedEventEmitter(room, RoomEvent.Name, () => {
        setName(getRoomName(room, oobName));
    });

    useEffect(() => {
        setName(getRoomName(room, oobName));
    }, [room, oobName]);

    return name;
}
