import { BASE_URL, ICON_URL } from "../../lib/utils";

export async function GET() {
  const config = {
    "accountAssociation": {
      "header": "eyJmaWQiOjYxNiwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDVFNzlGNjkwY2NENDIwMDdENUEwYUQ2NzhDRDQ3NDc0MzM5NDAwRTMifQ",
      "payload": "eyJkb21haW4iOiJjYXJ0b2dyYXBoZXItbWluaS1hcHAudmVyY2VsLmFwcCJ9",
      "signature": "MHgzY2IyNDM0Yzg2ZTBkNzM1YzA2MzAyOWQyY2VkNmUxNTdkYmFhMDNhYjM1ZDgyMTc4ODRiNDAwMzlhYzg1NzQ5MWZiZjQ0NjVlMzI2M2RjYjk1ZGUzZDYzZWU3ZjgyMzNjOTA4YTJiZjlhMDZmOTA0ZWIzOWE0ZWRkNzJlYzlmZTFj"
    },
    frame: {
      version: "0.0.1",
      name: "Icebreaker Feeds",
      iconUrl: ICON_URL,
      splashImageUrl: ICON_URL,
      splashBackgroundColor: "#FFFFFF",
      homeUrl: BASE_URL,
    },
  };

  return Response.json(config);
}