"""Python serial number generator."""


class SerialGenerator:
    """Machine to create unique incrementing serial numbers.

    >>> serial = SerialGenerator(start=100)

    >>> serial.generate()
    100

    >>> serial.generate()
    101

    >>> serial.generate()
    102

    >>> serial.reset()

    >>> serial.generate()
    100
    """

    def __init__(self, start) -> None:
        self.start = self.curr = start

    def generate(self) -> int:
        self.curr += 1
        return (self.curr-1)

    def reset(self) -> None:
        self.curr = self.start
