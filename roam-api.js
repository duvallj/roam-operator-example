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
  return await makeRequest(apiKey, "bot.knock.create", {
    email,
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
  return await makeRequest(apiKey, "bot.knock.info", { id: knockId });
};

const baseUrl = new URL("https://api.roam.dev/v0/");

const makeRequest = async (apiKey, path, body) => {
  const response = await fetch(new URL(path, baseUrl), {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    method: "POST",
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  return await response.json();
};
