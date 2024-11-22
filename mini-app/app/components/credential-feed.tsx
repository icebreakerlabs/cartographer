"use client"

import React from "react";
import useSWR from 'swr';
import { getCredentialFeed } from '../lib/credential-feed';
import { CastData, FeedResponse } from "../lib/types";
import { FarcasterEmbed } from "react-farcaster-embed/dist/client";

import "react-farcaster-embed/dist/styles.css";

function convertCastToCastData(cast: FeedResponse['casts'][0]): CastData {
    return {
        hash: cast.hash,
        threadHash: cast.thread_hash,
        parentSource: cast.parent_url ? { type: "url", url: cast.parent_url } : undefined,
        author: {
            fid: cast.author.fid,
            username: cast.author.username,
            displayName: cast.author.display_name,
            pfp: {
                url: cast.author.pfp_url,
            },
            profile: {
                bio: {
                    text: cast.author.profile.bio.text,
                },
            },
            followerCount: cast.author.follower_count,
            followingCount: cast.author.following_count,
        },
        text: cast.text,
        timestamp: new Date(cast.timestamp).getTime(),
        embeds: {
            images: cast.embeds?.filter(embed => embed.metadata?.content_type?.includes("image")).map(embed => ({
                type: "image",
                url: embed.url,
                sourceUrl: embed.url,
                alt: embed.metadata?.html?.ogDescription || "",
            })) || [],
            urls: cast.embeds?.filter(embed => embed.metadata?.content_type === "text/html").map(embed => ({
                type: "url",
                openGraph: {
                    url: embed.url,
                    title: embed.metadata?.html?.ogTitle,
                    description: embed.metadata?.html?.ogDescription,
                    image: embed.metadata?.html?.ogImage?.[0]?.url,
                },
            })) || [],
        },
        reactions: {
            count: cast.reactions.likes_count || 0,
        },
        recasts: {
            count: cast.reactions.recasts_count || 0,
        },
        replies: {
            count: cast.replies.count || 0,
        },
        tags: []
    };
}

export default function CredentialFeed() {
    const [query, setQuery] = React.useState<string>('');
    const [searchTriggered, setSearchTriggered] = React.useState<boolean>(false);

    const { data: credentialFeed, error, isValidating } = useSWR(
        searchTriggered ? query : null,
        getCredentialFeed,
        { revalidateOnFocus: false }
    );

    const handleSearch = () => {
        setSearchTriggered(true);
    };

    return (
        <div>
            <div className="flex flex-row gap-2 items-center">
                <input
                    className="px-2.5 py-1.5 rounded-xl text-black placeholder:text-black"
                    type="text"
                    value={query}
                    placeholder="Enter credential"
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    className="px-2.5 py-1.5 rounded-xl bg-blue-500 text-white"
                    onClick={handleSearch}
                >
                    <p>Search</p>
                </button>
            </div>
            {isValidating && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin text-center text-lg font-medium">
                        Loading...
                    </div>
                </div>
            )}
            {error && <div>Error loading data</div>}
            {credentialFeed && (
                <div className="pt-3">
                    <div className="flex flex-col gap-2 items-start">
                        {credentialFeed.casts.map((cast: FeedResponse['casts'][0]) => (
                            <div key={`cast-${cast.hash}`} className="w-full md:w-[65%]">
                                <FarcasterEmbed castData={convertCastToCastData(cast)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}