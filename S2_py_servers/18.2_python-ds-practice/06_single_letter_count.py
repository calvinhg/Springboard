def single_letter_count(word, letter):
    """How many times does letter appear in word (case-insensitively)?

        >>> single_letter_count('Hello World', 'h')
        1

        >>> single_letter_count('Hello World', 'z')
        0

        >>> single_letter_count("Hello World", 'l')
        3
    """

    word = word.upper()
    letter = letter.upper()
    return word.count(letter)


# print(single_letter_count('Hello World', 'h'), single_letter_count(
#     'Hello World', 'z'), single_letter_count("Hello World", 'l'))
