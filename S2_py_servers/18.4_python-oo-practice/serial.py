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

    def __repr__(self) -> str:
        return f"SerialGenerator(start={self.start}, next={self.next})"

    def __str__(self) -> str:
        return f"Serial generator with start {self.start} and next {self.next}"

    def __init__(self, start, next=None) -> None:
        """Class initializer. Saves start and makes new current num"""
        self.start = start
        self.next = next if next else start

    def generate(self) -> int:
        """Increments current num and returns its previous value"""
        self.next += 1
        return (self.next-1)

    def reset(self) -> None:
        """Resets current num to start it was initialized with"""
        self.next = self.start
