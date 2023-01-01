"""Madlibs Stories."""

from json import load


class Story:
    """Madlibs story.

    To  make a story, pass a list of prompts, and the text
    of the template.

        >>> s = Story(["noun", "verb"],
        ...     "I love to {verb} a good {noun}.")

    To generate text from a story, pass in a dictionary-like thing
    of {prompt: answer, promp:answer):

        >>> ans = {"verb": "eat", "noun": "mango"}
        >>> s.generate(ans)
        'I love to eat a good mango.'
    """

    def __init__(self, words, text):
        """Create story with words and template text."""

        self.prompts = words
        self.template = text

    def generate(self, answers):
        """Substitute answers into text."""

        text = self.template

        for (key, val) in answers.items():
            text = text.replace("<" + key + ">", val)

        return text


# Here's a story to get you started
story1 = Story(
    ["place", "noun", "verb", "adjective", "plural_noun"],
    """Once upon a time in a long-ago <place>, there lived a
       large <adjective> <noun>. It loved to <verb> <plural_noun>."""
)

with open("static/stories.json", mode="r") as file:
    data = load(file)

story_list = {}

# Makes dictionary of stories with title as key
for story in data["templates"]:
    # Combine template into string with <prompt> for prompts
    template = "<prompt>".join(story["template"])
    # Replace <prompt> with <noun>, <verb>, etc
    for prompt in story["prompts"]:
        template = template.replace("<prompt>", f"<{prompt}>", 1)

    # Make new instance of story and save it to dict
    story_list[story["title"]] = Story(story["prompts"], template)
