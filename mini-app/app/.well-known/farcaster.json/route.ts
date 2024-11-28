import { BASE_URL, ICON_URL } from "../../lib/utils";

export async function GET() {
  const config = {
    "accountAssociation": {
      "header": "eyJmaWQiOjYxNiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDVFNzlGNjkwY2NENDIwMDdENUEwYUQ2NzhDRDQ3NDc0MzM5NDAwRTMifQ",
      "payload": "eyJkb21haW4iOiJ3d3cuY2FydG9ncmFwaGVyLW1pbmktYXBwLnZlcmNlbC5hcHAifQ",
      "signature": "MHgwOWFjMjE2N2Y1ZWQ5MTg4NjFhMGVmNzYxOGUwMDc0ZDdlNzEzNmRiYzRlZDg5ZmFmMzliYzkwYjkyNjllOTZjMjRhNmE4OTE4NDA3ZTRiZjZiNTU3ZGRmYTVjM2ExMTQyOWVhMDc5NmY3ZGJlNjE1MmVmYWQyOTkzZTAwZThkNDFi"
    },
    frame: {
      version: "0.0.0",
      name: "Icebreaker Feeds",
      iconUrl: ICON_URL,
      splashImageUrl: ICON_URL,
      splashBackgroundColor: "#000000",
      homeUrl: BASE_URL,
    },
  };

  return Response.json(config);
}