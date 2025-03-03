/**
 * NOTE: We cannot run the requests from directly inside the web browser, so we
 * must specify a different baseUrl for the roam api. In this case, we have
 * Caddy set up to proxy our requests, so we'll use that configured endpoint:
 */
const ROAM_BASE_URL = new URL("/v0/", document.location.origin);

const form = document.querySelector("form");
const apiKey = document.querySelector("#apikey");
const email = document.querySelector("#email");
const botName = document.querySelector("#name");
const instructions = document.querySelector("#instructions");
const knockId = document.querySelector("#knockid");
const knockResult = document.querySelector("#knockresult");

/**
 * @param {Knock} - The knock to display on the page
 */
const displayKnock = (knock) => {
  knockId.value = knock.id;
  // email.value = knock.email; // TODO: this is returned as undefined, so don't override it
  botName.value = knock.name;
  instructions.value = knock.instructions;
  knockResult.innerHTML = knock.output ?? "(no output)";

  // Save all returned values
  [knockId, botName, instructions].forEach((element) => {
    localStorage.setItem(element.id, element.value);
  });
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  event.stopPropagation();
  console.log(event.submitter);
  switch (event.submitter?.id) {
    case "send":
      if (apiKey.value && email.value && botName.value && instructions.value) {
        const response = await createKnock(
          apiKey.value,
          email.value,
          botName.value,
          instructions.value,
        );
        displayKnock(response);
      }
      break;
    case "check":
      if (apiKey.value && knockId.value) {
        const response = await checkKnock(apiKey.value, knockId.value);
        displayKnock(response);
      }
      break;
  }
});

// Save/restore all values on page refresh, for convenience.
[apiKey, email, botName, instructions, knockId].forEach((element) => {
  element.addEventListener("change", (event) => {
    localStorage.setItem(element.id, event.target.value);
  });
  element.value = localStorage.getItem(element.id);
});
