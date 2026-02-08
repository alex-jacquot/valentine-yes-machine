import type { FC } from "react";
import { Screen0 } from "./Screen0";
import { Screen1 } from "./Screen1";
import { Screen2 } from "./Screen2";
import { Screen3 } from "./Screen3";
import { Screen4 } from "./Screen4";
import { Screen5 } from "./Screen5";
import { Screen6 } from "./Screen6";
import { Screen7 } from "./Screen7";
import { Screen8 } from "./Screen8";
import { Screen9 } from "./Screen9";
import { Screen10 } from "./Screen10";
import { Screen11 } from "./Screen11";
import { Screen12 } from "./Screen12";
import { Screen13 } from "./Screen13";
import { Screen14 } from "./Screen14";
import { Screen15 } from "./Screen15";
import { Screen16 } from "./Screen16";
import { Screen17 } from "./Screen17";
import { Screen18 } from "./Screen18";

export type GameScreenProps = {
  onYes: () => void;
  onNo: () => void;
};

export type GameScreenComponent = FC<GameScreenProps>;

export const GAME_SCREENS: GameScreenComponent[] = [
  Screen0,
  Screen1,
  Screen2,
  Screen3,
  Screen4,
  Screen5,
  Screen6,
  Screen7,
  Screen8,
  Screen9,
  Screen10,
  Screen11,
  Screen12,
  Screen13,
  Screen14,
  Screen15,
  Screen16,
  Screen17,
  
];

