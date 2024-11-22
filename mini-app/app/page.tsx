import CredentialFeed from "./components/credential-feed";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)] p-2">
        <div className="p-5">
          <CredentialFeed />
        </div>
    </div>
  );
}