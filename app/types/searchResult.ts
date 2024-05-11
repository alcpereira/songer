export type ImageObject = {
  height: number;
  url: string;
  width: number;
};

type SimplifiedArtistObject = {
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
};

type ArtistObject = SimplifiedArtistObject & {
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  images: ImageObject[];
  popularity: number;
};

export type SearchResult = {
  album: {
    album_type: string;
    total_tracks: number;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions?: {
      reason: string;
    };
    type: string;
    uri: string;
    artists: SimplifiedArtistObject[];
  };
  artists: ArtistObject[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc: string;
    ean: string;
    upc: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  name: string;
  is_playable: boolean;
  linked_from: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  restrictions?: {
    reason: string;
  };
  popularity: number;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
};

export type SpotifySearchResult = {
  tracks: {
    href: string;
    items: SearchResult[];
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
  };
};

export type UpdatedSpotifySearchResult = (SearchResult & {
  alreadyPicked: boolean;
})[];
