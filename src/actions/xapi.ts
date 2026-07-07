"use server";

export async function sendXAPIStatement(
  verbId: string, 
  verbDisplay: string, 
  objectId: string, 
  objectName: string, 
  objectDescription?: string
) {
  const LRS_ENDPOINT = process.env.LRS_ENDPOINT;
  const LRS_USERNAME = process.env.LRS_USERNAME;
  const LRS_PASSWORD = process.env.LRS_PASSWORD;
  
  if (!LRS_ENDPOINT || !LRS_USERNAME || !LRS_PASSWORD) {
    console.warn("xAPI variables not configured in .env.local. Skipping LRS POST, but registering statement:");
    console.warn(`[xAPI Statement] User ${verbDisplay} ${objectName}`);
    return { success: false, reason: "Missing LRS configuration." };
  }

  // Phase 1-4 uses a dummy actor. This will be replaced with real user data in Phase 5.
  const actorEmail = "guest@smartslate.local";
  const actorName = "Guest Learner";

  const statement = {
    actor: {
      mbox: `mailto:${actorEmail}`,
      name: actorName,
      objectType: "Agent"
    },
    verb: {
      id: verbId,
      display: { "en-US": verbDisplay }
    },
    object: {
      id: objectId,
      definition: {
        name: { "en-US": objectName },
        description: { "en-US": objectDescription || objectName }
      },
      objectType: "Activity"
    }
  };

  try {
    const authHeader = "Basic " + Buffer.from(`${LRS_USERNAME}:${LRS_PASSWORD}`).toString("base64");
    
    const response = await fetch(LRS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Experience-API-Version": "1.0.3",
        "Authorization": authHeader
      },
      body: JSON.stringify(statement)
    });

    if (!response.ok) {
      console.error("Failed to send xAPI statement to LRS:", await response.text());
      return { success: false };
    }
    
    console.log(`[xAPI Statement Delivered] User ${verbDisplay} ${objectName}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending xAPI statement:", error);
    return { success: false };
  }
}
