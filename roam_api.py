import json
import urllib.parse
import urllib.request
from dataclasses import dataclass
from typing import Any, LiteralString, Optional


@dataclass
class Knock:
    id: str
    name: str
    instructions: str
    target: str
    output: Optional[str]


class Client:
    api_key: str

    def __init__(self, api_key: str):
        self.api_key = api_key

    def create_knock(self, email: str, name: str, instructions: str) -> Knock:
        """
        Tells your bot to knock on someone's door.

        email -- Email of the person to visit.
        name -- The name you want your bot to show up as.
        instructions - System instructions passed to the LLM

        Returns the created knock.
        """

        res = self.make_request('POST', 'bot.knock.create', {
                                'target': email, 'name': name, 'instructions': instructions, })
        return Knock(**res)

    def check_knock(self, knockId: str) -> Knock:
        """
        Checks the status of a knock.

        knockId -- The ID of the knock record to retrieve.

        Returns the specified knock.
        """

        res = self.make_request('GET', 'bot.knock.info', {'id': knockId})
        return Knock(**res)

    def make_request(self, method: LiteralString, path: str, body: dict[str, str]) -> Any:
        """
        Makes an arbitrary request to the Roam API.
        """
        url = urllib.parse.urljoin(ROAM_BASE_URL, path)
        if method == 'GET':
            url += '?'
            url += urllib.parse.urlencode(body)

        data = None
        if method == 'POST':
            data = json.dumps(body).encode('utf-8')

        req = urllib.request.Request(
            url,
            data=data,
            headers={
                'Authorization': f'Bearer {self.api_key}',
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            method=method,
        )

        with urllib.request.urlopen(req) as res:
            return json.load(res)


ROAM_BASE_URL = 'https://api.ro.am/v0/'
