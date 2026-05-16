import { TicketIcon as TicketIconName } from "../../types/ticket";
import {
  BusIcon,
  EntertainmentIcon,
  FerryIcon,
  HighSpeedRailIcon,
  MetroIcon,
  OtherIcon,
  TrainIcon
} from "./index";
import { IconProps } from "./iconBase";

export const TICKET_ICONS: { value: TicketIconName; label: string; Component: (p: IconProps) => JSX.Element }[] = [
  { value: "Bus", label: "Bus", Component: BusIcon },
  { value: "Train", label: "Train", Component: TrainIcon },
  { value: "Metro", label: "Metro", Component: MetroIcon },
  { value: "HighSpeedRail", label: "High-speed", Component: HighSpeedRailIcon },
  { value: "Ferry", label: "Ferry", Component: FerryIcon },
  { value: "Entertainment", label: "Event", Component: EntertainmentIcon },
  { value: "Other", label: "Other", Component: OtherIcon }
];

export function getTicketIcon(name: TicketIconName) {
  return TICKET_ICONS.find((i) => i.value === name)?.Component ?? OtherIcon;
}
