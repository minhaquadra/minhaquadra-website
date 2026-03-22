import React from "react";
import { GiTennisRacket, GiVolleyballBall, GiSoccerBall, GiTennisBall } from "react-icons/gi";
import {
  MdSportsTennis,
  MdSportsSoccer,
  MdSportsBasketball,
  MdSportsVolleyball,
} from "react-icons/md";
import { FaTableTennisPaddleBall, FaVolleyball } from "react-icons/fa6";

const icons: Record<string, React.ElementType> = {
  "beach-tennis": GiTennisRacket,
  "tenis": MdSportsTennis,
  "padel": FaTableTennisPaddleBall,
  "pickleball": GiTennisBall,
  "volei": MdSportsVolleyball,
  "volei-de-praia": FaVolleyball,
  "futevolei": GiVolleyballBall,
  "futsal": MdSportsSoccer,
  "futebol-society": GiSoccerBall,
  "basquete": MdSportsBasketball,
};

interface Props {
  slug: string;
  size?: number;
}

export default function SportIcon({ slug, size = 28 }: Props) {
  const Icon = icons[slug] || MdSportsSoccer;
  return <Icon size={size} />;
}
