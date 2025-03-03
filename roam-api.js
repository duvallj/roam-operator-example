/**
 * @typedef {Object} Knock
 * @property {string} id
 * @property {string} name
 * @property {string} instructions
 * @property {string} target
 * @property {string} [output]
 */

/**
 * Tells your bot to knock on someone's door.
 *
 * @param {string} apiKey - Your API Key
 * @param {string} email - Email of the person to visit.
 * @param {string} name - The name you want your bot to show up as.
 * @param {string} instructions - System instructions passed to the LLM
 * @returns {Promise<Knock>} The created knock
 */
const createKnock = async (apiKey, email, name, instructions) => {
  return await makeRequest(apiKey, "POST", "bot.knock.create", {
    target: email,
    name,
    instructions,
  });
};

/**
 * Checks the status of a knock.
 *
 * @param {string} apiKey - Your API Key
 * @param {string} knockId - The ID of the knock record to retrieve
 * @returns {Promise<Knock>} The specified knock
 */
const checkKnock = async (apiKey, knockId) => {
  return await makeRequest(apiKey, "GET", "bot.knock.info", { id: knockId });
};

/**
 * Makes an arbitrary request to the Roam API.
 */
const makeRequest = async (apiKey, method, path, body) => {
  let url = new URL(path, ROAM_BASE_URL).toString();
  if (method === "GET") {
    url = `${url}?${new URLSearchParams(body)}`;
  }
  const response = await fetch(url, {
    body: method === "POST" ? JSON.stringify(body) : undefined,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method,
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
};

/**
 * NOTE: If this code runs on a server, you should uncomment the following:
 */
// const ROAM_BASE_URL = new URL("https://api.ro.am/v0/");
