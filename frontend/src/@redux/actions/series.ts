import {
  SERIES_UPDATE_LIST,
  SERIES_UPDATE_WANTED_LIST,
  SERIES_UPDATE_EPISODE_LIST,
  SERIES_UPDATE_HISTORY_LIST,
  SERIES_UPDATE_INFO,
  SERIES_UPDATE_BLACKLIST,
} from "../constants";

import { SeriesApi, EpisodesApi, HistoryApi } from "../../apis";
import { createAsyncAction, createCombineAction } from "./utils";

import { updateBadges, badgeUpdateSeries } from "./badges";

export const seriesUpdateList = createAsyncAction(SERIES_UPDATE_LIST, () =>
  SeriesApi.series()
);

export const seriesUpdateWantedList = createAsyncAction(
  SERIES_UPDATE_WANTED_LIST,
  () => SeriesApi.wanted()
);

export const seriesUpdateWantedAll = createCombineAction(() => [
  seriesUpdateWantedList(),
  badgeUpdateSeries(),
]);

export const episodeUpdateInfo = createAsyncAction(
  SERIES_UPDATE_EPISODE_LIST,
  (id: number) => EpisodesApi.all(id)
);

export const seriesUpdateHistoryList = createAsyncAction(
  SERIES_UPDATE_HISTORY_LIST,
  () => HistoryApi.series()
);

export const seriesUpdateInfo = createAsyncAction(
  SERIES_UPDATE_INFO,
  (id: number) => SeriesApi.series(id)
);

export const seriesUpdateInfoAll = createCombineAction((id: number) => [
  seriesUpdateInfo(id),
  episodeUpdateInfo(id),
  updateBadges(),
]);

export const seriesUpdateBlacklist = createAsyncAction(
  SERIES_UPDATE_BLACKLIST,
  () => SeriesApi.blacklist()
);
