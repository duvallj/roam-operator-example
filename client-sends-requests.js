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
  email.value = knock.email;
  botName.value = knock.name;
  instructions.value = knock.instructions;
  knockResult.innerHTML = knock.output ?? "";
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
