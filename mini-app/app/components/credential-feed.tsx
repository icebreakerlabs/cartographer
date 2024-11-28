"use client"

import React from "react";
import useSWR from 'swr';
import { getCredentialFeed } from '../lib/credential-feed';
import { CastData, FeedResponse } from "../lib/types";
import { FarcasterEmbed } from "react-farcaster-embed/dist/client";
import { credentials } from '../lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import "react-farcaster-embed/dist/styles.css";
import { ArrowDown } from "lucide-react";

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
    const [selectedCredential, setSelectedCredential] = React.useState<string>(credentials[0] || '');

    const { data: credentialFeed, error, isValidating } = useSWR(
        selectedCredential,
        getCredentialFeed,
        { revalidateOnFocus: false }
    );

    return (
        <div className="bg-white dark:bg-black min-h-screen text-black dark:text-white">
                <div className="pt-3 w-full xl:w-1/3 mx-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="px-4 py-3 mx-3 xl:mx-0 text-white dark:text-black rounded-xl bg-gray-700 dark:bg-white text-left flex flex-row gap-1 items-center" disabled={isValidating || error}>
                            Feed for {selectedCredential}
                            <ArrowDown className="size-5 pl-1" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {credentials.map((credential) => (
                                <DropdownMenuItem
                                    className="cursor-pointer"
                                    key={credential}
                                    onClick={() => setSelectedCredential(credential)}
                                >
                                    {credential}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {credentialFeed && credentialFeed.casts.length > 0 && (
                        <div className="flex flex-col gap-2 items-start">
                            {credentialFeed.casts.map((cast: FeedResponse['casts'][0]) => (
                                <div key={`cast-${cast.hash}`} className="w-[100%] mx-auto px-2 py-0">
                                    <FarcasterEmbed castData={convertCastToCastData(cast)} />
                                </div>
                            ))}
                        </div>
                    )}
                    {isValidating && (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin h-12 w-12 border-4 border-t-transparent border-gray-500 rounded-full"></div>
                        </div>
                    )}
                    {error && <div>Error loading data</div>}
                    {!isValidating && !credentialFeed && (
                        <div className="flex flex-row gap-2 justify-center items-center h-64 text-gray-500">
                            <div className="text-3xl">🔍</div>
                            <p className="text-lg font-medium">Select a credential above to see casts from all of its holders!</p>
                        </div>
                    )}
                </div>
        </div>
    );
}