"""Word Finder: finds random words from a dictionary."""
from random import choice


class WordFinder:
    """Class that parses a file of line-separated words
        and saves its content to a list.
        Has a random() function that returns a 
        a random word from the file.

    >>> wf = WordFinder("words.txt")
    235886 words read

    # >>> wf.random()

    # >>> wf.random()

    # >>> wf.random()

    # >>> wf.random()
    """

    def __repr__(self) -> str:
        return f"WordFinder({self.filename})"

    def __str__(self) -> str:
        return f"Word Finder with filename: {self.filename}"

    def __init__(self, filename) -> None:
        """Class initializer. Saves filename as variable, 
            reads file and prints how many words were read."""
        self.filename = filename
        self.parse_file()

        print(len(self.data), "words read")

    def parse_file(self) -> None:
        """Parses file and saves data"""
        with open(self.filename, mode="r") as file:
            self.data = file.read().strip().split("\n")

    def random(self) -> str:
        """Returns random word from the file"""
        return choice(self.data)


class SpecialWordFinder(WordFinder):
    """Special version that filters out empty newlines and comments

    >>> wf = SpecialWordFinder("special_words.txt")
    235886 words read

    # >>> wf.random()

    # >>> wf.random()

    # >>> wf.random()

    # >>> wf.random()"""

    def __repr__(self) -> str:
        return "Special" + super().__repr__()

    def __str__(self) -> str:
        return f"Special {super().__str__()}"

    def __init__(self, filename) -> None:
        super().__init__(filename)

    def parse_file(self) -> None:
        """Parses file and filters out empty lines and line that start with '#'"""
        with open(self.filename, mode="r") as file:
            all_lines = file.read().strip().split("\n")
            self.data = [
                line for line in all_lines if line != "" and not line.startswith("#")]
