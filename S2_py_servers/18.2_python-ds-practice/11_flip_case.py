def flip_case(phrase, to_swap):
    """Flip [to_swap] case each time it appears in phrase.

        >>> flip_case('Aaaahhh', 'a')
        'aAAAhhh'

        >>> flip_case('Aaaahhh', 'A')
        'aAAAhhh'

        >>> flip_case('Aaaahhh', 'h')
        'AaaaHHH'

    """

    return "".join([char.swapcase() if char.lower() == to_swap.lower() else char for char in phrase])


# print(flip_case("Aaaahhh", "a"))
# print(flip_case("Aaaahhh", "A"))
# print(flip_case("Aaaahhh", "h"))
