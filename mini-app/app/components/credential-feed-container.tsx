"use client"

import React from "react"
import { IcebreakerCredential } from "../lib/types";

export default function CredentialFeedContainer(){
    const [query, setQuery] = React.useState<string>('');
    const [credential, setCredential] = React.useState<IcebreakerCredential | null>(null);

    const handleSearch = async() => {
        const credentialSearch = '';
    }

    return(
        <div>
            <div className="flex flex-row gap-2 items-center">
                <input className="px-2.5 py-1.5 rounded-xl text-black placeholder:text-black" type="text" value={query} placeholder="Enter credential" onChange={(e) => setQuery(e.target.value)} />
                <button className="px-2.5 py-1.5 rounded-xl bg-blue-500 text-white" onClick={() => handleSearch()}>
                    <p>Search</p>
                </button>
            </div>
        </div>
    )
}