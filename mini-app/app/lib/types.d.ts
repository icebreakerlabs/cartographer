/* eslint-disable @typescript-eslint/no-explicit-any */

export type AttestationSchema = {
  schemaID: string;
  name: string;
  isOpen: boolean;
  allowRecursion: boolean;
  requiredSchemaName?: string;
};

export type CastData = {
  hash?: string;
  threadHash?: string;
  parentSource?: {
    type?: string;
    url?: string;
  };
  author?: {
    fid?: number;
    username?: string;
    displayName?: string;
    pfp?: {
      url?: string;
    };
    profile?: {
      bio?: {
        text?: string;
      };
    };
    followerCount?: number;
    followingCount?: number;
  };
  text?: string;
  timestamp?: number;
  embeds?: {
    images?: {
      type: string;
      url: string;
      sourceUrl: string;
      alt: string;
    }[];
    urls?: {
      type: string;
      openGraph?: {
        url?: string;
        sourceUrl?: string;
        title?: string;
        description?: string;
        domain?: string;
        image?: string;
      };
    }[];
  };
  reactions?: {
    count?: number;
  };
  recasts?: {
    count?: number;
  };
  replies?: {
    count?: number;
  };
  tags?: {
    type?: string;
    id?: string;
    name?: string;
    imageUrl?: string;
  }[];
};

export type FeedResponse = {
  casts: {
    hash: string;
    parent_hash: string;
    parent_url: string;
    root_parent_url: string;
    parent_author: {
      fid: number;
    };
    author: {
      object: "user";
      fid: number;
      username: string;
      display_name: string;
      custody_address: string;
      pfp_url: string;
      profile: {
        bio: {
          text: string;
          mentioned_profiles: string[];
        };
        location: {
          latitude: number;
          longitude: number;
          address: {
            city: string;
            state: string;
            state_code: string;
            country: string;
            country_code: string;
          };
        };
      };
      follower_count: number;
      following_count: number;
      verifications: string[];
      verified_addresses: {
        eth_addresses: string[];
        sol_addresses: string[];
      };
      verified_accounts: {
        platform: "x";
        username: string;
      }[];
      power_badge: boolean;
      experimental: {
        neynar_user_score: number;
      };
      viewer_context: {
        following: boolean;
        followed_by: boolean;
        blocking: boolean;
        blocked_by: boolean;
      };
    };
    text: string;
    timestamp: string;
    embeds: {
      url: string;
      metadata: {
        _status: string;
        content_type: string;
        content_length: number;
        image?: {
          height_px: number;
          width_px: number;
        };
        video?: {
          duration_s: number;
          stream: {
            codec_name: string;
            height_px: number;
            width_px: number;
          }[];
        };
        html?: {
          favicon: string;
          modifiedTime: string;
          ogArticleAuthor: string;
          ogArticleExpirationTime: string;
          ogArticleModifiedTime: string;
          ogArticlePublishedTime: string;
          ogArticlePublisher: string;
          ogArticleSection: string;
          ogArticleTag: string;
          ogAudio: string;
          ogAudioSecureURL: string;
          ogAudioType: string;
          ogAudioURL: string;
          ogAvailability: string;
          ogDate: string;
          ogDescription: string;
          ogDeterminer: string;
          ogEpisode: string;
          ogImage: {
            height: string;
            type: string;
            url: string;
            width: string;
            alt: string;
          }[];
          ogLocale: string;
          ogLocaleAlternate: string;
          ogLogo: string;
          ogMovie: string;
          ogPriceAmount: string;
          ogPriceCurrency: string;
          ogProductAvailability: string;
          ogProductCondition: string;
          ogProductPriceAmount: string;
          ogProductPriceCurrency: string;
          ogProductRetailerItemId: string;
          ogSiteName: string;
          ogTitle: string;
          ogType: string;
          ogUrl: string;
          ogVideo: {
            height: string;
            type: string;
            url: string;
            width: string;
          }[];
          ogVideoActor: string;
          ogVideoActorId: string;
          ogVideoActorRole: string;
          ogVideoDirector: string;
          ogVideoDuration: string;
          ogVideoOther: string;
          ogVideoReleaseDate: string;
          ogVideoSecureURL: string;
          ogVideoSeries: string;
          ogVideoTag: string;
          ogVideoTvShow: string;
          ogVideoWriter: string;
          ogWebsite: string;
          updatedTime: string;
          oembed: {
            type: "rich";
            version: string;
            title: string;
            author_name: string;
            author_url: string;
            provider_name: string;
            provider_url: string;
            cache_age: string;
            thumbnail_url: string;
            thumbnail_width: number;
            thumbnail_height: number;
            html: string;
            width: number;
            height: number;
          };
        };
      };
    }[];
    type: string;
    frames: {
      version: string;
      image: string;
      buttons: {
        title: string;
        index: number;
        action_type: string;
        target: string;
        post_url: string;
      }[];
      post_url: string;
      frames_url: string;
      title: string;
      image_aspect_ratio: string;
      input: {
        text: string;
      };
      state: {
        serialized: string;
      };
    }[];
    reactions: {
      likes: {
        fid: number;
      }[];
      recasts: {
        fid: number;
        fname: string;
      }[];
      likes_count: number;
      recasts_count: number;
    };
    replies: {
      count: number;
    };
    thread_hash: string;
    mentioned_profiles: {
      object: "user";
      fid: number;
      username: string;
      display_name: string;
      custody_address: string;
      pfp_url: string;
      profile: {
        bio: {
          text: string;
          mentioned_profiles: string[];
        };
        location: {
          latitude: number;
          longitude: number;
          address: {
            city: string;
            state: string;
            state_code: string;
            country: string;
            country_code: string;
          };
        };
      };
      follower_count: number;
      following_count: number;
      verifications: string[];
      verified_addresses: {
        eth_addresses: string[];
        sol_addresses: string[];
      };
      verified_accounts: {
        platform: "x";
        username: string;
      }[];
      power_badge: boolean;
      experimental: {
        neynar_user_score: number;
      };
      viewer_context: {
        following: boolean;
        followed_by: boolean;
        blocking: boolean;
        blocked_by: boolean;
      };
    }[];
    channel: {
      id: string;
      url: string;
      name: string;
      description: string;
      object: "channel";
      created_at: number;
      follower_count: number;
      external_link: {
        title: string;
        url: string;
      };
      image_url: string;
      parent_url: string;
      lead: {
        object: "user";
        fid: number;
        username: string;
        display_name: string;
        custody_address: string;
        pfp_url: string;
        profile: {
          bio: {
            text: string;
            mentioned_profiles: string[];
          };
          location: {
            latitude: number;
            longitude: number;
            address: {
              city: string;
              state: string;
              state_code: string;
              country: string;
              country_code: string;
            };
          };
        };
        follower_count: number;
        following_count: number;
        verifications: string[];
        verified_addresses: {
          eth_addresses: string[];
          sol_addresses: string[];
        };
        verified_accounts: {
          platform: "x";
          username: string;
        }[];
        power_badge: boolean;
        experimental: {
          neynar_user_score: number;
        };
        viewer_context: {
          following: boolean;
          followed_by: boolean;
          blocking: boolean;
          blocked_by: boolean;
        };
      };
      moderator_fids: number[];
      member_count: number;
      pinned_cast_hash: string;
      viewer_context: {
        following: boolean;
        role: "member";
      };
    };
    viewer_context: {
      liked: boolean;
      recasted: boolean;
    };
    author_channel_context: {
      following: boolean;
      role: "member";
    };
  }[];
  next: {
    cursor: string;
  };
};

export type IcebreakerChannel = {
  type: string;
  isVerified?: boolean;
  isLocked?: boolean;
  value?: string;
  url?: string;
  metadata?: {
    name: string;
    value: string;
  }[];
};

export type IcebreakerCredential = {
  name: string;
  chain: string;
  source?: string;
  reference?: string;
};

export type IcebreakerHighlight = {
  title?: string;
  url?: string;
};

export type IcebreakerWorkExperience = {
  jobTitle?: string;
  orgWebsite?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  isVerified?: boolean;
};

export type IcebreakerEvent = {
  id: string;
  source: string;
  name: string;
  description?: string;
  eventUrl?: string;
  imageUrl?: string;
};

export type IcebreakerGuildMembership = {
  guildId: number;
  roleIds: number[];
  isAdmin: boolean;
  isOwner: boolean;
  joinedAt: Date;
};

export type IcebreakerProfile = {
  profileID?: string;
  walletAddress: string;
  primaryWalletAddress?: string;
  avatarUrl?: string;
  displayName?: string;
  jobTitle?: string;
  bio?: string;
  location?: string;
  primarySkill?: string;
  networkingStatus?: string;
  channels?: IcebreakerChannel[];
  credentials?: IcebreakerCredential[];
  highlights?: IcebreakerHighlight[];
  workExperience?: IcebreakerWorkExperience[];
  events?: IcebreakerEvent[];
  guilds?: IcebreakerGuildMembership[];
};